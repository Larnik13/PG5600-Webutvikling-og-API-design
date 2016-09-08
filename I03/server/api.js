var express = require('express');
var apiRoutes = express.Router();
var config = require('./config');
var mongoose = require('mongoose');
var MongoDB = mongoose.connect(config.database).connection;
var util = require('./util');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var bcrypt = require('bcrypt');
var app = express();
var upload = multer();
app.set('secretString', config.secret);
var loaded = true;
var sockets = require('./sockets');
var parser = require('body-parser');

apiRoutes.use(parser.json());

apiRoutes.get('/message/:id', (req, res) => {
    const uploader = req.decoded;
    const id = req.params.id;
    util.getMessageById(id, (e, message) => {
        if(e) {
            return res.status(500).send({error: 'error while fetching messages'});
        }
        if(uploader !== message.uploader && !message.isPublic) {
            console.log('denied: ', uploader, message.uploader, message.isPublic);
            return res.status(403).send("Access denied");
        }
        return res.status(200).send(JSON.stringify(message));
    })
});

apiRoutes.get('/all/messages', (req, res) => {
  if(loaded){
      util.getMessages((e, messages) => {
          if(e){
              return res.status(500).send({error: 'error while fetching messages'});
          }
          messages.sort((msg1, msg2) => new Date(msg2.added).getTime() - new Date(msg1.added).getTime());
          messages = util.spliceArray(messages, 10);
          console.log(messages);
          return res.status(200).send(JSON.stringify(messages));
      });
  }
  else {
      return res.status(500).send({error: 'Service unavailable, try again later'});
  }
});

apiRoutes.post('/register', upload.array(), (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    console.log(req.body);
    const passwordHash = bcrypt.hashSync(password, salt);

    util.getUser(email, (e, user) => {
        if(e) {
            return res.status(500).send({error: 'error checking email'});
        }
        if(user){
            return res.status(409).send({error: 'user with this email already exists'});
        }
        util.createUser(firstname, lastname, email, passwordHash, (e, newmessage) => {
            if(e) {
                console.log(e);
                return res.status(500).send({error: 'Couldn\'t create user'});
            }
            else {
                return res.status(201).send('Successfully created user');
            }
        });
    });
});

apiRoutes.post('/login', upload.array(), (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log('body', req.body);
    util.getUser(email, (e, user) => {
        console.log('getUSer');
        if(e) {
            return res.status(500).send({error: "Internal server error"});
        }
        else if(user) {
            console.log('foundUSer');
            if(bcrypt.compareSync(password, user.get('passwordHash'))){
                console.log('verified');
                var token = jwt.sign(user.email, app.get('secretString'));
                return res.status(200).send(token);
            }
            else {
                return res.status(403).send("wrong password!");
            }
        }
        else {
            return res.status(404).send("User doesnt exist");
        }
    });
});

apiRoutes.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, app.get('secretString'), (e, decoded) => {
            if(e){
                return res.status(403).send('Access denied, couldnt verify token');
            } else{
                req.decoded = decoded;
                return next();
            }
        });
    }
    else {
        return res.status(403).send("Access denied, no token provided!");
    }
});

apiRoutes.get('/users/:username', (req, res) => {
    const username = req.params.username;
    console.log('getUSer');
    util.getUser(username, (e, user) => {
        if(e) {
            return res.status(500).send({error: 'error while fetching messages'});
        }
        if(user) {
            return res.status(200).send(JSON.stringify(user));
        }
        return res.status(404).send("User doesnt exist");
    })
});

apiRoutes.get('/:uploader/messages', (req, res) => {
    const uploader = req.decoded;
    if(uploader === req.params.uploader){
        util.getAllMessagesForUser(uploader,  (e, messages) => {
            if(e) {
                return res.status(500).send({error: 'error while fetching messages'});
            }
            return res.status(200).send(JSON.stringify(messages));
        });
    }
    else {
        util.getPublicMessagesForUser(req.params.uploader,  (e, messages) => {
            if(e) {
                return res.status(500).send({error: 'error while fetching messages'});
            }
            return res.status(200).send(JSON.stringify(messages));
        });
    }
});

apiRoutes.get('/all/messages/:uploader', (req, res) => {
    const uploader = req.decoded;
    console.log(uploader);
    if(uploader === req.params.uploader){
         util.getMessages((e, messages) => {
            if(e) {
                return res.status(500).send({error: 'error while fetching messages'});
            }
            else {
                util.getPrivateMessagesForUser(uploader, (error, msgs) => {
                    if(e) {
                        return res.status(500).send({error: 'error while fetching messages'});
                    }
                    else {
                        var all = [...messages, ...msgs];
                        all.sort((msg1, msg2) => new Date(msg2.added).getTime() - new Date(msg1.added).getTime());
                        all = util.spliceArray(all, 30);
                        return res.status(200).send(JSON.stringify(all));
                    }
                });
            }
        });
    }
    else {
        return res.status(403).send('Access denied!');
    }
});

apiRoutes.delete('/:uploader/messages/:id', (req, res) => {
    const uploader = req.decoded;
    const id = req.params.id;
    if(uploader === req.params.uploader) {
        util.deleteMessage(id, uploader, (e, message) => {
            if(e){
                return res.status(500).send({error: 'Couldn\'t delete message, please try again!'});
            }
            else if(message !== null) {
                console.log('isPublic', message.isPublic)
                if(message.isPublic) {
                    const newMessage = {
                        'action': 'reload'
                    }
                    sockets.broadcast(uploader, newMessage);
                }
                return res.status(204).send();
            }
            else{
                return res.status(404).send({error: 'Couldn\'t find the message you were looking for!'});
            }
        });
    }
    else {
        res.status(403).send({error: 'Access denied!'});
    }
});

apiRoutes.post('/:uploader/messages', upload.array(), (req, res) => {
    const uploader = req.decoded;
    console.log(req.body);
    const text = req.body.text;
    const isPublic = req.body.isPublic;

    if(uploader === req.params.uploader){
        util.createMessage(text, isPublic, uploader, (e, message) => {
            if(e) {
                return res.status(500).send({error: 'error while posting message'});
            }
            if(message.isPublic) {
                const newMessage = {
                    'action': 'reload'
                }
                sockets.broadcast(uploader, newMessage);
            }
            return res.status(200).send(message._id);
        });
    }
    else {
        return res.status(403).send({error: 'Access denied!'});
    }
});

apiRoutes.put('/:uploader/messages/:id/ispublic', upload.array(), (req, res) => {
    const isPublic = true;
    console.log('isPublic', isPublic);
    const uploader = req.decoded;
    const id = req.params.id;

    if(uploader == req.params.uploader) {
        util.updateIsPublic(id, uploader, isPublic, (e, message) => {
            if(e) {
                return res.status(500).send({error: 'error while updating message'});
            }
            const newMessage = {
                'action': 'reload'
            }
            sockets.broadcast(uploader, newMessage);
            return res.status(200).send('Successfully updated message');
        });
    }
    else {
        return res.status(403).send({error: 'Access denied!'});
    }
});

apiRoutes.put('/:uploader/messages/:id/isprivate', upload.array(), (req, res) => {
    const isPublic = false;
    console.log('isPublic', isPublic);
    const uploader = req.decoded;
    const id = req.params.id;

    if(uploader == req.params.uploader) {
        util.updateIsPublic(id, uploader, isPublic, (e, message) => {
            if(e) {
                return res.status(500).send({error: 'error while updating message'});
            }
            const newMessage = {
                'action': 'reload'
            }
            sockets.broadcast(uploader, newMessage);
            return res.status(200).send('Successfully updated message');
        });
    }
    else {
        return res.status(403).send({error: 'Access denied!'});
    }
});

apiRoutes.put('/all/messages/:id/upvoter', upload.array(), (req, res) => {
    const uploader = req.decoded;
    const id = req.params.id;
    var shouldAdd = true;
    util.getMessageById(id, (e, msg) => {
        if(e) {
            return res.status(500).send({error: 'error while updating message'});
        }
        if(!msg) {
            return res.status(404).send({error: 'Couldn\'t find the message you were looking for!'});
        }
        msg.upvoters.forEach(upvoter => {
            console.log('upvoter', upvoter.name);
            if(upvoter.name === uploader) {
                shouldAdd = false;
            }
        });
        console.log(msg, uploader, id, shouldAdd, req.body);
        if(shouldAdd) {
            util.addUpvote(id, uploader, (e) => {
                if(e) {
                    return res.status(500).send({error: 'error while updating message'});
                }
                console.log('isPublic upvoter', msg.isPublic);
                if(msg.isPublic) {
                    const newMessage = {
                        'action': 'update',
                        'id': id
                    }
                    sockets.broadcast(uploader, newMessage);
                }
                return res.status(200).send('Successfully updated message');
            });
        }
        else {
            util.removeUpvote(id, uploader, (e) => {
                if(e) {
                    return res.status(500).send({error: 'error while updating message'});
                }
                if(msg.isPublic) {
                    const newMessage = {
                        'action': 'update',
                        'id': id
                    }
                    sockets.broadcast(uploader, newMessage);
                }
                return res.status(200).send('Successfully updated message');
            });
        }
    });
});

module.exports = apiRoutes;
var User  = require('./models/user');
var Message = require('./models/message');

exports.spliceArray = (array, maxLength) => {
    //array = JSON.Stringify(array);
    array.sort((a, b) => {
        if(a.added > b.added) {
            return 1;
        }
        if(a.added < b.added) {
            return -1
        }
        return 0;
    });
    var length = array.length;
    var messagesToSplice = length - maxLength;
    if(messagesToSplice > 0) {
        array.splice(maxLength, messagesToSplice);
    }
    return array;
}

exports.createUser = (firstname, lastname, email, passwordHash, callback) => {
    var newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        passwordHash: passwordHash
    });
    newUser.save(callback);
}

exports.getUser = (email, callback) => {
    User.findOne({email: email}, callback);
}

exports.getMessages = (callback) => {
    Message.find({isPublic: true}, callback).sort({'added': -1});
}

exports.getMessageById = (id, callback) => {
    Message.findOne({_id: id}, callback);
}

exports.createMessage = (text, isPublic, uploader, callback) => {
    var newMessage = new Message({
        text: text,
        isPublic: isPublic,
        upvoters: [],
        uploader: uploader
    });
    newMessage.save(callback);
}

exports.deleteMessage = (id, uploaderEmail, callback)  => {
    Message.findOneAndRemove({_id: id, uploader: uploaderEmail}, callback);
}

exports.getPrivateMessagesForUser = (uploaderEmail, callback) => {
    Message.find({uploader: uploaderEmail, isPublic: false}, callback).sort({'added': -1});
}

exports.getPublicMessagesForUser = (uploaderEmail, callback) => {
    Message.find({uploader: uploaderEmail, isPublic: true}, callback).sort({'added': -1});
}

exports.getAllMessagesForUser = (uploaderEmail, callback) => {
    Message.find({uploader: uploaderEmail}, callback).sort({'added': -1});
}

exports.updateIsPublic = (id, uploaderEmail, isPublic, callback) => {
    Message.update({_id: id, uploader: uploaderEmail}, {isPublic: isPublic}, callback);
}

exports.removeUpvote = (id, upvoterEmail, callback) => {
    Message.update({_id: id}, {$pull: {upvoters: {name: upvoterEmail}}}, callback);
}

exports.addUpvote = (id, upvoterEmail, callback) => {
    Message.update({_id: id}, {$push: {upvoters: {name: upvoterEmail}}}, callback);
}

const ws = require('ws');
const connections = [];

exports.connect = httpServer => {
     const wsServer = new ws.Server({server: httpServer});
     wsServer.on('connection', socket => {
         console.log('opened socket');
        socket.send('{"text": "Hello, sockets!"}');
        connections.push({ socket: socket, username: ''});
        socket.onclose = () => {
            console.log('-------CLOSED--------');
            connections.splice(connections.indexOf(socket), 1);
        }
        socket.on('message', msg => {
            var received = JSON.parse(msg);
            console.log('receivedMessage', received);
            if(received.userLoggedIn) {
                connections.forEach(con => {
                    if (con.socket === socket) {
                        con.username = received.userLoggedIn;
                        console.log('conSocketUSername', con.username);
                    }
                });
            }
        });
     });
};

exports.broadcast = (userToExclude, msg) => {
    var cons = connections;
    cons.forEach(c => console.log('allCons', c.username));
    if(userToExclude) {

        cons = cons.filter(con => {
            console.log('excluding filter', con.username, userToExclude);
            return con.username !== userToExclude
        });
        console.log('filtered', cons);
    }
    console.log(msg);
    cons.forEach(con => {
        con.socket.send(JSON.stringify(msg))
    });
}

//Whatever interaction using chat server via sockets will be done over here
module.exports.chatSockets = function(socketServer){
    
    //io will be handling the connections

    let io = require('socket.io')(socketServer);

    //whenever a connection is established, we get a callback with socket

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected');
        });

        //.on detects an event that was sent by the client
        socket.on('join_room', function(data){
            console.log('joining request received', data);

            //Socket to be joined to that particular room
            //data.chatroom will do -> If a chatroom with this name chatroom : 'codeial' already exists, the user will be connected to that chatroom
            //If the chatroom doesn't exist, it will create a chatroom and enter into it

            socket.join(data.chatroom);

            //Other users to receive a notification that this user has joined the chatroom

            io.in(data.chatroom).emit('user_joined', data);
        });

        //detect send_message and broadcast to everyone in the room

        socket.on('send_message', function(data){

            io.in(data.chatroom).emit('receive_message',data);
        });
    });

}
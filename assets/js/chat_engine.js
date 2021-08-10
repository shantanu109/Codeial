//FrontEnd established for creating a connection

class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //io is a global variable that is available as soon as we included cdn file
        //io has been given to us by socket.io file

        //We are sending the connect request and calling the connection handler

        this.socket = io.connect('http://3.235.156.161:5000');

        if (this.userEmail){
            this.connectionHandler();
        }
    }

    //This connectionHandler will have to and fro interaction b/w server and subscriber

    //connectionHandler detects if the connection has been completed
    //Once, connection established, the backend sends back an acknowledgment by emitting a connect request to connectionHandler automatically

    connectionHandler(){

        let self = this;

        this.socket.on('connect', function(){

            console.log('connection established using sockets');

            //.emit, I'm sending an event
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined', data);
            })

        });

        //Send a message on clicking the send message button

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){

                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });


        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            //construct another 'li' and append it to 'ul'

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                //This class determines the background color and alignment of the message
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}
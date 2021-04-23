const nodeMailer = require('../config/nodemailer');



//Create a function that will send that mail
//This is another way of exporting a method

exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({

        from: 'shantanupandey790@gmail.com',
        //In case of post, it would be comment.post.user.email
        to: comment.user.email,
        subject: 'New Comment Published',
        html: htmlString
    }, //info carries the information about the request that has been sent
        (err, info) => {

            if (err){
                console.log('Error in sending mail',err);
                return;
            }

            console.log('Message sent', info);
            return;

        });

}

//Whenever a new comment is made, I just need to call this mailer
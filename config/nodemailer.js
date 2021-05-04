const nodemailer = require('nodemailer');

const ejs = require('ejs');

const path = require('path');

const env = require('./environment');





//transporter will be an object which will be assigned with this nodemailer
//This is the path which sends the email
//Defines how communication will take place

let transporter = nodemailer.createTransport(env.smtp);

//Defines whenever I'm going to send an HTML email, where the file would be placed inside('views/mailers')


let renderTemplate = (data, relativePath) => {

    //Defined a variable from where I'll be storing what all HTML will be going to be sent to the mail

    let mailHTML;

    //we are going to use ejs to render that template

    ejs.renderFile(
        
        //relativePath is the place from where this function is being called
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err,template){

            if (err){
                console.log('Error in rendering template',err);
                return;
            }

            mailHTML = template;
        }

    )

    return mailHTML;

}

//Since we've defined these two properties, we're going to export it

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
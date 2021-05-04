// This file will contain environments -> Development and Production

const fs = require('fs');

const rfs = require('rotating-file-stream');

const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {

    //Setting up our development environment

    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {

        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'shantanupandey790@gmail.com',
            pass: '$Hantanu0000'
        }
    },
    google_client_id: '755799322639-0sbldhmvenbg1drjn9780n70dfelk6p6.apps.googleusercontent.com',
    google_client_secret: '59v2_bVHXvrF8z1rswSk_rla',
    google_call_back_url: 'http://localhost:800/users/auth/google/callback',
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }

}


const production = {

    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIALSESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {

        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}

//String saying 2+2, it will evaluate

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
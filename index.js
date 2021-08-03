const express = require('express');

const env = require('./config/environment');

const logger = require('morgan');


const cookieParser = require('cookie-parser');

const app = express();

require('./config/view-helpers')(app);

const port = 8000;

const expressLayouts = require('express-ejs-layouts');

//When I start my server, it will require all these things. While requiring my Mongoose file, it will go and run mongoose.js part

const db = require('./config/mongoose');

//Used for session cookie 

const session = require('express-session');

const passport = require('passport');

//File for passport local strategy

const passportLocal = require('./config/passport-local-strategy');

const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');

//Set it up to be used

const flash = require('connect-flash');

const customMware = require('./config/middleware');

//Set up the chat server to be used with socket.io

const chatServer = require('http').Server(app);

//This is going to out file
//Function is going to be used over here

const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000);

console.log('Chat Server is listening on Port 5000');

const path = require('path');

//In the production mode, it shouldn't be running sassMiddleware everytime

if (env.name == 'development'){

    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));

}


app.use(express.urlencoded());

app.use(cookieParser());

//In which folder should the app lookout for Static files

app.use(express.static(env.asset_path));

// make the uploads path available to the browser
// codeial/uploads is available on /uploads path now
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

//Extract style and scripts from sub pages into the layout

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);





//Set Up The View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

//MongoStore is used to store the session cookie in the Database

app.use(session({
    name: 'codeial',
    //ToDo Change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },

    store: new MongoStore(
        {
        
            mongooseConnection: db,
            autoRemove: 'disabled'
        },

        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//This uses Session cookie, the flash msgs will be set up in cookies which store session information

app.use(flash());
app.use(customMware.setFlash);

//Use express router

app.use('/', require('./routes/index'));

app.use(express.static(__dirname + '/public'));



app.listen(port, function(err){

    if (err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
    
});


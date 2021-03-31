const express = require('express');

const cookieParser = require('cookie-parser');

const app = express();

const port = 800;

const expressLayouts = require('express-ejs-layouts');

//When I start my server, it will require all these things. While requiring my Mongoose file, it will go and run mongoose.js part

const db = require('./config/mongoose');

//Used for session cookie 

const session = require('express-session');

const passport = require('passport');

const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

//In which folder should the app lookout for Static files

app.use(express.static('./assets'));

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
    secret: 'blahsomething',
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

//Use express router

app.use('/', require('./routes/index'));



app.listen(port, function(err){

    if (err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
    
});


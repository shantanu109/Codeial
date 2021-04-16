const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')


//Authentication Using Passport

//Finding the user and Authenticating them

passport.use(new LocalStrategy({

        usernameField: 'email',
        passReqToCallback: true
    },

    function(req, email, password, done){

        //Find a user and establish the identity

        User.findOne({email: email}, function(err, user){

            if (err){
                req.flash('error',err);
                return done(err)
            }

            if (!user || user.password != password){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);

        });


    }
));

//Serializing the user to decide which key is to be kept in the cookies

//Once the user is found, we serialize them, we find out which property to send to the cookie

passport.serializeUser(function(user, done){
    
    //We are just wanting to store User's id (encrypted format) into the cookie
    done(null, user.id);

});





//Deserializing the user from the key in the cookies

//We need to find which user is Signed In 

passport.deserializeUser(function(id, done){

    User.findById(id, function(err,user){
        if(err){
            console.log('Error in finding user ----> Passport');
            return done(err);
        }

        return done(null,user)


    })

});

//Send In data of Signed In Current User to Views

//Check if User is authenticated

passport.checkAuthentication = function(req,res,next){

    //Passport puts a method on Request (IsAuthenticated).....

    //If the User is signed In, then pass on the request to the next function(controller's action)

    if (req.isAuthenticated()){
        return next();
    }

    //If the User is not signed In

    return res.redirect('/users/sign-in');


}

passport.setAuthenticatedUser = function(req,res,next){

    if (req.isAuthenticated()){

        //Whenever a user is Signed In, that user's information is available in request.user
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views

        res.locals.user = req.user;
        
    }
    next();
}




module.exports = passport;
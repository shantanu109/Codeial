const passport = require('passport');


//Importing the strategy

const JWTStrategy = require('passport-jwt').Strategy;

//Importing a module which will help us extract JWT from the header

const ExtractJWT = require('passport-jwt').ExtractJwt;

//We'll be needing User model for establishing identity

const User = require('../models/user');

const env = require('./environment');

let opts = {
    //Header -> key Authorization(list of keys) -> key Bearer has JWT token

    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}

//Here we donot need to match the password, because we are matching the JWT thing
//Used to authenticate the JWT
//User is already present in the JWT, you are just fetching out the ID from the payload and checking if the user is there or not


passport.use(new JWTStrategy(opts, function(jwtPayload, done){

    User.findById(jwtPayload._id, function(err,user){

        if (err){
            console.log('Error in finding user from JWT'); 
            return;

        }

        if (user){
            return done(null, user);

        } else {
            return done(null, false);
        }
    })

}));


module.exports = passport;

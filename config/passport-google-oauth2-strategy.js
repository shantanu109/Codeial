const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');



//Tell passport to use a new strategy for google login : GoogleStrategy

passport.use(new googleStrategy({

        clientID: '755799322639-0sbldhmvenbg1drjn9780n70dfelk6p6.apps.googleusercontent.com',
        clientSecret: '59v2_bVHXvrF8z1rswSk_rla',
        callbackURL: 'http://localhost:800/users/auth/google/callback'
    },

    function(accessToken, refreshToken, profile, done){

        //Find a user

        User.findOne({email: profile.emails[0].value}).exec(function(err,user){

            if (err){
                console.log('error in google strategy-passport', err);
                return;
            }

            console.log(accessToken,refreshToken);

            console.log(profile);

            if (user){

                //if found, set this user as req.user
                return done(null, user);
            } else{

                //if not found, create the user and set it as req.user

                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err,user){

                    if (err){
                        console.log('error in creating User', err);
                        return;
                    } 

                    return done(null,user);
        

                });
            }
        });
    }
));


module.exports = passport
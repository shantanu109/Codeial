//Import the Model

const User = require('../models/user');

module.exports.profile = function(req,res){

    return res.render('user_profile', {
        title: "Users"
    });
}

//Render the Sign Up Page

module.exports.signUp = function(req,res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


//Render the Sign In Page

module.exports.signIn = function(req,res){
    return res.render('user_sign_in', {
        title:'Codeial | Sign In'
    })
}


//Get the sign Up data

module.exports.create = function(req,res){

    if (req.body.password != req.body.confirm_password)
    {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err,user){
        if (err)
        {
            console.log('Error in finding user in Signing Up');
            return;
        }

        if (!user)
        {
            User.create(req.body, function(err,user){
                if(err)
                {
                    console.log('Error in creating a user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }
        else
        {
            return res.redirect('back');
        }

    })



}

//Sign in and Create the session for User

module.exports.createSession = function(req,res){

}
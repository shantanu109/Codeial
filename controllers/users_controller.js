//Import the Model

const User = require('../models/user');

const fs = require('fs');

const path = require('path');

module.exports.profile = function(req,res){

    User.findById(req.params.id,function(err,user){

        return res.render('user_profile', {
            title: "User Profile",
            profile_user:user
        });

    });

}

//Update Action

module.exports.update =  async function(req,res){

    // if (req.user.id == req.params.id){

    //     //User which has been updated

    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         return res.redirect('back');

    //     });
    // } else {
    //     return res.status(401).send('Unauthorized');
    // }

    if (req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){

                if (err){
                    console.log('********Multer Error', err);
                }

                //I wouldn't have been able to read body without multer because my form is multipart

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){

                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));


                    }
                    //This is saving the path of the uploaded file into the avatar field in the user
                    //user.avatar = current user

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');


            });


        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }

    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');

    }


}

//Render the Sign Up Page

module.exports.signUp = function(req,res){
    
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


//Render the Sign In Page

module.exports.signIn = function(req,res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile/user.id');
    }

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

    req.flash('success','Logged In Successfully');


    return res.redirect('/');

}


module.exports.destroySession = function(req,res){

    req.logout();

    req.flash('success','You have Logged Out');

    return res.redirect('/');
}
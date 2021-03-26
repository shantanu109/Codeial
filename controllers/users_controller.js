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



}

//Sign in and Create the session for User

module.exports.createSession = function(req,res){

}

const User = require('../../../models/user');

const jwt = require('jsonwebtoken');



module.exports.createSession = async function(req,res){

    //Whenever a username and password is received, we need to find that user and generate JWT corresponding to that user
    
    try {

        let user = await User.findOne({email: req.body.email});

        if (!user || user.password != req.body.password){

            return res.json(422, {
                message: 'Invalid username/password'
            });

        }

        return res.json(200, {
            message: 'Sign In Successful, here is your token, plz keep it safe',

            data: {

                //user.JSON() part gets encrypted

                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '100000'})
            }
        })

    } catch(err){

        console.log(err);
        
        return res.json(500, {
            message: 'Internal Server Error'
        });

    }
    


}
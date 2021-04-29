const Like = require('../models/like');

const Post = require('../models/post');

const Comment = require('../models/comment');




module.exports.toggleLike = async function(req,res){

    try{

        // likes/toggle/?id=abcdef&type=Post

        let likeable;

        //when you receive your JSON data back, you can increment or decrement the count of likes which is displayed on our page

        let deleted = false;



        if (req.query.type=='Post'){

            //To show that if the Post contains other likes

            likeable = await Post.findById(req.query.id).populate('likes');


        }else{

            likeable = await Comment.findById(req.query.id).populate('likes');

        }



        //Check if a like already exists

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        //If a like already exists, then delete it

        if (existingLike){

            likeable.likes.pull(existingLike._id);
            likeable.save();
            
            existingLike.remove();
            deleted = true



        } else{
            //make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
 
            });

            likeable.likes.push(newLike._id);
            likeable.save();

        }


        return res.json(200, {
            message: 'Request Successful',
            data: {
                deleted:deleted
            }
        })




    } catch(err){

        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}


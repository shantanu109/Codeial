const Post = require("../../../models/post");

const Comment = require("../../../models/comment");

module.exports.index = async function(req,res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    //Whenever we want to send back JSON data

    return res.json(200, {
        message: "List of Posts",

        posts: posts
    })
}


module.exports.destroy = async function(req,res){

    try{

        //Saving the post found from the database into post

        let post = await Post.findById(req.params.id);

        //.id means converting the object Id into string

        if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            //We changed 'redirect' with sending back 'JSON'

            return res.json(200, {
                message: 'Post and associated comments deleted successfully'
            });
        } else {

            return res.json(401, {
                message: 'You cannot delete this post!'
            });

        }

    } catch(err) {

        console.log(err);
        
        return res.json(500, {
            message: 'Internal Server Error'
        });

    }
  
}
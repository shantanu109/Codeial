const Comment = require('../models/comment');

const Post = require('../models/post');

module.exports.create = function(req,res){

    //Find the post with that POST Id first and then create a comment
    //We create a Comment, allot it to a Post. We need to add Comment ID to post comment array
    //Inside Comment, we need to add Post ID

    Post.findById(req.body.post, function(err,post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err,comment){

                //Handle Error

                post.comments.push(comment);
                post.save();  //Whenever I'm updating something, you'll have to Save it

                res.redirect('/');

            });
        }

    });



}
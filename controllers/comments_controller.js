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


module.exports.destroy = function(req,res){

    Comment.findById(req.params.id, function(err,comment){

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            //Pull Out the comment id from the list of comments
            //Id which I need to pull out from comments

            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err,post){
                return res.redirect('back');
            })

        } else {
            return res.redirect('back');
        }
    });
}
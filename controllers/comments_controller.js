const Comment = require('../models/comment');

const Post = require('../models/post');

const commentsMailer = require('../mailers/comments_mailer');

const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

const Like = require('../models/like');

module.exports.create = async function(req,res){

    //Find the post with that POST Id first and then create a comment
    //We create a Comment, allot it to a Post. We need to add Comment ID to post comment array
    //Inside Comment, we need to add Post ID

    try{
        let post = await Post.findById(req.body.post);
    

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            //Handle Error

            post.comments.push(comment);
            post.save();  //Whenever I'm updating something, you'll have to Save it

            comment = await comment.populate('user', 'name email').execPopulate();

            // commentsMailer.newComment(comment);

            //New job is being created
            //If there isn't a queue, queue will be created
            //Push in the job if queue already exists
            //Pushing into 'emails' queue

            let job = queue.create('emails', comment).save(function(err){

                if (err){
                    console.log('Error in sending to the queue');
                    return;
                }

                console.log('job enqueued', job.id);
            });

            if (req.xhr){
                //Similar for comments to fetch the user's id

                

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Post Created'
                });
            }

            req.flash('success', 'Comment published');

            res.redirect('/');

            }

    }catch(err){

        console.log('Error',err);
        req.flash('error',err);
        return;
    }

}


module.exports.destroy = async function(req,res){

    try{
        //We are finding a comment
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

                //Pull Out the comment id from the list of comments
                //Id which I need to pull out from comments

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            //Destroy the associated likes for this comment

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
                
            return res.redirect('back');
                
        } else {
            return res.redirect('back');
        }

    } catch(err){

        console.log('Error',err);
        return;

    }

}
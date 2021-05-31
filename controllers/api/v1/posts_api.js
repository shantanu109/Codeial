const Post = require("../../../models/post");

const Comment = require("../../../models/comment");

const commentsMailer = require('../../../mailers/comments_mailer');

const commentEmailWorker = require('../../../workers/comment_email_worker');
const queue = require('../../../config/kue');


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

module.exports.createPost = async function(req,res){

    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.body.id
        });

        // let posts = await Post.find({})
        // .sort('-createdAt')
        // .populate('user')
        // .populate({
        //     path: 'comments',
        //     populate: {
        //         path: 'user'
        //     }
        // });

        
        // return res.json(200, {
        //     message: "Post Created",
      
        //     data: {
        //       //user.JSON() part gets encrypted
      
        //       token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        //       post: post,
        //     },
        //     success: true,
        //   });
        return res.json(200,{
            data:{
                post : post,
                //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
            },
            message: "Post Created!!",
            success:true
        });
    }catch(err){
        console.log(err);
        
        return res.json(500, {
            message: 'NOT CREATED'
        });

    }
   
}

module.exports.createComment = async function(req,res){

    try{

        let post = await Post.findById(req.body.post_id);

        if (post){

            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post_id,
                user: req.body.id
            });

            post.comments.push(comment);
            post.save();  

            comment = await comment.populate('user', 'name email').execPopulate();

            // commentsMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){

                if (err){
                    console.log('Error in sending to the queue');
                    return;
                }

                console.log('job enqueued', job.id);
            });

            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: 'Comment Created',

                success:true
            });

        }


    }catch(err){
        console.log(err);
        
        return res.json(500, {
            message: 'NOT CREATED'
        });

    }


    
}
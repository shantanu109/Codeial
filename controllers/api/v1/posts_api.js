const Post = require("../../../models/post");
const User = require("../../../models/user");

const Comment = require("../../../models/comment");

const commentsMailer = require("../../../mailers/comments_mailer");

const commentEmailWorker = require("../../../workers/comment_email_worker");
const queue = require("../../../config/kue");

const Like = require("../../../models/like");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  //Whenever we want to send back JSON data

  return res.json(200, {
    message: "List of Posts",

    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    //Saving the post found from the database into post

    let post = await Post.findById(req.params.postId);

    //.id means converting the object Id into string

    if (post.user == req.body.id) {
      post.remove();

      await Comment.deleteMany({ post: req.params.postId });

      //We changed 'redirect' with sending back 'JSON'
      let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

      return res.json(200, {
        message: "Post and associated comments deleted successfully",
        posts: posts,
        success:true
      });
    } else {
      return res.json(401, {
        message: "You cannot delete this post!",
      });
    }
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.createPost = async function (req, res) {
  let user = await User.findOne({_id: req.body.id})
  try {
    let post = await Post.create({
      content: req.body.content,
      user: user,
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
    return res.json(200, {
      data: {
        post: post,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Post Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.createComment = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post_id);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post_id,
        user: req.body.id,
      });

      post.comments.push(comment);
      post.save();

      comment = await comment.populate("user", "name email").execPopulate();

      // commentsMailer.newComment(comment);

      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          console.log("Error in sending to the queue");
          return;
        }

        console.log("job enqueued", job.id);
      });

      return res.status(200).json({
        data: {
          comment: comment,
        },
        message: "Comment Created",

        success: true,
      });
    }
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.toggleLike = async function (req, res) {
  try {
    // likes/toggle/?id=abcdef&type=Post

    let likeable;

    //when you receive your JSON data back, you can increment or decrement the count of likes which is displayed on our page

    let deleted = false;

    if (req.query.likeable_type == "Post") {
      //To show that if the Post contains other likes

      likeable = await Post.findById(req.query.likeable_id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.likeable_id).populate(
        "likes"
      );
    }

    //Check if a like already exists

    let existingLike = await Like.findOne({
      likeable: req.query.likeable_id,
      onModel: req.query.likeable_type,
      user: req.body.id,
    });

    //If a like already exists, then delete it

    if (existingLike) {
      
      likeable.likes.pull(existingLike._id);
      likeable.save();
      
      existingLike.remove();
      deleted = true
      
    } else {
      //make a new like

      let newLike = await Like.create({
        user: req.body.id,
        likeable: req.query.likeable_id,
        onModel: req.query.likeable_type,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.json(200, {
      message: "Request Successful",
      data: {
        likes: likeable.likes,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

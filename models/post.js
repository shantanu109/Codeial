const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    content: {
        type:String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


},{
    timestamps: true
});



const Post = mongoose.model('Post', postSchema); //We need to tell that it is going to be a model in the database

module.exports = Post;   //exported this Model
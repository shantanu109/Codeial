const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId

    },
    //This defines the Object Id of the liked object

    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        //Tell that it is a Dynamic reference
        //refPath defines the type of Object

        refPath: 'onModel'
    },
    //This field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        require: true,
        //likeable can be a Post or Comment
        //enum restricts that value of onModel can only be 'Post' or 'Comment' only
        enum: ['Post','Comment']
    }
},{
    timestamps: true
});


const Like = mongoose.model('Like',likeSchema);

module.exports = Like;
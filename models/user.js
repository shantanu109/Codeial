const mongoose = require('mongoose');

const multer = require('multer');

const path = require('path');

//This string has been converted into a path using the path module

const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
}, {
    timestamps: true   //Created at & Updated at
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });

// Static

//Attaches the disk storage on multer in storage property

userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');

//I want AVATAR_PATH to be available publicly for User Model
//Made this publicly available

userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;
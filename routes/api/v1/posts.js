const express = require('express');

const router = express.Router();

const passport = require('passport');

const postsApi = require('../../../controllers/api/v1/posts_api');






router.get('/',postsApi.index);

//This will delete the post as it is a 'delete' request
//Put in session:false , cauz I donot want session cookies to be generated

router.delete('/:id',passport.authenticate('jwt', {session: false}) , postsApi.destroy);

router.post('/create',postsApi.createPost);

router.post('/createComment',postsApi.createComment);

router.post('/toggleLike',postsApi.toggleLike);

router.post('/destroy/:postId',postsApi.destroy);

router.post('/destroycomment/:commentId',postsApi.destroyComment);








module.exports = router; 
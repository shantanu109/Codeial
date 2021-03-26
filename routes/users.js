const express = require('express');

const router = express.Router();

//Access Controller from Router

const usersController = require('../controllers/users_controller');

//Map route to User's Controller

router.get('/profile', usersController.profile);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/create',usersController.create);


module.exports = router;
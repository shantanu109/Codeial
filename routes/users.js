const express = require('express');

const router = express.Router();

const passport = require('passport');

//Access Controller from Router

const usersController = require('../controllers/users_controller');

//Map route to User's Controller

router.get('/profile', passport.checkAuthentication, usersController.profile);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/create',usersController.create);

//Use passport as a Middleware to authenticate

router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) , usersController.createSession);

router.get('/sign-out', usersController.destroySession);


module.exports = router;
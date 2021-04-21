const express = require('express');

const router = express.Router();

const passport = require('passport');

//Access Controller from Router

const usersController = require('../controllers/users_controller');

//Map route to User's Controller

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/create',usersController.create);

//Use passport as a Middleware to authenticate

router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) , usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

//URL at which I'll receive the data
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);



module.exports = router;
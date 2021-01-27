const express = require('express');

const authRouter = express.Router();

const async = require('../../middleware/async');

const auth = require('./index');

authRouter.post('/send-login-otp', async(auth.sendLoginOTP));

authRouter.post('/login', async(auth.login));

authRouter.post('/signup', async(auth.signUp));

module.exports = authRouter;

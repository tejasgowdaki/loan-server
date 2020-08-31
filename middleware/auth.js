const jwt = require('jsonwebtoken');

const { Account } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      let error = new Error('Session expired. Please login again');
      error.status = 401;
      throw error;
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const account = await Account.findOne({ _id: payload._id });
    if (!account) {
      let error = new Error('Account not found. Please sign up');
      error.status = 401;
      throw error;
    }

    if (!account.isVerified) {
      let error = new Error(
        `Account not verified. Please mail us at ${process.env.NOTIFY_EMAIL} to activate the account`
      );
      error.status = 401;
      throw error;
    }

    req.account = payload;

    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      let err = new Error('Session expired. Please login again');
      err.status = 401;
      next(err);
    }
    next(error);
  }
};

const jwt = require('jsonwebtoken');

const { Account, User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      let error = new Error('Session expired. Please login again');
      error.status = 401;
      throw error;
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ _id: payload._id });
    if (!user) {
      let error = new Error('Account not found. Please sign up');
      error.status = 401;
      throw error;
    }

    if (!user.isVerified) {
      let error = new Error(
        `Account not verified. Please mail us at ${process.env.NOTIFY_EMAIL} to activate the account`
      );
      error.status = 401;
      throw error;
    }

    const account = await Account.findOne({ _id: user.activeAccountId });
    if (!account) {
      let error = new Error('Account not found. Please sign up');
      error.status = 401;
      throw error;
    }

    req.user = { _id: user._id, mobile: user.mobile };
    req.account = { _id: account._id, name: account.name };

    next();
  } catch (error) {
    if (['invalid signature', 'jwt expired', 'jwt malformed'].includes(error.message)) {
      let err = new Error('Session expired. Please login again');
      err.status = 401;
      next(err);
    } else {
      error.status = 401;
      next(error);
    }
  }
};

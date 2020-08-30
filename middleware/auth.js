const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.header('x-auth-token');
    if (!token) throw new Error('Access denied');

    const account = jwt.verify(token, process.env.SECRET_KEY);
    req.account = account;

    next();
  } catch (error) {
    let err = new Error('Access denied');
    err.status = 401;
    throw err;
  }
};

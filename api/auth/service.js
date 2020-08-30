const jwt = require('jsonwebtoken');

const { Account } = require('../../models');

const sendSMS = require('../../helpers/sms');

const tokenExpiry = 30 * 24 * 60 * 60; // 30 days

const generateJwtToken = (body) => {
  try {
    const token = jwt.sign(body, process.env.SECRET_KEY, { expiresIn: tokenExpiry });

    return token;
  } catch (error) {
    throw error;
  }
};

const generateAndSendOTP = async (accountId, name, mobile) => {
  try {
    const otp = Math.ceil(Math.random() * 1000000);

    await Account.findByIdAndUpdate(accountId, { otp });

    sendSMS(`To login for account ${name} use OTP - ${otp}`, [mobile]);

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { generateJwtToken, generateAndSendOTP };

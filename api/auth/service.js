const jwt = require('jsonwebtoken');

const { User, Account } = require('../../models');

const sendSMS = require('../../helpers/sms');
const { isNumber } = require('../../helpers/utils');

const tokenExpiry = 30 * 24 * 60 * 60; // 30 days

const generateJwtToken = (body) => {
  try {
    const token = jwt.sign(body, process.env.SECRET_KEY, { expiresIn: tokenExpiry });

    return token;
  } catch (error) {
    throw error;
  }
};

const generateAndSendOTP = async (userId, mobile) => {
  try {
    const otp = Math.ceil(Math.random() * 1000000);

    await User.findByIdAndUpdate(userId, { otp });

    sendSMS(`To login for loan manager use OTP - ${otp}`, [mobile]);

    return;
  } catch (error) {
    throw error;
  }
};

const validateUser = async ({ mobile }) => {
  try {
    if (!mobile) {
      let error = new Error('Mobile number is required');
      error.status = 422;
      throw error;
    }

    if (mobile.length !== 10 || !isNumber(mobile)) {
      let error = new Error('Mobile number is incorrect');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const validateAccount = async ({ name, type, userId }, id = null) => {
  try {
    if (!name) {
      let error = new Error('Name is required');
      error.status = 422;
      throw error;
    }

    if (!type) {
      let error = new Error('Account type is required');
      error.status = 422;
      throw error;
    }

    const existingAccountByName = await Account.findOne({ name, userId });
    if (existingAccountByName && (!id || id.toString() !== existingAccountByName._id.toString())) {
      let error = new Error('Name already exists');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { generateJwtToken, generateAndSendOTP, validateUser, validateAccount };

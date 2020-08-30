const response = require('../../helpers/response');

const { Account } = require('../../models');

const { generateJwtToken, generateAndSendOTP } = require('./service');

const sendLoginOTP = async (req, res) => {
  const mobile = (req.body.mobile || '').trim();

  const existingAccountWithMobile = await Account.findOne({ mobile });

  if (!existingAccountWithMobile) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  generateAndSendOTP(existingAccountWithMobile._id, existingAccountWithMobile.name, existingAccountWithMobile.mobile);

  res
    .status(200)
    .json(response.success({ message: `Successfully sent OTP to number ${existingAccountWithMobile.mobile}` }));
};

const login = async (req, res) => {
  const mobile = (req.body.mobile || '').trim();
  const otp = (req.body.otp || '').trim();

  const existingAccountWithMobile = await Account.findOne({ mobile });

  if (!existingAccountWithMobile) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  if (!otp || existingAccountWithMobile.otp !== otp) {
    let error = new Error('Invalid OTP');
    error.status = 401;
    throw error;
  }

  await Account.findByIdAndUpdate(existingAccountWithMobile._id, { otp: null });

  const token = generateJwtToken({ _id: existingAccountWithMobile._id, name: existingAccountWithMobile.name, mobile });

  res.status(200).json(response.success({ token }));
};

module.exports = { sendLoginOTP, login };

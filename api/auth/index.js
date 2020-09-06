const response = require('../../helpers/response');

const { Account } = require('../../models');

const { generateJwtToken, generateAndSendOTP } = require('./service');

const sendLoginOTP = async (req, res) => {
  const accountId = req.body.accountId;

  const existingAccountWithMobile = await Account.findOne({ _id: accountId });

  if (!existingAccountWithMobile) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  if (!existingAccountWithMobile.isVerified) {
    let error = new Error(
      `Account not verified. Please mail us at ${process.env.NOTIFY_EMAIL} to activate the account`
    );
    error.status = 422;
    throw error;
  }

  generateAndSendOTP(existingAccountWithMobile._id, existingAccountWithMobile.name, existingAccountWithMobile.mobile);

  res
    .status(200)
    .json(response.success({ message: `Successfully sent OTP to number ${existingAccountWithMobile.mobile}` }));
};

const login = async (req, res) => {
  const accountId = req.body.accountId;
  const otp = (req.body.otp || '').trim();

  const existingAccountWithMobile = await Account.findOne({ _id: accountId });

  if (!existingAccountWithMobile) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  if (!existingAccountWithMobile.isVerified) {
    let error = new Error(
      `Account not verified. Please mail us at ${process.env.NOTIFY_EMAIL} to activate the account`
    );
    error.status = 422;
    throw error;
  }

  if (!otp || existingAccountWithMobile.otp !== otp) {
    let error = new Error('Invalid OTP');
    error.status = 401;
    throw error;
  }

  await Account.findByIdAndUpdate(existingAccountWithMobile._id, { otp: null });

  const token = generateJwtToken({ _id: existingAccountWithMobile._id });

  res.status(200).json(response.success({ token }));
};

module.exports = { sendLoginOTP, login };

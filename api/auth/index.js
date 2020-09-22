const response = require('../../helpers/response');

const { Account, User } = require('../../models');

const { generateJwtToken, generateAndSendOTP, validateAccount, validateUser } = require('./service');

const sendSMS = require('../../helpers/sms');

const sendLoginOTP = async (req, res) => {
  const mobile = (req.body.mobile || '').trim();

  const existingUserWithMobile = await User.findOne({ mobile });

  if (!existingUserWithMobile) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  if (!existingUserWithMobile.isVerified) {
    let error = new Error(
      `Account not verified. Please mail us at ${process.env.NOTIFY_EMAIL} to activate the account`
    );
    error.status = 422;
    throw error;
  }

  generateAndSendOTP(existingUserWithMobile._id, existingUserWithMobile.mobile);

  res
    .status(200)
    .json(response.success({ message: `Successfully sent OTP to number ${existingUserWithMobile.mobile}` }));
};

const login = async (req, res) => {
  const mobile = (req.body.mobile || '').trim();
  const otp = (req.body.otp || '').trim();

  const existingUserWithMobile = await User.findOne({ mobile });

  if (!existingUserWithMobile) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  if (!existingUserWithMobile.isVerified) {
    let error = new Error(
      `Account not verified. Please mail us at ${process.env.NOTIFY_EMAIL} to activate the account`
    );
    error.status = 422;
    throw error;
  }

  if (!otp || existingUserWithMobile.otp !== otp) {
    let error = new Error('Invalid OTP');
    error.status = 401;
    throw error;
  }

  await User.findByIdAndUpdate(existingUserWithMobile._id, { otp: null });

  const token = generateJwtToken({
    _id: existingUserWithMobile._id,
    activeAccountId: existingUserWithMobile.activeAccountId
  });

  res.status(200).json(response.success({ token }));
};

const signUp = async (req, res) => {
  const name = (req.body.name || '').trim();
  const mobile = (req.body.mobile || '').trim();
  const type = req.body.type;

  await validateUser({ mobile });

  const existingUser = await User.findOne({ mobile });

  let account = null;

  if (existingUser) {
    await validateAccount({ name, type, userId: existingUser._id });
    account = await Account.create({ name, userId: existingUser._id, type });
  } else {
    const user = await User.create({ mobile });
    await validateAccount({ name, type, userId: user._id });
    account = await Account.create({ name, userId: user._id, type });
    await User.findByIdAndUpdate(user._id, { activeAccountId: account._id });
  }

  sendSMS(`A new account has been created in Loan Manager with Name: ${name} and Mobile: ${mobile}`, [
    process.env.NOTIFY_MOBILE
  ]);

  res.status(201).json(response.success({ account }));
};

module.exports = { sendLoginOTP, login, signUp };

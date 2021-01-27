require('dotenv').config();

const db = require('../../config/mongoDb');

const { Account, User } = require('../../models');

db.once('open', async () => {
  await migrate();
  process.exit(0);
});

db.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

const migrate = async () => {
  try {
    const accounts = await Account.find().lean();

    for (const account of accounts) {
      const existingUser = await User.findOne({ mobile: account.mobile });

      if (existingUser) {
        await Account.findByIdAndUpdate(account._id, { userId: existingUser._id });
      } else {
        const { mobile, otp, isVerified, _id: activeAccountId } = account;
        const newUser = await User.create({ mobile, otp, isVerified, activeAccountId });
        await Account.findByIdAndUpdate(account._id, { userId: newUser._id });
      }
    }

    console.log('migration completed');
  } catch (error) {
    console.error(error);
  }
};

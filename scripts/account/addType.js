require('dotenv').config();

const db = require('../../config/mongoDb');

const { Account } = require('../../models');

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
      await Account.findByIdAndUpdate(account._id, { type: 'loan' });
    }

    console.log('migration completed');
  } catch (error) {
    console.error(error);
  }
};

require('dotenv').config();

const db = require('../../config/mongoDb');

const { Loan } = require('../../models');

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
    const loans = await Loan.find().lean();

    for (const loan of loans) {
      const { amount, date } = loan;

      const subLoans = [{ amount, date }];

      await Loan.findByIdAndUpdate(loan._id, { subLoans });
    }

    console.log('migration completed');
  } catch (error) {
    console.error(error);
  }
};

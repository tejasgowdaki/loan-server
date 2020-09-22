const { Account } = require('../../models');

const validate = async ({ name, type, userId }, id = null) => {
  try {
    if (!name) {
      let error = new Error('Name is required');
      error.status = 422;
      throw error;
    }

    if (!id && !type) {
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

module.exports = { validate };

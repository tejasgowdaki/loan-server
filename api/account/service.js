const { Account } = require('../../models');

const { isNumber } = require('../../helpers/utils');

const validate = async ({ name, mobile }, id = null) => {
  try {
    if (!name) {
      let error = new Error('Name is required');
      error.status = 422;
      throw error;
    }

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

    const existingAccountByName = await Account.findOne({ name });
    if (existingAccountByName && (!id || id.toString() !== existingAccountByName._id.toString())) {
      let error = new Error('Name already exists');
      error.status = 422;
      throw error;
    }

    const existingAccountByMobile = await Account.findOne({ mobile });
    if (existingAccountByMobile && (!id || id.toString() !== existingAccountByMobile._id.toString())) {
      let error = new Error('Mobile already exists');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { validate };

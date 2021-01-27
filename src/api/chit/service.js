const validate = async ({ amount, date, receiver, memberId }) => {
  try {
    if (!amount) {
      let error = new Error('Chit amount is required');
      error.status = 422;
      throw error;
    }

    if (!date) {
      let error = new Error('Chit date is required');
      error.status = 422;
      throw error;
    }

    if (!receiver) {
      let error = new Error('Receiver is required');
      error.status = 422;
      throw error;
    }

    if (receiver === 'member' && !memberId) {
      let error = new Error('Please select member');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validate
};

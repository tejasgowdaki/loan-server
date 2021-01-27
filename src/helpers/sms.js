const axios = require('axios');

const logger = require('../config/logger');

const msg91URL = 'http://api.msg91.com/api/v2/sendsms';
const msg91RequestBody = { sender: process.env.MSG_91_SENDER_ID, route: '4', country: '91' };
const headers = { headers: { authKey: process.env.MSG_91_AUTH_KEY, 'Content-Type': 'application/json' } };

const sendSMS = async (message, numbers) => {
  try {
    if (process.env.NODE_ENV === 'development') return;

    const body = { ...msg91RequestBody, sms: [{ message, to: numbers }] };
    const response = await axios.post(msg91URL, body, headers);
    logger.info(JSON.stringify(response.data));
    return;
  } catch (error) {
    logger.error(error.stack);
  }
};

module.exports = sendSMS;

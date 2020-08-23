const axios = require('axios');

const msg91URL = 'http://api.msg91.com/api/v2/sendsms';
const msg91RequestBody = { sender: process.env.MSG_91_SENDER_ID, route: '4', country: '91' };
const headers = { headers: { authKey: process.env.MSG_91_AUTH_KEY, 'Content-Type': 'application/json' } };

const sendSMS = async (message, numbers) => {
  try {
    const body = { ...msg91RequestBody, sms: [{ message, to: numbers }] };
    const response = await axios.post(msg91URL, body, headers);
    console.log('sendSMS -> response', response);
    return;
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendSMS;

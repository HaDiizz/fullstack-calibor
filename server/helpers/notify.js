const request = require('request');
const axios = require('axios');

exports.notifyEvent = (msg, token) => {
  // zYVI6GLP8HBn5iSMHI465sQuebxVm8DQhIRJ2Hb7xUP
  request({
    uri: 'https://notify-api.line.me/api/notify',
    method: 'POST',
    auth: {
      // bearer: 'zYVI6GLP8HBn5iSMHI465sQuebxVm8DQhIRJ2Hb7xUP'
      bearer: token,
    },
    form: {
      message: msg,
    },
  });
};
exports.authLineToken = async (formData) => {
  try {
    const response = await axios.post(
      'https://notify-bot.line.me/oauth/token',
      formData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return response.data.access_token
  } catch (error) {
    console.error('Error:', error);
  }
};
exports.authLineRevoke = async (access_token) => {
  try {
    const response = await axios.post(
      'https://notify-api.line.me/api/revoke',
      {},
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${access_token}` },
      }
    );
    return response.data.status
  } catch (error) {
    console.error('Error:', error);
  }
};

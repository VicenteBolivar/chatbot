const axios = require('axios');
const config = require('../../config/env');

const sendToWhatsApp = async (data) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${config.PHONE_NUMBER_ID}/messages`,
      data,
      {
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ SENT:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ ERROR:", error.response?.data || error.message);
  }
};

module.exports = sendToWhatsApp;
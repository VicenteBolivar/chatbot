require('dotenv').config();

module.exports = {
  VERIFY_TOKEN: process.env.VERIFY_TOKEN,
  API_TOKEN: process.env.API_TOKEN,
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  PORT: process.env.PORT || 3000,
};
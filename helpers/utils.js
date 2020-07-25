const moment = require("moment");

const isNumber = value => /^\d+$/.test(value);

const generateRandomNumber = (id = "abcd") =>
  `${moment().unix()}${id.toString().slice(id.toString().length - 4)}`;

module.exports = { isNumber, generateRandomNumber };

const bcp47 = require("bcp47-validate");

module.exports = (lang) => {
  return bcp47.validate(lang);
}
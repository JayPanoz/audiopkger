const isISBN = require("is-isbn");

module.exports = (isbn) => {
  const sanitizedISBN = isbn.replace(/[-\s]/g, "");
  return isISBN.validate(sanitizedISBN);
}
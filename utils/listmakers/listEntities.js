const delimitersToArray = require("../transformers/delimitersToArray");

module.exports = (string) => {
  const entities = delimitersToArray(string);
  if (entities.length > 1) {
    return entities;
  } else {
    return string;
  }
}
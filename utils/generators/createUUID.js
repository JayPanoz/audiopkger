const uuid = require("uuid/v4");

module.exports = () => {
  return `urn:uuid:${uuid()}`;
}
const fs = require("fs");
const log = require("../console/log");

module.exports = (filename, data, message) => {
  fs.writeFile(filename, data, (err) => {
    if (err) {
      throw err;
    }
    log(message);
  });
}
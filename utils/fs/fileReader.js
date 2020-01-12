const fs = require("fs");

module.exports = (filename) => {
  return fs.readFileSync(filename);
}
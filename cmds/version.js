const log = require("../utils/log");

const { version } = require("../package.json");

module.exports = () => {
  log(`\n${version}\n`)
}
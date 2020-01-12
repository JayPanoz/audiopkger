const log = require("../utils/console/log");

const { version } = require("../package.json");

module.exports = () => {
  log(`\n${version}\n`)
}
const log = require("../utils/log");

const menu = `
    audiopkger [command]

    help ............... show help menu
    init ............... create an audiobook manifest (and toc) in the directory
    package ............ package the directory as .lpf
    version ............ show the version\n`;

module.exports = () => {
  log(menu);
}
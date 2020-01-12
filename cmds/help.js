const log = require("../utils/console/log");

const menu = `
    audiopkger [command]

    help ............... show help menu
    init ............... create an audiobook manifest (and toc) in the directory
    package ............ package the directory as .lpf
    toc ................ create a Table of Contents from the manifest
    version ............ show the version\n`;

module.exports = () => {
  log(menu);
}
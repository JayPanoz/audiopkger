const fs = require("fs");
const fileReader = require("../utils/fs/fileReader");
const path = require("path");
const error = require("../utils/console/error");
const log = require("../utils/console/log");
const archiver = require("archiver");
const prettyBytes = require("pretty-bytes");

const basePath = process.cwd();
const filename = path.basename(basePath);

module.exports = () => {
  try {
    log(`\nLet’s package your audiobook!\n`);

    const manifestFile = fileReader("publication.json");
    const manifest = JSON.parse(manifestFile);
    const resourceItems = manifest.resources || [];
    const audioItems = manifest.readingOrder || [];

    const output = fs.createWriteStream(`./${filename}.lpf`);
    const archive = archiver("zip");

    output.on("close", () => {
      const fileSize = prettyBytes(archive.pointer());
      log(`Your ${filename}.lpf archive (${fileSize}) has been created in the root of this directory.\n`);
    });
    
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        log(err.code);
      } else {
        throw err;
      }
    });
    
    archive.on("error", (err) => {
      throw err;
    });
    
    archive.pipe(output);

    archive.file("publication.json");

    for (const resource of resourceItems) {
      const resourceFile = resource.url;
      archive.file(resourceFile);
    }

    for (const audio of audioItems) {
      const audioFile = audio.url;
      archive.file(audioFile, {store: true});
    }

    archive.finalize();

  } catch (err) {
    error(err, true);
  }
}
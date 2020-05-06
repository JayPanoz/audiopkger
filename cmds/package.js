const fs = require("fs");
const path = require("path");
const fileReader = require("../utils/fs/fileReader");
const error = require("../utils/console/error");
const log = require("../utils/console/log");
const ffmpegProcess = require("../utils/fs/ffmpeg");
const archiver = require("archiver");
const prettyBytes = require("pretty-bytes");
const messager = require("../data/messages");

const basePath = process.cwd();
const filename = path.basename(basePath);

module.exports = (args) => {
  try {
    const bitrate = args.bitrate || args.b;

    log(messager().info.launched("package"));

    const manifestFile = fileReader("publication.json");
    const manifest = JSON.parse(manifestFile);
    const resourceItems = manifest.resources || [];
    const audioItems = manifest.readingOrder || [];

    const output = fs.createWriteStream(`./${filename}.lpf`);
    const archive = archiver("zip");

    output.on("finish", () => {
      const fileSize = prettyBytes(archive.pointer());
      log(messager().info.created(`${filename}.lpf archive (${fileSize})`));
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
      if (bitrate) {
        const tmpStream = ffmpegProcess(audioFile, bitrate);
        archive.append(tmpStream, {name: audioFile, store: true});
      } else {
        archive.file(audioFile, {store: true});
      }
    }

    archive.finalize();

  } catch (err) {
    error(err, true);
  }
}
const path = require("path");
const error = require("../console/error");
const log = require("../console/log");
const ffmpeg = require("fluent-ffmpeg");
const messenger = require("../../data/messages");

module.exports = (audioFile, bitrate, details) => {
  const fileExt = path.extname(audioFile).substring(1).toLowerCase();
  
  return ffmpeg(audioFile)
    .format(fileExt)
    .audioBitrate(bitrate)
    .on("start", () => {
      log(messenger().ffmpeg.start(audioFile));
    })
    .on("progress", (progress) => {
      if (details) {
        log(messenger().ffmpeg.progress(progress, audioFile));
      }
    })
    .on("error", (err) => {
      error(messenger().ffmpeg.error(err));
    })
    .on("end", () => {
      log(messenger().ffmpeg.end(audioFile));
    })
    .pipe();
}
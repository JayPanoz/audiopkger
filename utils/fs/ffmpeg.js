const path = require("path");
const error = require("../console/error");
const log = require("../console/log");
const ffmpeg = require("fluent-ffmpeg");
const messager = require("../../data/messages");

module.exports = (audioFile, bitrate) => {
  const fileExt = path.extname(audioFile).substring(1).toLowerCase();
  
  return ffmpeg(audioFile)
    .format(fileExt)
    .audioBitrate(bitrate)
    .on("start", () => {
      log(messager().ffmpeg.start(audioFile));
    })
  /*  .on("progress", (progress) => {
      log(messager().ffmpeg.progress(progress));
    }) */
    .on("error", (err) => {
      error(messager().ffmpeg.error(err));
    })
    .on("end", () => {
      log(messager().ffmpeg.end(audioFile));
    })
    .pipe();
}
const mm = require("music-metadata");

module.exports = async (audioFile) => {
  try {
    let metadata = {};

    const fileInfo = await mm.parseFile(audioFile);

    if (fileInfo.common.title) {
      metadata.title = fileInfo.common.title;
    }

    if (fileInfo.format.duration) {
      metadata.duration = fileInfo.format.duration;
    }
    
    return metadata;
  } catch (err) {
    throw err;
  }
}
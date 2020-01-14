const glob = require("glob");
const data = require("../../data/mimetypes.json");
const getAudioMeta = require("../fs/getAudioMeta");
const makeFileObject = require("../transformers/fileObject");
const makeDuration = require("../transformers/duration");

module.exports = async (basePath, previewFile) => {
  let audioFormats = [];
  for (const item of data.audio) {
    audioFormats.push(item.format);
  }
  
  const audioFiles = glob.sync(`**/*.{${audioFormats.toString()}}`, {
    realpath: true, 
    nocase: true
  });

  if (previewFile) {
    const index = audioFiles.indexOf(previewFile);
    if (index !== -1) {
      audioFiles.splice(index, 1);
    }
  }

  let audioObjects = [];
  let totalDuration = 0;
  let durationCount = 0;

  for (const [index, file] of audioFiles.entries()) {
    const metadata = await getAudioMeta(file);

    let name = "Track " + (index + 1);
    if (metadata.title) {
      name = metadata.title
    }

    const fileObject = makeFileObject("audio", file, basePath, name);

    if (metadata.duration && !isNaN(metadata.duration)) {
      const roundedDuration = Math.round(metadata.duration);
      fileObject.duration = makeDuration(roundedDuration);
      totalDuration += roundedDuration;
      ++durationCount;
    }

    audioObjects.push(fileObject);
  }

  if (durationCount !== audioObjects.length) {
    totalDuration = 0;
  }

  return { 
    audioObjects, 
    totalDuration 
  };
}
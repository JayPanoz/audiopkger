const glob = require("glob");
const data = require("../../data/mimetypes.json");
const makeFileObject = require("../transformers/fileObject");

module.exports = (basePath, previewFile) => {
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

  audioFiles.forEach((file, index) => {
    const name = "Track " + (index + 1);
    const fileObject = makeFileObject("audio", file, basePath, name);
    audioObjects.push(fileObject);
  })

  return audioObjects;
}
const glob = require("glob");
const data = require("../../data/mimetypes.json");
const makeFileObject = require("../transformers/fileObject");

module.exports = (basePath) => {
  let audioFormats = [];
  for (const item of data.audio) {
    audioFormats.push(item.format);
  }
  
  const audioFiles = glob.sync(`**/*.{${audioFormats.toString()}}`, {
    realpath: true, 
    nocase: true
  });

  let audioObjects = [];

  audioFiles.forEach((file, index) => {
    const name = "Track " + (index + 1);
    const fileObject = makeFileObject("audio", file, basePath, name);
    audioObjects.push(fileObject);
  })

  return audioObjects;
}
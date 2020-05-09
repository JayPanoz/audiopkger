const path = require("path");
const mime = require("mime-types");
const data = require("../../data/mimetypes.json");

module.exports = (type, file, basePath = process.cwd(), name = "", rel) => {
  let fileObject = {};

  let filePath = path.normalize(file.split(basePath)[1]);
  if (process.platform === "win32") {
    filePath = filePath.replace(/\\/g, "/");
  }

  const fileName = path.basename(file);
  const fileExt = path.extname(file).substring(1).toLowerCase();
  let fileEncoding;
  if (type === "*") {
    fileEncoding = mime.lookup(fileName);
  } else {
    const dataItem = data[type].find(({ format }) => format === fileExt);
    fileEncoding = dataItem.mimetype;
  }

  fileObject.url = filePath.startsWith("/") ? filePath.substring(1) : filePath;
  fileObject.encodingFormat = fileEncoding;

  if (name) {
    fileObject.name = name;
  } else {
    fileObject.name = fileName.slice(0 , -(fileExt.length + 1));
  }

  if (rel) {
    fileObject.rel = rel;
  }

  return fileObject;
}
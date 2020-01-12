const path = require("path");
const data = require("../../data/mimetypes.json");

module.exports = (type, file, basePath = process.cwd(), name = "", rel) => {
  let fileObject = {};

  const filePath = file.split(basePath);
  const fileName = path.basename(file);
  const fileExt = path.extname(file).substring(1).toLowerCase();
  const dataItem = data[type].find(({ format }) => format === fileExt);
  const fileEncoding = dataItem.mimetype;

  fileObject.url = filePath[1].startsWith("/") ? filePath[1].substring(1) : filePath[1];
  fileObject.encodingFormat = fileEncoding;

  if (name) {
    fileObject.name = name;
  } else {
    fileObject.name = fileName.slice(0 , -fileExt.length);
  }

  if (rel) {
    fileObject.rel = rel;
  }

  return fileObject;
}
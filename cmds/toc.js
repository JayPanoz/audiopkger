const fileReader = require("../utils/fs/fileReader");
const fileWriter = require("../utils/fs/fileWriter");
const error = require("../utils/console/error");
const log = require("../utils/console/log");
const createIndex = require("../utils/generators/createIndex");
const makeFileObject = require("../utils/transformers/fileObject");
const messager = require("../data/messages");

const basePath = process.cwd();

module.exports = () => {
  try {
    log(messager().info.launched("Primary Entry Page"));

    const manifestFile = fileReader("publication.json");
    const manifest = JSON.parse(manifestFile);
    
    const indexPage = createIndex(manifest);
    fileWriter("index.html", indexPage, messager().info.created("Primary Entry Page (index.html)"));

    manifest.resources = manifest.resources || [];

    const existingResource = manifest.resources.find(({ rel }) => rel === "contents");
    if (!existingResource) {
      log(messager().info.updating("manifest"));

      const tocFile = basePath + "/index.html";
      const tocObject = makeFileObject("document", tocFile, basePath, "Contents", "contents");

      manifest.dateModified = new Date();
      manifest.resources.push(tocObject);

      const updatedManifest = JSON.stringify(manifest, null, 2);
      fileWriter("publication.json", updatedManifest, messager().info.created("manifest (publication.json)"));
    }
  } catch (err) {
    error(err, true);
  }
}
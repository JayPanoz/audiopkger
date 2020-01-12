const fileReader = require("../utils/fs/fileReader");
const fileWriter = require("../utils/fs/fileWriter");
const error = require("../utils/console/error");
const log = require("../utils/console/log");
const createIndex = require("../utils/generators/createIndex");
const makeFileObject = require("../utils/transformers/fileObject");

const basePath = process.cwd();

module.exports = () => {
  try {
    log("Let’s create your table of contents!\n\nThe index.html file will be created in the current directory...\n");

    const manifestFile = fileReader("publication.json");
    const manifest = JSON.parse(manifestFile);
    
    const indexPage = createIndex(manifest);
    fileWriter("index.html", indexPage, "The Primary Entry Page (index.html) has been created.\n");

    manifest.resources = manifest.resources || [];

    const existingResource = manifest.resources.find(({ rel }) => rel === "contents");
    if (!existingResource) {
      log("Updating the manifest...\n");

      const tocFile = basePath + "/index.html";
      const tocObject = makeFileObject("document", tocFile, basePath, "Contents", "contents");

      manifest.dateModified = new Date();
      manifest.resources.push(tocObject);

      const updatedManifest = JSON.stringify(manifest, null, 2);
      fileWriter("publication.json", updatedManifest, "The manifest (publication.json) has been updated.\n");
    }
  } catch (err) {
    error(err, true);
  }
}
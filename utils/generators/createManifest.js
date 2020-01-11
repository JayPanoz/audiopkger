const createUUID = require("../generators/createUUID");
const createISBN = require("../generators/createISBN");
const listAudio = require("../listmakers/listAudio");
const makeFileObject = require("../transformers/fileObject");

const filteredProps = [
  "_createToc",
  "_hasCover",
  "_hasISBN",
  "_hasToc",
  "_coverFile",
  "_isbn",
  "_tocFile"
];

module.exports = (basePath, answers) => {
  try {
    let manifest = {
      "@context": ["https://schema.org", "https://www.w3.org/ns/pub-context"],
      "conformsTo": "https://www.w3/org/TR/audiobooks/",
      "type": "Audiobook",
      "dateModified": new Date()
    };

    if (answers._createToc) {
      answers._tocFile = basePath + "/index.html";
    }

    if (answers._isbn) {
      manifest.id = createISBN(answers._isbn);
    } else {
      manifest.id = createUUID();
    }

    for (const prop in answers) {
      if (!filteredProps.includes(prop)) {
        const value = answers[prop];
        if (value) {
          if (prop === "datePublished") {
            manifest[prop] = value.toISOString().split("T")[0];
          } else {
            manifest[prop] = value;
          }
        }
      }
    };

    if (answers._coverFile || answers._tocFile) {
      manifest.resources = [];
    }

    if (answers._coverFile) {
      const coverObject = makeFileObject("image", answers._coverFile, basePath, "Cover", "cover");
      manifest.resources.push(coverObject);
    };

    if (answers._tocFile) {
      const tocObject = makeFileObject("document", answers._tocFile, basePath, "Contents", "contents");
      manifest.resources.push(tocObject);
    }

    manifest.readingOrder = listAudio(basePath);

    return manifest;
  } catch (err) {
    throw err;
  }
}
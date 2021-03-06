const fs = require("fs");
const path = require("path");
const createUUID = require("../generators/createUUID");
const createISBN = require("../generators/createISBN");
const listAudio = require("../listmakers/listAudio");
const listDirFiles = require("../listmakers/listDirFiles");
const listEntities = require("../listmakers/listEntities");
const makeFileObject = require("../transformers/fileObject");
const makeDuration = require("../transformers/duration");
const messenger = require("../../data/messages");
const pk = require("../../data/private-keys.json");

module.exports = async (basePath, answers) => {
  try {
    const idTypes = {
      address: messenger().prompts.idTypes.address,
      isbn: messenger().prompts.idTypes.isbn,
      uuid: messenger().prompts.idTypes.uuid
    }

    let manifest = {
      "@context": ["https://schema.org", "https://www.w3.org/ns/pub-context"],
      "conformsTo": "https://www.w3.org/TR/audiobooks/",
      "type": "Audiobook",
      "dateModified": new Date()
    };

    if (answers[pk.createToc]) {
      answers[pk.tocFile] = path.join(basePath, "index.html");
    }

    if (answers[pk.address]) {
      if (answers[pk.idType] === idTypes.address) {
        manifest.id = answers[pk.address];
      } else {
        manifest.url = answers[pk.address];
      }
    }

    if ((answers[pk.idType] === idTypes.isbn) && answers[pk.isbn]) {
      manifest.id = createISBN(answers[pk.isbn]);
    }

    if ((answers[pk.idType] === idTypes.uuid) || (!answers[pk.address] && !answers[pk.isbn])) {
      manifest.id = createUUID();
    }

    for (const prop in answers) {
      if (!Object.values(pk).includes(prop)) {
        const value = answers[prop];
        if (value) {
          switch (prop) {
            case "author":
              manifest[prop] = listEntities(value);
              break;
            case "readBy":
              manifest[prop] = listEntities(value);
              break;
            case "publisher":
              manifest[prop] = listEntities(value);
              break;
            case "datePublished":
              manifest[prop] = value.toISOString().split("T")[0];
              break;
            default:
              manifest[prop] = value;
              break;
          }
        }
      }
    };

    if (answers[pk.coverFile] || answers[pk.tocFile] || answers[pk.previewFile] || answers[pk.supplementalFiles]) {
      manifest.resources = [];
    }

    if (answers[pk.coverFile]) {
      const coverObject = makeFileObject("image", answers[pk.coverFile], basePath, "Cover", "cover");
      manifest.resources.push(coverObject);
    };

    if (answers[pk.tocFile]) {
      const tocObject = makeFileObject("document", answers[pk.tocFile], basePath, "Contents", "contents");
      manifest.resources.push(tocObject);
    }

    if (answers[pk.previewFile]) {
      const previewObject = makeFileObject("audio", answers[pk.previewFile], basePath, "Preview", "preview");
      manifest.resources.push(previewObject);
    }

    if (answers[pk.supplementalFiles]) {
      for (const supplement of answers[pk.supplementalFiles]) {
        if (fs.lstatSync(supplement).isDirectory()) {
          const dirFiles = listDirFiles(supplement);
          for (const dirFile of dirFiles) {
            const supplementObject = makeFileObject("*", dirFile, basePath);
            manifest.resources.push(supplementObject);
          }
        } else {
          const supplementObject = makeFileObject("*", supplement, basePath);
          manifest.resources.push(supplementObject);
        }
      }
    }

    const audio = await listAudio(basePath, answers[pk.previewFile])

    manifest.readingOrder = audio.audioObjects;

    if (audio.totalDuration > 0) {
      manifest.duration = makeDuration(audio.totalDuration);
    }

    return manifest;
  } catch (err) {
    throw err;
  }
}

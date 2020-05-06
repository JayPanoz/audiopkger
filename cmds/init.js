const fileWriter = require("../utils/fs/fileWriter");
const error = require("../utils/console/error");
const log = require("../utils/console/log");
const inquirer = require("inquirer");
const inquirerDatePicker = require("inquirer-datepicker-prompt");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
const createManifest = require("../utils/generators/createManifest");
const createIndex = require("../utils/generators/createIndex");
const isValidISBN = require("../utils/validators/isValidISBN");
const isValidLang = require("../utils/validators/isValidLang");
const isValidURL = require("../utils/validators/isValidURL");
const messenger = require("../data/messages");
const pk = require("../data/private-keys.json");

const basePath = process.cwd();

inquirer.registerPrompt("datetime", inquirerDatePicker);
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

const questions = [
  {
    type: "input",
    name: "name",
    message: messenger().prompts.title
  },
  {
    type: "confirm",
    name: pk.hasAddress,
    message: messenger().prompts.hasAddress,
    default: false
  },
  {
    type: "input",
    name: pk.address,
    message: messenger().prompts.address,
    when: (answers) => {
      return answers[pk.hasAddress];
    },
    validate: (value) => {
      if (isValidURL(value)) {
        return true;
      } else {
        return messenger().prompts.invalid.address;
      }
    }
  },
  {
    type: "list",
    name: pk.idType,
    message: messenger().prompts.idType,
    choices: [
      messenger().prompts.idTypes.address, 
      messenger().prompts.idTypes.isbn,
      messenger().prompts.idTypes.uuid
    ],
    default: (answers) => {
      if (answers[pk.hasAddress]) {
        return 0;
      }
      return 1;
    }
  },
  {
    type: "input",
    name: pk.isbn,
    message: messenger().prompts.isbn,
    when: (answers) => {
      return answers[pk.idType] === messenger().prompts.idTypes.isbn;
    },
    validate: (value) => {
      if (isValidISBN(value)) {
        return true;
      } else {
        return messenger().prompts.invalid.isbn;
      }
    }
  },
  {
    type: "input",
    name: "author",
    message: messenger().prompts.author
  },
  {
    type: "input",
    name: "readBy",
    message: messenger().prompts.narrator
  },
  {
    type: "input",
    name: "publisher",
    message: messenger().prompts.publisher
  },
  {
    type: "input",
    name: "inLanguage",
    message: messenger().prompts.language,
    default: "en",
    validate: (value) => {
      if (isValidLang(value)) {
        return true;
      } else {
        return messenger().prompts.invalid.language;
      }
    }
  },
  {
    type: "datetime",
    name: "datePublished",
    message: messenger().prompts.publicationDate,
    format: ["yyyy", "-", "mm", "-", "dd"]
  },
  {
    type: "confirm",
    name: pk.hasCover,
    message: messenger().prompts.hasCover,
    default: true
  },
  {
    type: "file-tree-selection",
    name: pk.coverFile,
    message: messenger().prompts.coverFile,
    when: (answers) => {
      return answers[pk.hasCover];
    }
  },
  {
    type: "confirm",
    name: pk.hasToc,
    message: messenger().prompts.hasToc,
    default: false
  },
  {
    type: "file-tree-selection",
    name: pk.tocFile,
    message: messenger().prompts.tocFile,
    when: (answers) => {
      return answers[pk.hasToc];
    }
  },
  {
    type: "confirm",
    name: pk.createToc,
    message: messenger().prompts.createToc,
    default: false,
    when: (answers) => {
      return !answers[pk.hasToc];
    }
  },
  {
    type: "confirm",
    name: pk.hasPreview,
    message: messenger().prompts.hasPreview,
    default: false
  },
  {
    type: "file-tree-selection",
    name: pk.previewFile,
    message: messenger().prompts.previewFile,
    when: (answers) => {
      return answers[pk.hasPreview];
    }
  }
];

module.exports = () => {
  try {
    log(messenger().info.launched("audiobook’s manifest"));
    log(messenger().info.warning(basePath));

    inquirer.prompt(questions).then( async (answers) => {
      log(messenger().info.started("file(s)"));

      const publicationData = await createManifest(basePath, answers);

      const manifest = JSON.stringify(publicationData, null, 2);
      fileWriter("publication.json", manifest, messenger().info.created("manifest (publication.json)"));

      if (answers[pk.createToc]) {
        const indexPage = createIndex(publicationData);
        fileWriter("index.html", indexPage, messenger().info.created("Primary Entry Page (index.html)"));
      }
    });

  } catch (err) {
    error(err, true);
  }
}
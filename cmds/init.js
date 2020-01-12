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
const messager = require("../data/messages");
const pk = require("../data/private-keys.json");

const basePath = process.cwd();

inquirer.registerPrompt("datetime", inquirerDatePicker);
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

const questions = [
  {
    type: "input",
    name: "name",
    message: messager().prompts.title
  },
  {
    type: "confirm",
    name: pk.hasISBN,
    message: messager().prompts.hasISBN,
    default: true
  },
  {
    type: "input",
    name: pk.isbn,
    message: messager().prompts.isbn,
    when: (answers) => {
      return answers[pk.hasISBN];
    },
    validate: (value) => {
      if (isValidISBN(value)) {
        return true;
      } else {
        return messager().prompts.invalid.isbn;
      }
    }
  },
  {
    type: "input",
    name: "author",
    message: messager().prompts.author
  },
  {
    type: "input",
    name: "readBy",
    message: messager().prompts.narrator
  },
  {
    type: "input",
    name: "publisher",
    message: messager().prompts.publisher
  },
  {
    type: "input",
    name: "inLanguage",
    message: messager().prompts.language,
    default: "en",
    validate: (value) => {
      if (isValidLang(value)) {
        return true;
      } else {
        return messager().prompts.invalid.language;
      }
    }
  },
  {
    type: "datetime",
    name: "datePublished",
    message: messager().prompts.publicationDate,
    format: ["yyyy", "-", "mm", "-", "dd"]
  },
  {
    type: "confirm",
    name: pk.hasCover,
    message: messager().prompts.hasCover,
    default: true
  },
  {
    type: "file-tree-selection",
    name: pk.coverFile,
    message: messager().prompts.coverFile,
    when: (answers) => {
      return answers[pk.hasCover];
    }
  },
  {
    type: "confirm",
    name: pk.hasToc,
    message: messager().prompts.hasToc,
    default: true
  },
  {
    type: "file-tree-selection",
    name: pk.tocFile,
    message: messager().prompts.tocFile,
    when: (answers) => {
      return answers[pk.hasToc];
    }
  },
  {
    type: "confirm",
    name: pk.createToc,
    message: messager().prompts.createToc,
    default: true,
    when: (answers) => {
      return !answers[pk.hasToc];
    }
  }
];

module.exports = () => {
  try {
    log(messager().info.launched("audiobook’s manifest"));
    log(messager().info.warning(basePath));

    inquirer.prompt(questions).then(answers => {
      log(messager().info.started);

      const publicationData = createManifest(basePath, answers);

      const manifest = JSON.stringify(publicationData, null, 2);
      fileWriter("publication.json", manifest, messager().info.created("manifest (publication.json)"));

      if (answers[pk.createToc]) {
        const indexPage = createIndex(publicationData);
        fileWriter("index.html", indexPage, messager().info.created("Primary Entry Page (index.html)"));
      }
    });

  } catch (err) {
    error(err, true);
  }
}
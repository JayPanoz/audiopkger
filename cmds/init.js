const fs = require("fs");
const error = require("../utils/error");
const log = require("../utils/log");
const inquirer = require("inquirer");
const inquirerDatePicker = require("inquirer-datepicker-prompt");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
const createManifest = require("../utils/generators/createManifest");
const createIndex = require("../utils/generators/createIndex");
const isValidISBN = require("../utils/validators/isValidISBN");
const isValidLang = require("../utils/validators/isValidLang");

const basePath = process.cwd();

inquirer.registerPrompt("datetime", inquirerDatePicker);
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

const questions = [
  {
    type: "input",
    name: "name",
    message: "What is the title of your audiobook?"
  },
  {
    type: "confirm",
    name: "_hasISBN",
    message: "Do you have an ISBN?",
    default: true
  },
  {
    type: "input",
    name: "_isbn",
    message: "Enter your ISBN",
    when: (answers) => {
      return answers._hasISBN;
    },
    validate: (value) => {
      if (isValidISBN(value)) {
        return true;
      } else {
        return "Please enter a valid ISBN"
      }
    }
  },
  {
    type: "input",
    name: "author",
    message: "What is the name of the author?"
  },
  {
    type: "input",
    name: "readBy",
    message: "What is the name of the narrator?"
  },
  {
    type: "input",
    name: "publisher",
    message: "What is the name of the publisher?"
  },
  {
    type: "input",
    name: "inLanguage",
    message: "What is the language of your audiobook?",
    default: "en",
    validate: (value) => {
      if (isValidLang(value)) {
        return true;
      } else {
        return "Please enter a valid BCP-47 language tag";
      }
    }
  },
  {
    type: "datetime",
    name: "datePublished",
    message: "What is the publication date?",
    format: ["yyyy", "-", "mm", "-", "dd"]
  },
  {
    type: "confirm",
    name: "_hasCover",
    message: "Do you have a cover?",
    default: true
  },
  {
    type: "file-tree-selection",
    name: "_coverFile",
    message: "Choose your cover file",
    when: (answers) => {
      return answers._hasCover;
    }
  },
  {
    type: "confirm",
    name: "_hasToc",
    message: "Do you have a primary entry page with a toc?",
    default: true
  },
  {
    type: "file-tree-selection",
    name: "_tocFile",
    message: "Choose your index.html file",
    when: (answers) => {
      return answers._hasToc;
    }
  },
  {
    type: "confirm",
    name: "_createToc",
    message: "Would you like to create one?",
    default: true,
    when: (answers) => {
      return !answers._hasToc;
    }
  }
];

module.exports = () => {
  try {
    log(`\nHi, let’s create your audiobook’s manifest!\n\nYou are currently in "${basePath}". Make sure this is the root directory of the audiobook.\n\nIf it is not, you can abort with ctrl+c and navigate to the correct one.\n`);

    inquirer.prompt(questions).then(answers => {
      log("\nThe file(s) will be created in the current directory...\n");

      const manifest = createManifest(basePath, answers);

      const publicationData = JSON.stringify(manifest, null, 2);
      fs.writeFile("publication.json", publicationData, (err) => {
        if (err) {
          throw err;
        }
        log("The manifest (publication.json) has been created.\n");
      });

      if (answers._createToc) {
        const indexPage = createIndex(manifest);
        fs.writeFile("index.html", indexPage, (err) => {
          if (err) {
            throw err;
          }
          log("The Primary Entry Page (index.html) has been created.\n");
        });
      }
    });

  } catch (err) {
    error(err, true);
  }
}
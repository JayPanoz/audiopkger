const chalk = require("chalk");

module.exports = () => {
  return {
    prompts: {
      title: "What is the title of your audiobook?",
      hasAddress: "Is it published online and have an accessible URL?",
      address: "Enter its URL",
      idType: "What do you want to use as the canonical identifier?",
      idTypes: {
        address: "Address",
        isbn: "ISBN",
        uuid: "Random UUID"
      },
      isbn: "Enter your ISBN",
      author: "What is the name of the author?",
      narrator: "What is the name of the narrator?",
      publisher: "What is the name of the publisher?",
      language: "What is the language of your audiobook?",
      publicationDate: "What is the publication date?",
      hasCover: "Do you have a cover?",
      coverFile: "Choose your cover file",
      hasToc: "Do you have a primary entry page with a toc?",
      tocFile: "Choose your index.html file",
      createToc: "Would you like to create one?",
      hasPreview: "Does your audiobook embed a preview?",
      previewFile: "Choose your preview file",
      hasSupplements: "Does your audiobook embed supplemental content e.g. booklet?",
      supplementalFiles: "Choose your supplemental file(s). Use tab to expand the current folder, space to check the current item, enter to confirm your selection.",
      invalid: {
        address: "Please enter a valid URL e.g. https://www.example.org",
        isbn: "Please enter a valid ISBN",
        language: "Please enter a valid BCP-47 language tag"
      }
    },
    info: {
      launched: (type) => {
        return chalk.cyan(`\nLet’s create your ${type}!\n`);
      },
      warning: (basePath) => {
        return chalk.bold.yellow(`You are currently in "${basePath}". Make sure this is the root directory of the audiobook.\n\nIf it is not, you can abort with ctrl+c and navigate to the correct one.\n`);
      },
      started: (filestring) => {
        return `\nThe ${filestring} will be created in the current directory...\n`;
      },
      created: (filestring) => {
        return chalk.bold.green(`The ${filestring} has been created.\n`);
      },
      updating: (filestring) => {
        return chalk.yellow(`Updating the ${filestring}...\n`);
      }
    },
    ffmpeg: {
      start: (filestring) => {
        return `"${filestring}" is being processed by FFMPEG…\n`
      },
      progress: (progress, filestring) => {
        return `"${filestring}": ${Math.round(progress.percent)}% done`
      },
      error: (err) => {
        return chalk.bold.red(`× Could not process audio: ${err.message}\n`);
      },
      end: (filestring) => {
        return chalk.green(`✓ "${filestring}" was successfuly processed.\n`);
      }
    },
    error: {
      cmd: (cmd) => {
        return chalk.bold.red(`"${cmd}" is not a valid command!`);
      }
    }
  }
}
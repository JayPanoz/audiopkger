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
      invalid: {
        address: "Please enter a valid URL e.g. https://www.example.org",
        isbn: "Please enter a valid ISBN",
        language: "Please enter a valid BCP-47 language tag"
      }
    },
    info: {
      launched: (type) => {
        return `\nLet’s create your ${type}!\n`
      },
      warning: (basePath) => {
        return `You are currently in "${basePath}". Make sure this is the root directory of the audiobook.\n\nIf it is not, you can abort with ctrl+c and navigate to the correct one.\n`
      },
      started: (filestring) => {
        return `\nThe ${filestring} will be created in the current directory...\n`
      },
      created: (filestring) => {
        return `The ${filestring} has been created.\n`
      },
      updating: (filestring) => {
        return `Updating the ${filestring}...\n`
      }
    },
    error: {
      cmd: (cmd) => {
        return `"${cmd}" is not a valid command!`;
      }
    }
  }
}
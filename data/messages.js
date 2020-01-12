module.exports = () => {
  return {
    prompts: {
      title: "What is the title of your audiobook?",
      hasISBN: "Do you have an ISBN?",
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
      started: "\nThe file(s) will be created in the current directory...\n",
      created: (filename) => {
        return `The ${filename} has been created.\n`
      },
      updating: "Updating the manifest...\n"
    },
    error: {
      cmd: (cmd) => {
        return `"${cmd}" is not a valid command!`;
      }
    }
  }
}
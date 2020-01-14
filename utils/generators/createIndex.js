const navList = require("../transformers/navList");
const arrayToString = require("../transformers/arrayToString");

module.exports = (manifest) => {
  try {
    const title = manifest.name || "Contents";
    const handleAuthor = () => {
      if (manifest.author) {
        const author = arrayToString(manifest.author);
        return `\n\t<meta name="author" content="${author}" />`
      } else {
        return "";
      }
    };

    return `<!DOCTYPE html>
<html lang="${manifest.inLanguage}">
<head>
  <title>${title}</title>
  <meta charset="utf-8" />${handleAuthor()}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="publication.json" rel="publication"/>
</head>    
<body>
  <h1>${title}</h1>
  <nav role="doc-toc">
    ${navList(manifest.readingOrder)}
  </nav>
</body>
</html>`;
  } catch(err) {
    throw err;
  }
}
const doNavList = require("../transformers/orderToList");

module.exports = (manifest) => {
  try {
    const title = manifest.name || "Contents";
    const author = manifest.author || "";

    return `<!DOCTYPE html>
<html lang="${manifest.inLanguage}">
<head>
  <title>${title}</title>
  <meta charset="utf-8" />
  <meta name="author" content="${author}" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="publication.json" rel="publication"/>
</head>    
<body>
  <h1>${title}</h1>
  <nav role="doc-toc">
    ${doNavList(manifest.readingOrder)}
  </nav>
</body>
</html>`;
  } catch(err) {
    throw err;
  }
}
module.exports = (resources) => {
  try {
    let supplementsList = "";
    if (resources && resources.length > 0) {
      const isSupplement = (resource) => {
        return !resource.hasOwnProperty("rel");
      }
      const supplementsArray = resources.filter(isSupplement);
      if (supplementsArray.length > 0) {
        supplementsList = `
  <h2>Supplements</h2>
  <nav>
    <ol>`;
  
        for (const supplement of supplementsArray) {
          supplementsList += `
      <li>
        <a href="${supplement.url}">${supplement.name}</a>
      </li>
    `;
        }

        supplementsList += `</ol>
  </nav>`;
      }
    }
    return supplementsList;
  } catch (err) {
    return "";
  }
}
module.exports = (readingOrder) => {
  let navList = `<ol>`;
  
  for (const item of readingOrder) {
    navList += `
      <li>
        <a href="${item.url}">${item.name}</a>
      </li>
    `;
  }

  navList += `</ol>`;

  return navList;
}
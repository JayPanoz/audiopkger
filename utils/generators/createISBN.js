module.exports = (isbn) => {
  const id = isbn.replace(/[-\s]/g, "");
  return `urn:isbn:${id}`;
}
module.exports = (URLstring) => {
  try {
    new URL(URLstring);
    return true;
  } catch {
    return false;
  }
}
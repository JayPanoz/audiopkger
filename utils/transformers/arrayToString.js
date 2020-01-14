module.exports = (value) => {
  if (Array.isArray(value)) {
    return value.toString().replace(/,/g, ", ");
  } else {
    return value;
  }
}
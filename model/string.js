// string.js

function string(val) {
  if (typeof val === "string") {
    val = val.replace(/\\n/g, "\n");
    if (val[0] === '"' && val[val.length - 1] === '"') {
      val = val.substr(1, val.length - 2);
    } else {
      val = val.replace(/\\'/g, "'");
      val = val.replace(/(\\?")/g, double_quote);
    }
  }
  return val;

  function double_quote(match) {
    return match.substr(1);
  }
}

module.exports = string;

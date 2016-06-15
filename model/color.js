// color.js

function Color(val) {
  if (!val) return val;
  val += "";
  if (val.search(/^#[0-9A-Fa-f]{3,4}$/) === 0) {
    // #RGB -> #RRGGBB
    // #ARGB -> #AARRGGBB
    val = val.split("").map(function(c) {
      return c + c;
    }).join("").substr(1);
  }
  return val;
}

module.exports = Color;

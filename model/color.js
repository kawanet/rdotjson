// color.js

function Color(val) {
  if (!(this instanceof Color)) return new Color(val);
  this[0] = val;
}

Color.prototype.length = 1;

Color.prototype.toString = toString;

Color.prototype.toJSON = toString;

function toString() {
  var val = this[0];
  if (val && val.search(/^#[0-9A-Fa-f]{3,4}$/) === 0) {
    // #RGB -> #RRGGBB
    // #ARGB -> #AARRGGBB
    val = val.split("").map(function(c) {
      return c + c;
    }).join("").substr(1);
  }
  return val;
}

module.exports = Color;

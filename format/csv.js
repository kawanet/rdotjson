// csv.js

exports.format = csv;

var NEWLINE = "\x0D\x0A";

/**
 * Format as CSV
 *
 * @param R {Object}
 * @param [options] {Object}
 * @returns {String}
 */

function csv(R, options) {
  if (!options) options = {};

  var rows = [];

  Object.keys(R).sort().forEach(function(type) {
    Object.keys(R[type]).sort().forEach(function(key) {
      var val = R[type][key];
      var row = [type, key, val].map(filter).join(",") + NEWLINE;
      rows.push(row);
    });
  });

  return rows.join("");
}

function filter(str) {
  if (str == null) {
    str = "";
  } else if (str.search(/[,"\t]/) > -1) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
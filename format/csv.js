// csv.js

exports.format = csv;

var table_to_csv = require("../gist/table_to_csv");

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
      if (val instanceof Array) {
        val.forEach(function(item) {
          rows.push([type, key, item]);
        });
      } else {
        rows.push([type, key, val]);
      }
    });
  });

  return table_to_csv(rows);
}

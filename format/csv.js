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
      var comment = val && val.comment;

      if (val instanceof Array) {
        val.forEach(function(item, idx) {
          var row = [type, key, getValue(item)];
          if (comment && !idx) row.push(comment);
          rows.push(row);
        });
      } else {
        var row = [type, key, getValue(val)];
        if (comment) row.push(comment);
        rows.push(row);
      }
    });
  });

  function getValue(val) {
    return options.objectMode ? val.value : val;
  }

  return table_to_csv(rows);
}

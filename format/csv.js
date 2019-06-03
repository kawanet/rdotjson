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

  var sortRows = !options.comment;
  var objectMode = options.objectMode;

  var rows = [];

  getKeys(R).forEach(function(type) {
    getKeys(R[type]).forEach(function(key) {
      var val = R[type][key];
      var comment = val && val.comment;

      if (val instanceof Array) {
        val.forEach(function(item) {
          var row = [type, key, getValue(item)];
          var cmt = item && item.comment || comment;
          if (cmt) row.push(cmt);
          rows.push(row);
        });
      } else {
        var row = [type, key, getValue(val)];
        if (comment) row.push(comment);
        rows.push(row);
      }
    });
  });

  return table_to_csv(rows);

  // don't sort rows when {comment: true}
  function getKeys(hash) {
    var array = Object.keys(hash);
    return sortRows ? array : array.sort();
  }

  // pick value property when {objectMode: true}
  function getValue(val) {
    return objectMode ? val.value : val;
  }
}

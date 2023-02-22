// csv.js

exports.format = csv;

const table_to_csv = require("../gist/table_to_csv");

/**
 * Format as CSV
 *
 * @param R {Object}
 * @param [options] {Object}
 * @returns {String}
 */

function csv(R, options) {
  if (!options) options = {};

  const sortRows = !options.comment;
  const objectMode = options.objectMode;

  const rows = [];

  getKeys(R).forEach(function(type) {
    getKeys(R[type]).forEach(function(key) {
      const val = R[type][key];
      const comment = val && val.comment;

      if (val instanceof Array) {
        val.forEach(function(item) {
          const row = [type, key, getValue(item)];
          const cmt = item && item.comment || comment;
          if (cmt) row.push(cmt);
          rows.push(row);
        });
      } else {
        const row = [type, key, getValue(val)];
        if (comment) row.push(comment);
        rows.push(row);
      }
    });
  });

  return table_to_csv(rows);

  // don't sort rows when {comment: true}
  function getKeys(hash) {
    const array = Object.keys(hash);
    return sortRows ? array : array.sort();
  }

  // pick value property when {objectMode: true}
  function getValue(val) {
    return objectMode ? val.value : val;
  }
}

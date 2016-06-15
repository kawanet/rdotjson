/**
 * Convert array of array to CSV (text/comma-separated-values)
 *
 * @param table {Array} array of array
 * @returns {String} CSV
 * @license MIT
 * @see https://gist.github.com/kawanet/8438183
 */

function table_to_csv(table) {
  var buf = table.map(function(row) {
    row = row.map(function(str) {
      if (str == null) {
        str = "";
      } else {
        str += "";
      }
      if (str.search(/[,"\t\n\r]/) > -1) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    });
    return row.join(",") + "\x0D\x0A";
  });
  return buf.join("");
}

if ("undefined" !== typeof module) module.exports = table_to_csv;

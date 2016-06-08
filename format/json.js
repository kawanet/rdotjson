// json.js

exports.format = json;

/**
 * Format as a JSON
 *
 * @param R {Object}
 * @param [options] {Object}
 * @returns {String}
 */

function json(R, options) {
  if (!options) options = {};
  var space = (options.space == null) ? "  " : options.space;
  return JSON.stringify(R, null, space);
}

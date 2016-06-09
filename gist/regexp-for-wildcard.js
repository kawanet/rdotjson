/**
 * Build RegExp object for wildcard string including "?" and "*"
 *
 * @param str {String|Array} wildcard string or an array of them
 * @param [opt] {String} RegExp option: "i"
 * @returns {RegExp}
 * @license MIT
 * @see https://gist.github.com/kawanet/a056f4ff59853b2e3f48bd548eddfd02
 */

function regexpForWildcard(str, opt) {
  str = (str instanceof Array) ? str.map(regexp).join("|") : regexp(str);
  str = "^(" + str + ")$";
  return new RegExp(str, opt);
}

function regexp(str) {
  str += "";
  str = str.replace(/([!-/:-@\[-`\{-~])/g, "\\$1");
  str = str.replace(/(\\\*)+/g, ".*");
  str = str.replace(/\\\?/g, ".");
  return str;
}

if ("undefined" !== typeof module) module.exports = regexpForWildcard;

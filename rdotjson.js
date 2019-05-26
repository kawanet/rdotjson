// rtojson.js

var cheerio = require("cheerio");
var isReadableStream = require("is-stream").readable;
var readFromStream = require("./gist/read-from-stream");
var regexpForWildcard = require("./gist/regexp-for-wildcard");

var exports = module.exports = rtojson;
exports.format = format;

var model = {
  bool: require("./model/bool"),
  integer: require("./model/integer"),
  string: require("./model/string")
};

function getComment(ele) {
  if (!ele.next) return null;
  if (ele.next.type === 'comment') return ele.next.data.trim();
  if (ele.next.type === 'text') return getComment(ele.next);
  return null;
}

/**
 * parse resource XML
 *
 * @param xml {String|Buffer|Stream}
 * @param [options] {Object}
 * @param callback {Function} function(err, R) {...}
 */

function rtojson(xml, options, callback) {
  if (options instanceof Function && callback == null) {
    callback = options;
    options = null;
  }

  if (!options) options = {};

  if (isReadableStream(xml)) {
    return readFromStream(xml, function(err, xml) {
      if (err) {
        if (callback) callback(err);
        return;
      }
      rtojson(xml, options, callback);
    });
  }

  var exclude = options.exclude && regexpForWildcard(options.exclude);

  var $ = cheerio.load(xml, {
    normalizeWhitespace: true,
    xmlMode: true
  });

  var R = options.R || {};
  $("resources > *").each(function(idx, e) {
    var $e = $(e);
    var type = $e.attr("type") || e.name;
    if (!type) return;
    var group = type;
    var array = type.match(/-array$/);
    if (array) {
      group = "array";
      type = type.replace(/-array$/, "");
    }
    var name = $e.attr("name");
    if (exclude && name.match(exclude)) return;
    var hash = R[group] || (R[group] = {});
    var val;
    if (array) {
      val = [];
      $e.find("item").each(function(idx, item) {
        val.push(filter($(item).text()));
      });
    } else {
      val = filter($e.text());
    }
    hash[name] = val;

    function filter(val) {
      var f = model[type];
      return f ? f(val) : val;
    }

    if (options.includeComments) {
      var comment = getComment(e);
      if (comment) {
        hash[name] = {
          value: hash[name],
          comment: comment
        };
      }
    }
  });

  if (callback) return callback(null, R);
}

/**
 * Find format function
 *
 * @param name {String}
 * @returns {Function} format function
 */

function format(name) {
  var func;
  try {
    func = require("./format/" + name).format;
  } catch (e) {
    // ignore
  }
  if (func) return func;
  return require(name).format;
}

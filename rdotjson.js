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
  var type;
  $("resources > *").each(function(idx, e) {
    var $e = $(e);
    type = $e.attr("type") || e.name;
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
        val.push(getValue($(item)));
      });
    } else {
      val = getValue($e);
    }
    hash[name] = val;
  });

  if (callback) return callback(null, R);

  function getValue($item) {
    var val;

    if (type === "string" && options.xml) {
      val = $item.html();
    } else {
      val = getText($item);
    }

    if (options.attr) {
      val = addAttributes(val, $item);
    }

    return val;
  }

  function getText($item) {
    var val = $item.text();
    var filter = model[type];
    return filter ? filter(val) : val;
  }
}

function wrapObject(val) {
  /* jshint -W053 */

  if ("boolean" === typeof val) {
    // W053: Do not use Boolean as a constructor.
    val = new Boolean(val);
  } else if ("number" === typeof val) {
    // W053: Do not use Number as a constructor.
    val = new Number(val);
  } else if ("string" === typeof val) {
    // W053: Do not use String as a constructor.
    val = new String(val);
  }

  return val;
}

function addAttributes(val, $item) {
  var attr = $item.attr();

  if (Object.keys(attr).length) {
    val = wrapObject(val);
    if ("object" === typeof val) {
      val.attr = attr;
    }
  }

  return val;
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
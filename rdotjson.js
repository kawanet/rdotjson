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
    normalizeWhitespace: false,
    xmlMode: true
  });

  var R = options.R || {};
  // prepositive XML comments
  var preComments = (options.comment === "pre");
  // postpositive XML comments
  var postComments = (options.comment === "post");
  // right-side XML comment within the same line
  var rightComment = (options.comment === "right");

  var includeComments = preComments || postComments || rightComment;
  var type;
  var hash;
  var name;

  $("resources").each(function(idx, resources) {
    var childNodes = resources && resources.childNodes;
    if (!childNodes) return;

    var comments;

    [].forEach.call(childNodes, function(e) {
      if (includeComments && e.type === "comment") {
        var comment = e.data.trim();
        if (!preComments && hash && name) {
          appendComment(comment);
        } else if (!rightComment) {
          if (!comments) comments = [];
          comments.push(comment);
        }
      }

      // ignore following comments after newline
      if (rightComment && e.type === "text") {
        if (e.data.indexOf("\n") > -1) {
          hash = name = null;
        }
      }

      if (e.type !== "tag") return;

      eachItem(e);

      if (comments && hash && name) {
        comments.forEach(appendComment);
      }

      comments = null;
    });

    if (comments && hash && name) {
      comments.forEach(appendComment);
    }
  });

  if (callback) return callback(null, R);

  function eachItem(e) {
    hash = name = null;
    var $e = $(e);
    type = $e.attr("type") || e.name;
    if (!type) return;
    var group = type;
    var array = type.match(/-array$/);
    if (array) {
      group = "array";
      type = type.replace(/-array$/, "");
    }
    name = $e.attr("name");
    if (exclude && name.match(exclude)) return;
    hash = R[group] || (R[group] = {});
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
  }

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

    // leading spaces
    val = val.replace(/^\s+/, "");

    // trailing spaces
    val = val.replace(/\s+$/, "");

    var filter = model[type];
    return filter ? filter(val) : val;
  }

  function appendComment(comment) {
    if (!comment) return;
    hash[name] = addComment(hash[name], comment);
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

function addComment(val, comment) {
  val = wrapObject(val);

  if ("object" === typeof val) {
    var prev = val.comment;
    if (prev instanceof Array) {
      prev.push(comment);
    } else if ("string" === typeof prev) {
      val.comment = [prev, comment];
    } else {
      val.comment = comment;
    }
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

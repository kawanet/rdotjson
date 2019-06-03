// rtojson.js

var cheerio = require("cheerio");
var isReadableStream = require("is-stream").readable;
var getString = require("./lib/get-string").getString;
var readFromStream = require("./gist/read-from-stream");
var regexpForWildcard = require("./gist/regexp-for-wildcard");

var exports = module.exports = rtojson;
exports.format = format;

var typeFilter = {
  "integer-array": Math.round,
  bool: isTrue,
  integer: Math.round
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

  [].forEach.call($("resources"), function(resources) {
    var childNodes = resources && resources.childNodes;
    if (!childNodes) return;

    var comments;

    [].forEach.call(childNodes, function(e) {
      if (includeComments && e.type === "comment") {
        var comment = e.data.trim();
        if (!preComments && hash && name) {
          // right or post comments
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

      // pre comments
      if (comments && hash && name) {
        comments.forEach(appendComment);
      }

      comments = null;
    });

    // post comments
    if (comments && hash && name) {
      comments.forEach(appendComment);
    }
  });

  if (callback) return callback(null, R);

  function eachItem(item) {
    hash = name = null;

    type = item.name;
    if (!type) return;

    var group = type;
    var array = type.match(/-array$/);
    if (array) {
      group = "array";
    }

    name = $(item).attr("name");

    if (exclude && name.match(exclude)) return;

    hash = R[group] || (R[group] = {});

    var val;
    if (array) {
      val = [];
      if (!item.childNodes) return;
      [].forEach.call(item.childNodes, function(item) {
        if (item.name !== "item") return;
        val.push(getValue(item));
      });
    } else {
      val = getValue(item);
    }

    hash[name] = val;
  }

  function getValue(item) {
    var val;

    if (options.xml) {
      val = $(item).html();
    } else {
      val = getString(item);
      var filter = typeFilter[type];
      if (filter) val = filter(val);
    }

    if (options.objectMode) {
      val = {value: val};
    }

    if (options.attr) {
      val = addAttributes(val, $(item).attr());
    }

    return val;
  }

  function appendComment(comment) {
    if (!comment) return;
    hash[name] = addComment(hash[name], comment);
  }
}

function addComment(val, comment) {
  val = new Object(val);

  var prev = val.comment;
  if (prev instanceof Array) {
    prev.push(comment);
  } else if ("string" === typeof prev) {
    val.comment = [prev, comment];
  } else {
    val.comment = comment;
  }

  return val;
}

function addAttributes(val, attr) {
  if (Object.keys(attr).length) {
    val = new Object(val);
    val.attr = attr;
  }

  return val;
}

function isTrue(val) {
  return (val + "" === "true");
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

// rtojson.js

const cheerio = require("cheerio");
const isReadableStream = require("is-stream").readable;
const {getString} = require("./lib/get-string");
const readFromStream = require("./gist/read-from-stream");
const regexpForWildcard = require("./gist/regexp-for-wildcard");

const _exports = module.exports = rtojson;
_exports.format = format;

const typeFilter = {
  "integer-array": Math.round,
  bool: isTrue,
  integer: Math.round
};

/**
 * parse resource XML
 *
 * @param xml {String|Buffer|Stream}
 * @param [options] {Object}
 * @param [callback] {Function} function(err, R) {...}
 */

function rtojson(xml, options, callback) {
  if (options instanceof Function && callback == null) {
    callback = options;
    options = null;
  }

  if (!callback) {
    return new Promise((resolve, reject) => {
      rtojson(xml, options, (err, R) => err ? reject(err) : resolve(R));
    });
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

  const exclude = options.exclude && regexpForWildcard(options.exclude);

  const $ = cheerio.load(xml, {
    normalizeWhitespace: false,
    xmlMode: true
  });

  const R = options.R || {};
  // prepositive XML comments
  const preComments = (options.comment === "pre");
  // postpositive XML comments
  const postComments = (options.comment === "post");
  // right-side XML comment within the same line
  const rightComment = (options.comment === "right");

  const includeComments = preComments || postComments || rightComment;
  let type;
  let hash;
  let name;

  [].forEach.call($("resources"), function(resources) {
    const childNodes = resources && resources.childNodes;
    if (!childNodes) return;

    let comments;

    [].forEach.call(childNodes, function(e) {
      if (includeComments && e.type === "comment") {
        const comment = e.data.trim();
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

    let group = type;
    const array = type.match(/-array$/);
    if (array) {
      group = "array";
    }

    name = $(item).attr("name");

    if (exclude && name.match(exclude)) return;

    hash = R[group] || (R[group] = {});

    let val;
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
    let val;

    if (options.xml) {
      val = $(item).html();
    } else {
      val = getString(item);
      const filter = typeFilter[type];
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

  const prev = val.comment;
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
  let func;
  try {
    func = require("./format/" + name).format;
  } catch (e) {
    // ignore
  }
  if (func) return func;
  return require(name).format;
}

// rtojson.js

var cheerio = require("cheerio");
var isReadableStream = require("is-stream").readable;

module.exports = rtojson;

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
    readFromStream(xml, main);
  } else {
    main(null, xml);
  }

  function main(err, xml) {
    if (err) {
      if (callback) callback(err);
      return;
    }

    var $ = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    });

    var R = options.R || {};
    $("resources > *").each(function(idx, e) {
      var $e = $(e);
      var type = $e.attr("type") || e.name;
      if (!type) return;
      var hash = R[type] || (R[type] = {});
      var name = $e.attr("name");
      hash[name] = $e.text();
    });

    if (callback) return callback(null, R);
  }
}

function readFromStream(stream, callback) {
  var buf = [];
  stream.on("data", onData);
  stream.on("end", onEnd);
  stream.on("error", onError);

  function onData(data) {
    buf.push(data);
  }

  function onEnd() {
    if (callback) callback(null, buf.join(""));
    callback = null;
  }

  function onError(err) {
    if (callback) callback(err);
    callback = null;
  }
}

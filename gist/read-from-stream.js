/**
 * Read all data from stream
 * 
 * @param stream {Stream}
 * @param callback {Function} function(err, str) {...}
 * @license MIT
 * @see https://gist.github.com/kawanet/c6c998b00500fe05eb8dfd0ee80deacf
 */

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

if ("undefined" !== typeof module) module.exports = readFromStream;

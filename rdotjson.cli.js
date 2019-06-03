#!/usr/bin/env node

var fs = require("fs");
var options = require("process.argv")(process.argv.slice(2))();

var rdotjson = require("./rdotjson");

main();

function main() {
  var args = options["--"] || [];

  if (options.version) {
    console.log(require("./package.json").version);
    process.exit(0);
    return;
  }

  if (!Object.keys(options).length) {
    var cmd = process.argv[1].replace(/^.*\//, "");
    return error("Usage: " + cmd + " app/src/main/res/values/*.xml --output=R.swift");
  }
  var R = options.R = {};
  next();

  function error(err) {
    console.warn((err instanceof Error) ? err.stack : err + "");
    process.exit(1);
    return;
  }

  function next(err) {
    if (err) return end(err);
    if (!args.length) return end();
    var file = args.shift();
    var isSTDIN = (file === "-");
    console.warn("reading: " + (isSTDIN ? "(stdin)" : file));
    var stream = isSTDIN ? process.stdin : fs.createReadStream(file);
    rdotjson(stream, options, next);
  }

  function end(err) {
    if (err) return error(err);
    var output = options.output || "-";
    var isSTDOUT = (output === "-");
    console.warn("writing: " + (isSTDOUT ? "(stdout)" : output));
    var out = isSTDOUT ? process.stdout : fs.createWriteStream(output);
    var format = rdotjson.format(options.format || "json");
    out.write(format(R, options));
    if (!isSTDOUT) out.end();
  }
}

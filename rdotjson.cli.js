#!/usr/bin/env node

const fs = require("fs");
const options = require("process.argv")(process.argv.slice(2))();

const rdotjson = require("./rdotjson");

main();

function main() {
  const args = options["--"] || [];

  if (options.version) {
    console.log(require("./package.json").version);
    process.exit(0);
    return;
  }

  if (!Object.keys(options).length) {
    const cmd = process.argv[1].replace(/^.*\//, "");
    return error("Usage: " + cmd + " app/src/main/res/values/*.xml --output=R.swift");
  }
  const R = options.R = {};
  next();

  function error(err) {
    console.warn((err instanceof Error) ? err.stack : err + "");
    process.exit(1);
    return;
  }

  function next(err) {
    if (err) return end(err);
    if (!args.length) return end();
    const file = args.shift();
    const isSTDIN = (file === "-");
    console.warn("reading: " + (isSTDIN ? "(stdin)" : file));
    const stream = isSTDIN ? process.stdin : fs.createReadStream(file);
    rdotjson(stream, options, next);
  }

  function end(err) {
    if (err) return error(err);
    const output = options.output || "-";
    const isSTDOUT = (output === "-");
    console.warn("writing: " + (isSTDOUT ? "(stdout)" : output));
    const out = isSTDOUT ? process.stdout : fs.createWriteStream(output);
    const format = rdotjson.format(options.format || "json");
    out.write(format(R, options));
    if (!isSTDOUT) out.end();
  }
}

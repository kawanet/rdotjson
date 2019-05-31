#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("string-space.xml", function(done) {
    var xml = fs.readFileSync(__dirname + "/values/string-space.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);

      assert.equal(esc(R.string.single_line_without_newline), esc("FOO.BAR"), "single_line_without_newline");

      assert.equal(esc(R.string.multiple_lines_without_newline), esc("FOO.BAR"), "multiple_lines_without_newline");

      assert.equal(esc(R.string.indented_lines_without_newline), esc("FOO.BAR"), "indented_lines_without_newline");

      assert.equal(esc(R.string.single_line_with_newline), esc("FOO.BAR\n"), "single_line_with_newline");

      assert.equal(esc(R.string.multiple_lines_with_newline), esc("FOO\n.\n.\n.BAR\n"), "multiple_lines_with_newline");

      assert.equal(esc(R.string.indented_lines_with_newline), esc("FOO\n.\n.\n.BAR\n"), "indented_lines_with_newline");

      assert.equal(esc(R.string.single_line_with_quote), esc("FOO.....BAR\n"), "single_line_with_quote");

      assert.equal(esc(R.string.multiple_lines_with_quote), esc("FOO\n\n\n\n\n\nBAR\n"), "multiple_lines_with_quote");

      assert.equal(esc(R.string.indented_lines_with_quote), esc("FOO\n\n........BAR\n"), "indented_lines_with_quote");

      done();
    });
  });
});

function esc(str) {
  str = str.replace(/\n/g, "\\n");
  str = str.replace(/\r/g, "\\r");
  str = str.replace(/\t/g, "\\t");
  str = str.replace(/\x20/g, ".");
  return str;
}

#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  var xml;

  it("string-cdata.xml", function(done) {
    xml = fs.readFileSync(__dirname + "/values/string-cdata.xml");
    assert.ok(xml);

    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);

      // FIXME: continuous spaces are not trimmed in CDATA section.
      assert.equal(esc(R.string.string_with_space_only), '');
      assert.equal(esc(R.string.cdata_with_space_only), '');
      assert.equal(esc(R.string.string_without_quote), 'FOO.BAR');
      assert.equal(esc(R.string.cdata_without_quote), 'FOO..BAR');
      assert.equal(esc(R.string.string_with_quote), 'FOO..BAR');
      assert.equal(esc(R.string.cdata_with_quote), '"FOO..BAR"');
      assert.equal(esc(R.string.string_with_escaped_quote), '"FOO.BAR"');
      assert.equal(esc(R.string.cdata_with_escaped_quote), '"FOO..BAR"');
      assert.equal(esc(R.string.string_with_escaped_newline), '\nFOO.BAR\n');
      assert.equal(esc(R.string.cdata_with_escaped_newline), '\nFOO..BAR\n');
      assert.equal(esc(R.string.string_with_tag), '.FOO..BAR..BUZ.');
      assert.equal(esc(R.string.cdata_with_tag), 'FOO..<b>..BAR..</b>..BUZ');
      assert.equal(esc(R.string.string_with_tag_in_quote), '.[...FOO.BAR..]..');
      assert.equal(esc(R.string.string_with_quote_in_tag), '..[..FOO..BAR..]..');

      done();
    });
  });
});

/**
 * replace a white space with `.` dot
 */

function esc(str) {
  return (str + "").replace(/ /g, ".");
}

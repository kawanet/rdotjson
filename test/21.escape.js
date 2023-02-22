#!/usr/bin/env mocha -R spec

const assert = require("assert");
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("string-escape.xml", function(done) {
    const xml = fs.readFileSync(__dirname + "/values/string-escape.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);
      assert.equal(R.string.good_example_1, "This'll work");
      assert.equal(R.string.good_example_2, "This'll also work");
      assert.equal(R.string.good_example_3, 'This is a "good string".');
      assert.equal(R.string.bad_example_1, "This is a bad string.");

      done();
    });
  });
});

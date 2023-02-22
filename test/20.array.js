#!/usr/bin/env mocha -R spec

const assert = require("assert");
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("string-array.xml", function(done) {
    const xml = fs.readFileSync(__dirname + "/values/string-array.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.array);

      const array = R.array.planets_array;
      assert.ok(array instanceof Array);
      assert.equal(array[0], "Mercury");
      assert.equal(array[3], "Mars");

      done();
    });
  });
});

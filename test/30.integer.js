#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("integer.xml", function(done) {
    var xml = fs.readFileSync(__dirname + "/values/integer.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.integer);
      assert.equal(typeof R.integer.max_speed, "number");
      assert.equal(R.integer.max_speed, 75);
      assert.equal(R.integer.min_speed, 5);

      done();
    });
  });

  it("integers.xml", function(done) {
    var xml = fs.readFileSync(__dirname + "/values/integers.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.array);

      var array = R.array.bits;
      assert.ok(array instanceof Array);
      assert.equal(typeof array[0], "number");
      assert.equal(array[0], 4);
      assert.equal(array[3], 32);

      done();
    });
  });
});

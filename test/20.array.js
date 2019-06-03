#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("string-array.xml", function(done) {
    var xml = fs.readFileSync(__dirname + "/values/string-array.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.array);

      var array = R.array.planets_array;
      assert.ok(array instanceof Array);
      assert.equal(array[0], "Mercury");
      assert.equal(array[3], "Mars");

      done();
    });
  });
});

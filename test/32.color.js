#!/usr/bin/env mocha -R spec

const assert = require("assert");
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("color.xml", function(done) {
    const xml = fs.readFileSync(__dirname + "/values/color.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.color);
      assert.equal(R.color.opaque_red + "", "#f00");
      assert.equal(R.color.invisible_red + "", "#0f00");
      assert.equal(R.color.translucent_red + "", "#80ff0000");

      done();
    });
  });
});

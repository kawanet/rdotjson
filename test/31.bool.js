#!/usr/bin/env mocha -R spec

const assert = require("assert").strict;
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("bools.xml", function(done) {
    const xml = fs.readFileSync(__dirname + "/values/bools.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.bool);
      assert.equal(typeof R.bool.screen_small, "boolean");
      assert.equal(R.bool.screen_small, true);
      assert.equal(typeof R.bool.adjust_view_bounds, "boolean");
      assert.equal(R.bool.adjust_view_bounds, false);

      done();
    });
  });
});

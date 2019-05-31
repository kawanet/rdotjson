#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  it("indent.xml", function(done) {
    var xml = fs.readFileSync(__dirname + "/values/indent.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);

      assert.equal(R.bool.screen_small, true);

      assert.equal(R.bool.adjust_view_bounds, false);

      assert.equal(R.color.colorPrimary + "", "#3F51B5");

      assert.equal(R.dimen.activity_horizontal_margin, "16dp");

      assert.equal(R.integer.max_speed, 75);

      assert.equal(R.string.app_name, "MyApp");

      done();
    });
  });
});

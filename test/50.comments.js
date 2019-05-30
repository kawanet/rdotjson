#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  var xml;

  it("comments.xml", function(done) {
    xml = fs.readFileSync(__dirname + "/values/comments.xml");
    assert.ok(xml);

    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(R.bool.screen_small, true);
      assert.equal(R.bool.adjust_view_bounds, false);
      assert.equal(R.color.colorPrimary + "", "#3F51B5");
      assert.equal(R.dimen.activity_horizontal_margin, "16dp");
      assert.equal(R.integer.max_speed, 75);
      assert.equal(R.string.app_name, "MyApp");

      done();
    });
  });

  it("includeComments:true", function(done) {
    rdotjson(xml, {includeComments: true}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(R.bool.screen_small, true);
      assert.equal(R.bool.adjust_view_bounds, false);
      assert.equal(R.color.colorPrimary + "", "#3F51B5");
      assert.equal(R.dimen.activity_horizontal_margin, "16dp");
      assert.equal(R.integer.max_speed, 75);
      assert.equal(R.string.app_name, "MyApp");

      assert.equal(R.bool.screen_small.comment + "", "between bool");
      assert.equal(R.bool.adjust_view_bounds.comment + "", "after bool");
      assert.equal(R.color.colorPrimary.comment + "", "after color");
      assert.equal(R.dimen.activity_horizontal_margin.comment + "", "after dimen");
      assert.equal(R.integer.max_speed.comment + "", "after integer");
      assert.equal(R.string.app_name.comment + "", "after string");

      done();
    });
  });
});

function checkAll(R) {
  assert.ok(R);

  assert.ok(R.bool);
  assert.ok(R.color);
  assert.ok(R.dimen);
  assert.ok(R.integer);
  assert.ok(R.string);
}

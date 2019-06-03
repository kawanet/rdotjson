#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  var xml;

  it("values.xml", function(done) {
    xml = fs.readFileSync(__dirname + "/values/values.xml");
    assert.ok(xml);
    done();
  });

  it("{xml: false}", function(done) {
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);

      assert.equal(R.bool.screen_small, true);

      assert.equal(R.bool.adjust_view_bounds, false);

      assert.equal(R.color.colorPrimary + "", "#3F51B5");

      assert.equal(R.dimen.activity_horizontal_margin, "16dp");

      assert.equal(R.integer.max_speed, 75);

      assert.equal(R.string.app_name, "MyApp");

      assert.equal(R.array.bits[0], 4);

      assert.equal(R.array.planets_array[0], "Mercury");

      done();
    });
  });

  it("{xml: true}", function(done) {
    rdotjson(xml, {xml: true}, function(err, R) {
      assert.ok(!err, err);

      assert.strictEqual(esc(R.bool.screen_small), ".true.");

      assert.strictEqual(esc(R.bool.adjust_view_bounds), ".false.");

      assert.strictEqual(esc(R.color.colorPrimary), ".#3F51B5.");

      assert.strictEqual(esc(R.dimen.activity_horizontal_margin), ".16dp.");

      assert.strictEqual(esc(R.integer.max_speed), ".75.");

      assert.strictEqual(esc(R.string.app_name), ".MyApp.");

      assert.strictEqual(esc(R.array.bits[0]), ".4.");

      assert.strictEqual(esc(R.array.planets_array[0]), ".Mercury.");

      done();
    });
  });
});

/**
 * replace white spaces with `.` dot
 */

function esc(str) {
  return (str + "").replace(/\s+/g, ".");
}

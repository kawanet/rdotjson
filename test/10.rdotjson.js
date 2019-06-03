#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  var colors, dimens, strings;
  var RR = {};

  it("colors.xml", function(done) {
    colors = fs.readFileSync(__dirname + "/values/colors.xml");
    assert.ok(colors);
    rdotjson(colors, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.color);
      assert.equal(R.color.colorPrimary, "#3F51B5");
      assert.equal(R.color.colorPrimaryDark, "#303F9F");
      assert.equal(R.color.colorAccent, "#FF4081");
      done();
    });
  });

  it("dimens.xml", function(done) {
    dimens = fs.readFileSync(__dirname + "/values/dimens.xml");
    assert.ok(dimens);
    rdotjson(dimens, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.dimen);
      assert.equal(R.dimen.activity_horizontal_margin, "16dp");
      assert.equal(R.dimen.activity_vertical_margin, "16dp");
      assert.equal(R.dimen.fab_margin, "16dp");
      done();
    });
  });

  it("strings.xml", function(done) {
    strings = fs.readFileSync(__dirname + "/values/strings.xml");
    assert.ok(strings);
    rdotjson(strings, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);
      assert.equal(R.string.app_name, "MyApp");
      assert.equal(R.string.action_settings, "Settings");
      done();
    });
  });

  it("{R: {}}", function(done) {
    var option = {R: RR};
    var source = [colors, dimens, strings];
    next();

    function next(err, R) {
      assert.ok(!err, err);
      var xml = source.shift();
      if (!xml) return checkAll(R, done);
      rdotjson(xml, option, next);
    }
  });
});

function checkAll(R, callback) {
  assert.ok(R);
  assert.ok(R.color);
  assert.ok(R.dimen);
  assert.ok(R.string);
  assert.equal(R.color.colorPrimary, "#3F51B5");
  assert.equal(R.dimen.activity_horizontal_margin, "16dp");
  assert.equal(R.string.app_name, "MyApp");
  callback();
}

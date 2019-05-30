#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  var xml;
  var jsonFormat;
  var jsonString;
  var csvFormat;

  it("comments.xml", function(done) {
    xml = fs.readFileSync(__dirname + "/values/comments.xml");
    assert.ok(xml);
    done();
  });

  it("{includeComments: false}", function(done) {
    rdotjson(xml, {includeComments: false}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      jsonFormat = rdotjson.format("json");
      jsonString = jsonFormat(R);
      assert.ok(jsonString);

      csvFormat = rdotjson.format("csv");
      assert.equal(firstRow(csvFormat(R)), 'bool,adjust_view_bounds,false');

      done();
    });
  });

  it("{includeComments: true}", function(done) {
    rdotjson(xml, {includeComments: true}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(jsonFormat(R), jsonString);

      assert.equal(R.bool.screen_small.comment + "", "before bool,between bool");
      assert.equal(R.bool.adjust_view_bounds.comment + "", "after bool,before color");
      assert.equal(R.color.colorPrimary.comment + "", "after color,before dimen");
      assert.equal(R.dimen.activity_horizontal_margin.comment + "", "after dimen,before integer");
      assert.equal(R.integer.max_speed.comment + "", "after integer,before string");
      assert.equal(R.string.app_name.comment + "", "after string");

      assert.equal(firstRow(csvFormat(R)), 'bool,adjust_view_bounds,false,"after bool,before color"');

      done();
    });
  });

  it("{includeComments: 'pre'}", function(done) {
    rdotjson(xml, {includeComments: "pre"}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(jsonFormat(R), jsonString);

      assert.equal(R.bool.screen_small.comment + "", "before bool");
      assert.equal(R.bool.adjust_view_bounds.comment + "", "between bool");
      assert.equal(R.color.colorPrimary.comment + "", "after bool,before color");
      assert.equal(R.dimen.activity_horizontal_margin.comment + "", "after color,before dimen");
      assert.equal(R.integer.max_speed.comment + "", "after dimen,before integer");
      assert.equal(R.string.app_name.comment + "", "after integer,before string,after string");

      assert.equal(firstRow(csvFormat(R)), 'bool,adjust_view_bounds,false,between bool');

      done();
    });
  });
});

function firstRow(csv) {
  return csv.split(/\r?\n/).shift();
}

function checkAll(R) {
  assert.ok(R);

  assert.ok(R.bool);
  assert.ok(R.color);
  assert.ok(R.dimen);
  assert.ok(R.integer);
  assert.ok(R.string);

  assert.equal(R.bool.screen_small, true);
  assert.equal(R.bool.adjust_view_bounds, false);
  assert.equal(R.color.colorPrimary + "", "#3F51B5");
  assert.equal(R.dimen.activity_horizontal_margin, "16dp");
  assert.equal(R.integer.max_speed, 75);
  assert.equal(R.string.app_name, "MyApp");
}

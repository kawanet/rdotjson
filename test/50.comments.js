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

  it("values.xml", function(done) {
    xml = fs.readFileSync(__dirname + "/values/values.xml");
    assert.ok(xml);
    done();
  });

  it("{comment: null}", function(done) {
    rdotjson(xml, {comment: null}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      jsonFormat = rdotjson.format("json");
      jsonString = jsonFormat(R);
      assert.ok(jsonString);

      var C = getCSVRow(R, 3);
      assert.equal(C.bool.screen_small, 'bool,screen_small,true');
      assert.equal(C.bool.adjust_view_bounds, 'bool,adjust_view_bounds,false');

      done();
    });
  });

  it("{comment: 'post'}", function(done) {
    rdotjson(xml, {comment: 'post'}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(jsonFormat(R), jsonString);

      assert.equal(R.bool.screen_small.comment + "", "before bool,between bool");
      assert.equal(R.bool.adjust_view_bounds.comment + "", "after bool,before color");
      assert.equal(R.color.colorPrimary.comment + "", "after color,before dimen");
      assert.equal(R.dimen.activity_horizontal_margin.comment + "", "after dimen,before integer");
      assert.equal(R.integer.max_speed.comment + "", "after integer,before string");
      assert.equal(R.string.app_name.comment + "", "between string");
      assert.equal(R.string.action_settings.comment + "", "after string,before array");
      assert.equal(R.array.bits.comment + "", "between array");
      assert.equal(R.array.planets_array.comment + "", "after array");

      var C = getCSVRow(R, 3);
      assert.equal(C.bool.screen_small, 'bool,screen_small,true,"before bool,between bool"');
      assert.equal(C.bool.adjust_view_bounds, 'bool,adjust_view_bounds,false,"after bool,before color"');

      done();
    });
  });

  it("{comment: 'pre'}", function(done) {
    rdotjson(xml, {comment: 'pre'}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(jsonFormat(R), jsonString);

      assert.equal(R.bool.screen_small.comment + "", "before bool");
      assert.equal(R.bool.adjust_view_bounds.comment + "", "between bool");
      assert.equal(R.color.colorPrimary.comment + "", "after bool,before color");
      assert.equal(R.dimen.activity_horizontal_margin.comment + "", "after color,before dimen");
      assert.equal(R.integer.max_speed.comment + "", "after dimen,before integer");
      assert.equal(R.string.app_name.comment + "", "after integer,before string");
      assert.equal(R.string.action_settings.comment + "", "between string");
      assert.equal(R.array.bits.comment + "", "after string,before array");
      assert.equal(R.array.planets_array.comment + "", "between array,after array");

      var C = getCSVRow(R, 3);
      assert.equal(C.bool.screen_small, 'bool,screen_small,true,before bool');
      assert.equal(C.bool.adjust_view_bounds, 'bool,adjust_view_bounds,false,between bool');

      done();
    });
  });

  it("{comment: 'right'}", function(done) {
    rdotjson(xml, {comment: 'right'}, function(err, R) {
      assert.ok(!err, err);
      checkAll(R);

      assert.equal(jsonFormat(R), jsonString);

      assert.equal(R.bool.screen_small.comment, "between bool");
      assert.equal(R.bool.adjust_view_bounds.comment, null);

      assert.equal(R.string.app_name.comment, "between string");
      assert.equal(R.string.action_settings.comment, null);

      assert.equal(R.array.bits.comment, "between array");
      assert.equal(R.array.planets_array.comment, null);

      var C = getCSVRow(R, 3);
      assert.equal(C.bool.screen_small, 'bool,screen_small,true,between bool');
      assert.equal(C.bool.adjust_view_bounds, 'bool,adjust_view_bounds,false');

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

  assert.equal(R.bool.screen_small, true);
  assert.equal(R.bool.adjust_view_bounds, false);
  assert.equal(R.color.colorPrimary + "", "#3F51B5");
  assert.equal(R.dimen.activity_horizontal_margin, "16dp");
  assert.equal(R.integer.max_speed, 75);
  assert.equal(R.string.app_name, "MyApp");
}

function getCSVRow(C) {
  var format = rdotjson.format("csv");
  var csv = format(C);
  return csv.split(/[\r\n]+/).reduce(reduce, {});

  function reduce(R, row) {
    var col = row.split(",");
    var type = col[0];
    var group = R[type] || (R[type] = {});
    group[col[1]] = row;
    return R;
  }
}

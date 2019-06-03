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

  it("{objectMode: false}", function(done) {
    // this uses primitive wrapper object tricks such as String()
    var options = {objectMode: false, attr: true, comment: "right"};

    rdotjson(xml, options, function(err, R) {
      assert.ok(!err, err);

      checkAsString(R);
      // checkValueProp(R); // this doesn't work with {objectMode: false}
      checkAttrProp(R);
      checkCommentProp(R);

      var J = roundtripJSON(R, options);
      checkAsString(J);
      // checkValueProp(J);
      // checkAttrProp(J);
      // checkCommentProp(J);

      var C = roundtripCSV(R, options);
      checkAsString(C);

      done();
    });
  });

  it("{objectMode: true}", function(done) {

    // this uses plain object wrapper such as {value: value}
    var options = {objectMode: true, attr: true, comment: "right"};

    rdotjson(xml, options, function(err, R) {
      assert.ok(!err, err);

      // checkAsString(R); // this doesn't work with {objectMode: true}
      checkValueProp(R);
      checkAttrProp(R);
      checkCommentProp(R);

      var J = roundtripJSON(R, options);
      // checkAsString(J);
      checkValueProp(J);
      checkAttrProp(J);
      checkCommentProp(J);

      var C = roundtripCSV(R, options);
      checkAsString(C);

      done();
    });
  });
});

function checkAsString(R) {
  assert.equal(R.bool.screen_small + "", "true");
  assert.equal(R.bool.adjust_view_bounds + "", "false");
  assert.equal(R.color.colorPrimary + "", "#3F51B5");
  assert.equal(R.dimen.activity_horizontal_margin + "", "16dp");
  assert.equal(R.integer.max_speed + "", "75");
  assert.equal(R.string.app_name + "", "MyApp");
  assert.equal(R.string.action_settings + "", "Settings");
  assert.equal(R.array.bits[0] + "", 4);
  assert.equal(R.array.planets_array[0] + "", "Mercury");
}

function checkValueProp(R) {
  assert.equal(R.bool.screen_small.value, true);
  assert.equal(R.bool.adjust_view_bounds.value, false);
  assert.equal(R.color.colorPrimary.value, "#3F51B5");
  assert.equal(R.dimen.activity_horizontal_margin.value, "16dp");
  assert.equal(R.integer.max_speed.value, 75);
  assert.equal(R.string.app_name.value, "MyApp");
  assert.equal(R.string.action_settings.value, "Settings");
  assert.equal(R.array.bits[0].value, 4);
  assert.equal(R.array.planets_array[0].value, "Mercury");
}

function checkCommentProp(R) {
  assert.equal(R.bool.screen_small.comment, "between bool");
  assert.equal(R.bool.adjust_view_bounds.comment, null);
  assert.equal(R.string.app_name.comment, "between string");
  assert.equal(R.string.action_settings.comment, null);
}

function checkAttrProp(R) {
  assert.equal(R.color.colorPrimary.attr.name, "colorPrimary");
  assert.equal(R.dimen.activity_horizontal_margin.attr.name, "activity_horizontal_margin");
  assert.equal(R.integer.max_speed.attr.name, "max_speed");
}

function roundtripJSON(R, options) {
  var format = rdotjson.format("json");
  var json = format(R, options);
  return JSON.parse(json);
}

function roundtripCSV(R, options) {
  var format = rdotjson.format("csv");
  var csv = format(R, options);
  return parseCSV(csv);
}

/**
 * pseudo CSV parser does not support "" quoted column
 */

function parseCSV(csv) {
  return csv.split(/[\r\n]+/).reduce(reduce, {});

  function reduce(R, row) {
    var col = row.split(",");
    var type = col[0];
    var name = col[1];
    var group = R[type] || (R[type] = {});
    if (type === "array") {
      var array = group[name] || (group[name] = []);
      array.push(col[2]);
    } else {
      group[name] = col[2];
    }
    return R;
  }
}

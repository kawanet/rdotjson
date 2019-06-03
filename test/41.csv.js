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

  it("rdotjson.format('csv')", function(done) {
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      checkAsString(R);

      var format = rdotjson.format('csv');
      assert.ok(format);

      var csv = format(R);
      assert.ok(csv);

      var RR = parseCSV(csv);
      checkAsString(RR);

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

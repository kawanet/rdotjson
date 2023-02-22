#!/usr/bin/env mocha -R spec

const assert = require("assert");
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  let xml;

  it("values.xml", function(done) {
    xml = fs.readFileSync(__dirname + "/values/values.xml");
    assert.ok(xml);
    done();
  });

  it("rdotjson.format('json')", function(done) {
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      checkAsString(R);

      const format = rdotjson.format('json');
      assert.ok(format);

      const json = format(R);
      assert.ok(json);

      const RR = JSON.parse(json);
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

const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  it("integer.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const xml = fs.readFileSync(__dirname + "/values/integer.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.integer);
      assert.equal(typeof R.integer.max_speed, "number");
      assert.equal(R.integer.max_speed, 75);
      assert.equal(R.integer.min_speed, 5);

      done();
    });
  }));

  it("integers.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const xml = fs.readFileSync(__dirname + "/values/integers.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.array);

      const array = R.array.bits;
      assert.ok(array instanceof Array);
      assert.equal(typeof array[0], "number");
      assert.equal(array[0], 4);
      assert.equal(array[3], 32);

      done();
    });
  }));
});

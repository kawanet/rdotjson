const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  const xml = '<resources><string>no name</string><string name="ok">value</string></resources>';

  it("element without name attribute", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);
      assert.equal(R.string.ok, "value");
      assert.ok(!("undefined" in R.string));
      assert.equal(Object.keys(R.string).length, 1);
      done();
    });
  }));

  it("element without name attribute with exclude option", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    rdotjson(xml, {exclude: "x*"}, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);
      assert.equal(R.string.ok, "value");
      assert.equal(Object.keys(R.string).length, 1);
      done();
    });
  }));
});

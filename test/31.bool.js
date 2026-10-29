const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  it("bools.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const xml = fs.readFileSync(__dirname + "/values/bools.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.bool);
      assert.equal(typeof R.bool.screen_small, "boolean");
      assert.equal(R.bool.screen_small, true);
      assert.equal(typeof R.bool.adjust_view_bounds, "boolean");
      assert.equal(R.bool.adjust_view_bounds, false);

      done();
    });
  }));
});

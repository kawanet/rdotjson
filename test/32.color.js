const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  it("color.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const xml = fs.readFileSync(__dirname + "/values/color.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.color);
      assert.equal(R.color.opaque_red + "", "#f00");
      assert.equal(R.color.invisible_red + "", "#0f00");
      assert.equal(R.color.translucent_red + "", "#80ff0000");

      done();
    });
  }));
});

const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  it("string-escape.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const xml = fs.readFileSync(__dirname + "/values/string-escape.xml");
    assert.ok(xml);
    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);
      assert.equal(R.string.good_example_1, "This'll work");
      assert.equal(R.string.good_example_2, "This'll also work");
      assert.equal(R.string.good_example_3, 'This is a "good string".');
      assert.equal(R.string.bad_example_1, "This is a bad string.");
      assert.equal(R.string.tab, "foo\tbar");
      assert.equal(R.string.unicode, "Star \u2605");
      assert.equal(R.string.escaped_backslash, "C:\\u2605");

      done();
    });
  }));
});

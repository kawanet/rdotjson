/* jshint esversion:8 */

const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const fs = require("fs");
const {Readable} = require("stream");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, () => {
  it("colors.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const colors = fs.createReadStream(__dirname + "/values/colors.xml");
    rdotjson(colors, (err, R) => {
      assert.ok(!err);
      assert.equal(R.color.colorPrimary, "#3F51B5");
      assert.equal(R.color.colorPrimaryDark, "#303F9F");
      assert.equal(R.color.colorAccent, "#FF4081");
      done();
    });
  }));

  it("stream error", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    const stream = new Readable({
      read() {
        // https://nodejs.org/api/stream.html#errors-while-reading
        this.destroy(new Error("Something wrong"));
      }
    });
    rdotjson(stream, (err) => {
      assert.ok(err);
      done();
    });
  }));
});

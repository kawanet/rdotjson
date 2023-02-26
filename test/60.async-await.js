#!/usr/bin/env mocha -R spec

/* jshint mocha:true */
/* jshint esversion:8 */

const assert = require("assert").strict;
const fs = require("fs");
const {readFile} = fs.promises;
const {Readable} = require("stream");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  it("colors.xml", async () => {
    const colors = await readFile(__dirname + "/values/colors.xml");
    const R = await rdotjson(colors);
    assert.equal(R.color.colorPrimary, "#3F51B5");
    assert.equal(R.color.colorPrimaryDark, "#303F9F");
    assert.equal(R.color.colorAccent, "#FF4081");
  });

  it("dimens.xml", async () => {
    const dimens = await readFile(__dirname + "/values/dimens.xml");
    const R = await rdotjson(dimens);
    assert.equal(R.dimen.activity_horizontal_margin, "16dp");
    assert.equal(R.dimen.activity_vertical_margin, "16dp");
    assert.equal(R.dimen.fab_margin, "16dp");
  });

  it("strings.xml", async () => {
    const stream = fs.createReadStream(__dirname + "/values/strings.xml");
    const R = await rdotjson(stream);
    assert.equal(R.string.app_name, "MyApp");
    assert.equal(R.string.action_settings, "Settings");
  });

  it("stream error", async () => {
    const stream = new Readable({
      read() {
        // https://nodejs.org/api/stream.html#errors-while-reading
        this.destroy(new Error("Something wrong"));
      }
    });
    let err;
    await rdotjson(stream).catch(e => (err = e));
    assert.ok(err);
  });
});

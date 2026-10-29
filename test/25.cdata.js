const {describe, it} = require("node:test");
const assert = require("node:assert").strict;
const fs = require("fs");
const rdotjson = require("../rdotjson");
const TITLE = __filename.replace(/^.*\//, "") + ":";

describe(TITLE, function() {
  let xml;

  it("string-cdata.xml", {timeout: 1000}, () => new Promise((resolve, reject) => {
    const done = (err) => (err ? reject(err) : resolve());
    xml = fs.readFileSync(__dirname + "/values/string-cdata.xml");
    assert.ok(xml);

    rdotjson(xml, function(err, R) {
      assert.ok(!err, err);

      // FIXME: continuous spaces are not trimmed in CDATA section.
      assert.equal(esc(R.string.string_with_space_only), '');
      assert.equal(esc(R.string.cdata_with_space_only), '');
      assert.equal(esc(R.string.string_without_quote), 'FOO.BAR');
      assert.equal(esc(R.string.cdata_without_quote), 'FOO..BAR');
      assert.equal(esc(R.string.string_with_quote), 'FOO..BAR');
      assert.equal(esc(R.string.cdata_with_quote), '"FOO..BAR"');
      assert.equal(esc(R.string.string_with_escaped_quote), '"FOO.BAR"');
      assert.equal(esc(R.string.cdata_with_escaped_quote), '"FOO..BAR"');
      assert.equal(esc(R.string.string_with_escaped_newline), '\nFOO.BAR\n');
      assert.equal(esc(R.string.cdata_with_escaped_newline), '\nFOO..BAR\n');
      assert.equal(esc(R.string.string_with_tag), '.FOO..BAR..BUZ.');
      assert.equal(esc(R.string.cdata_with_tag), 'FOO..<b>..BAR..</b>..BUZ');
      assert.equal(R.string.cdata_with_escaped_tab_and_unicode, 'FOO\tBAR \u2605 C:\\u2605');
      assert.equal(esc(R.string.string_with_tag_in_quote), '.[...FOO.BAR..]..');
      assert.equal(esc(R.string.string_with_quote_in_tag), '..[..FOO..BAR..]..');

      done();
    });
  }));
});

/**
 * replace a white space with `.` dot
 */

function esc(str) {
  return (str + "").replace(/ /g, ".");
}

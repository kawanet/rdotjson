#!/usr/bin/env mocha -R spec

var assert = require("assert");
var fs = require("fs");
var rdotjson = require("../rdotjson");
var TITLE = __filename.replace(/^.*\//, "") + ":";

/* jshint mocha:true */

describe(TITLE, function() {
  var xml;

  /**
   * @see https://github.com/kawanet/rdotjson/issues/2
   */

  it("string-xml.xml", function() {
    xml = fs.readFileSync(__dirname + "/values/string-xml.xml");
    assert.ok(xml);
  });

  it("{xml: false}", function(done) {
    rdotjson(xml, {xml: false}, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);

      // note: \\n is unescaped
      assert.equal(R.string.activation_warning, ' Some text: Text.\n\nSome more text.');

      assert.equal(R.string.cancel, ' Cancel ');

      assert.equal(R.string.default_latitude, '40.7831');

      assert.equal(R.string.default_longitude, '-73.9712');

      assert.equal(R.string.detail_developer_mode_on, 'Text. Some more text.');

      assert.equal(R.string.permission_justification_required_warning, ' You have declined a required permission. Exiting. ');
      done();
    });
  });

  it("{xml: true}", function(done) {
    rdotjson(xml, {xml: true}, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);

      // note: \\n is not unescaped
      assert.equal(R.string.activation_warning, '\n        <b>Some text:</b> Text.\\n\\nSome more text.');

      assert.equal(R.string.cancel, '\n        <u>Cancel</u>\n    ');

      assert.equal(R.string.default_latitude, '40.7831');

      assert.equal(R.string.default_longitude, '-73.9712');

      assert.equal(R.string.detail_developer_mode_on, '<![CDATA[Text. Some more text.]]>');

      assert.equal(R.string.permission_justification_required_warning, '\n        <font color="#ff4343">You have declined a required permission. Exiting.</font>\n    ');
      done();
    });
  });

  it("{attr: true}", function(done) {
    rdotjson(xml, {attr: true}, function(err, R) {
      assert.ok(!err, err);
      assert.ok(R);
      assert.ok(R.string);

      assert.equal(R.string.default_latitude, '40.7831');
      assert.equal(R.string.default_longitude.attr.translatable, 'false');
      assert.equal(R.string.default_latitude, '40.7831');
      assert.equal(R.string.default_longitude.attr.translatable, 'false');

      done();
    });
  });
});

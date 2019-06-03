# rdotjson

[![Build Status](https://travis-ci.org/kawanet/rdotjson.svg?branch=master)](https://travis-ci.org/kawanet/rdotjson) [![npm version](https://badge.fury.io/js/rdotjson.svg)](https://badge.fury.io/js/rdotjson)

Android String Resource XML Parser

## SYNOPSIS

```js
const fs = require("fs");
const rdotjson = require("rdotjson");

const xml = fs.readFileSync("strings.xml");

rdotjson(xml, function(err, R) {
  if (err) throw err;
  console.log(R.string.app_name); // => "MyApp"
});
```

### XML

```xml
<resources>
    <string name="app_name">MyApp</string>
    <string name="action_settings">Settings</string>
</resources>
```

### JSON

```json
{
  "string": {
    "app_name": "MyApp",
    "action_settings": "Settings"
  }
}
```

## SUPPORTED TYPES

- `R.array` - Array: `<string-array name="key"><item>string</item></string-array>`
- `R.bool` - Boolean: `<bool name="key">true</bool>`
- `R.color` - String: `<color name="key">#3F51B5</color>`
- `R.dimen` - String: `<dimen name="key">16dp</dimen>`
- `R.integer` - Number: `<integer name="key">75</integer>`
- `R.string` - String: `<string name="key">string</string>`

## JAVASCRIPT API

```js
rdotjson(xml, options, callback);
```

- `xml` {String|Buffer|Stream} - required.
- `options` {Object} - optional.
- `callback` {Function} - `function(err, R) {...}`

### Option Parameters

- `{attr: true}` - add `attr` property which includes XML attributes.
- `{comment: 'post'}` - include postpositive XML comments located after elements.
- `{comment: 'pre'}` - include prepositive XML comments located before elements.
- `{comment: 'right'}` - include right-side XML comment within the same line.
- `{exclude: '*_android'}` - specify key names to exclude. Wildcard available.
- `{objectMode: true}` - use plain object container: `{value: value}` instead of primitives.
- `{xml: true}` - preserve raw XML strings, instead of plain text parsed.

### Object Mode

```js
rdotjson(xml, {objectMode: true}, function(err, R) {
  if (err) throw err;
  console.log(R.string.app_name.value); // => "MyApp"
  console.log(JSON.stringify(R, null, 2));
});
```

```json
{
  "string": {
    "app_name": {
      "value": "MyApp"
    },
    "action_settings": {
      "value": "Settings"
    }
  }
}
```

## FORMATTERS

Emebed formatters `json` and `csv` available. 

### JSON Formatter

```js
rdotjson(xml, function(err, R) {
  if (err) throw err;
  const format = rdotjson.format("json");
  const json = format(R, {space: 0});
  console.log(json);
  // => {"string":{"app_name":"MyApp","action_settings":"Settings"}}
});
```

### CSV Formatter

```js
rdotjson(xml, function(err, R) {
  if (err) throw err;
  const format = rdotjson.format("csv");
  const csv = format(R);
  console.log(csv);
  // => string,action_settings,Settings
  //    string,app_name,MyApp
});
```

## CLI

```sh
rdotjson app/src/main/res/values/strings.xml > strings.json

rdotjson app/src/main/res/values/*.xml > r.json

rdotjson app/src/production/res/values/*.xml > r_production.json

rdotjson app/src/develop/res/values/*.xml > r_develop.json

rdotjson app/src/main/res/values/strings.xml --format=csv > strings.csv
```

### CLI Options

- `--comment=post` - include postpositive XML comments located after elements
- `--comment=pre` - include prepositive XML comments located before elements
- `--comment=right` - include right-side XML comment within the same line
- `--exclude='*_android'` - specify key names to exclude. Wildcard available.
- `--format=json` - specify output format. default: `json`
- `--objectMode` - use a plain object container `{value: value}` instead of primitives 
- `--output=R.json` - output filename. default: `STDOUT`
- `--space=2` - JSON indent. default: 2
- `--version` - show rdotjson version.
- `--xml` - preserve raw XML strings, instead of plain text parsed
- `-` - input XML from `STDIN`

### CLI Formatters

- `--format=csv --output=R.csv` - CSV
- `--format=json --output=R.json` - JSON
- `--format=rdotswift --output=R.swift` - Swift ([rdotswift](https://github.com/kawanet/rdotswift) module required)

## SEE ALSO

- [https://github.com/kawanet/rdotjson](https://github.com/kawanet/rdotjson)
- [https://www.npmjs.com/package/rdotswift](https://www.npmjs.com/package/rdotswift)
- [https://qiita.com/kawanet/items/f48ef1f2e264982912f4](https://qiita.com/kawanet/items/f48ef1f2e264982912f4)
- [https://developer.android.com/guide/topics/resources/string-resource](https://developer.android.com/guide/topics/resources/string-resource)

## LICENSE

The MIT License (MIT)

Copyright (c) 2016-2019 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

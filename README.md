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
  console.log(R.string.app_name);
});
```

## SUPPORTED TYPES

- `R.bool` - Boolean
- `R.color` - String e.g. "#FFFFFF"
- `R.dimen` - String e.g. "16dp"
- `R.integer` - Integer
- `R.array` - Array
- `R.string` - String

## JAVASCRIPT API

```js
rdotjson(xml, options, callback);
```

- `xml` {String|Buffer|Stream}
- `options` {Object}
- `callback` {Function} `function(err, R) {...}`

### JSON Formatter

```js
const format = rdotjson.format("json");
const json = format(R, {space: 0}); // => {"string":{"app_name":"MyApp", ... }}
```

### CSV Formatter

```js
const format = rdotjson.format("csv");
const csv = format(R); // => "string,app_name,MyApp" ...
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

`--exclude='*_android'` - Key name to exclude. Wildcard available.

`--format=json` - Output format. default: json

`--output=R.json` - Output filename. default: STDOUT

`--space=2` - JSON indent. default: 2

`-` - Input XML from STDIN

### CLI Formatters

`--format=json --output=R.json` - JSON

`--format=csv --output=R.csv` - CSV

`--format=rdotswift --output=R.swift` - SWIFT ([rdotswift](https://github.com/kawanet/rdotswift) module required)

## INSTALL

```sh
npm install -g rdotjson
```

## REPOSITORY

- [https://github.com/kawanet/rdotjson](https://github.com/kawanet/rdotjson)

## SEE ALSO

- [https://www.npmjs.com/package/rdotswift](https://www.npmjs.com/package/rdotswift)
- [https://qiita.com/kawanet/items/f48ef1f2e264982912f4](https://qiita.com/kawanet/items/f48ef1f2e264982912f4)

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

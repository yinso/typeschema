"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript-parser");
var fs = require("fs-extra-promise");
var util = require("util");
var parser = new ts.TypescriptParser();
// either:
fs.readFileAsync('ts.ts', 'utf8')
    .then(function (data) {
    return parser.parseSource(data);
})
    .then(function (parsed) {
    console.info(util.inspect(parsed, { colors: true, depth: 100000 }));
});
//# sourceMappingURL=ts.js.map
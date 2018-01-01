import * as Promise from 'bluebird';
import * as ts from 'typescript-parser';
import * as fs from 'fs-extra-promise';
import * as util from 'util';

const parser = new ts.TypescriptParser();
 
// either:
fs.readFileAsync('ts.ts', 'utf8')
    .then((data) => {
        return parser.parseSource(data)
    })
    .then((parsed) => {
        console.info(util.inspect(parsed, { colors: true, depth: 100000 }));
    })
 

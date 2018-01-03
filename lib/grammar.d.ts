import * as T from './old-ast';

export function parse(data : string) : any[];

export class SyntaxError extends Error {
  expected: any;
  found: any;
  location: any;
}

import * as T from './ast';

export function parse(data : string) : T.TypeMap;

export class SyntaxError extends Error {
  expected: any;
  found: any;
  location: any;
}

import { suite, test, slow, timeout } from "mocha-typescript";
import * as assert from 'assert';
import * as S from './schema';

export function noErrors(result : S.ValidationResult) {
  assert.equal(result.errors.length, 0);
}

export function hasErrors(result : S.ValidationResult) {
  assert.notEqual(result.errors.length, 0);
}

export { throws , deepEqual , doesNotThrow as noThrows , ok } from 'assert';


export { suite, test, slow, timeout } from "mocha-typescript";

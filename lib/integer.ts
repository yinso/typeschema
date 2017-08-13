import { ValueObject } from './value-object';
import * as S from './schema';
import * as N from './number';

export class IntegerSchema extends S.CompoundSchema {
  constructor(options : N.NumberSchemOptions = {}) {
    let constraints : S.IJsonSchema[] = [];
    if (options.multipleOf)
      constraints.push(options.multipleOf);
    if (options.minimum)
      constraints.push(options.minimum);
    if (options.maximum)
      constraints.push(options.maximum);
    if (options.enum)
      constraints.push(options.enum);
    super([ <S.IJsonSchema>(new S.TypeSchema('integer')) ].concat(constraints));
  }
}

let s = new IntegerSchema();

export class Integer extends ValueObject<number> {
  _validate(value : number) {
    let result = S.validate(s, value);
    if (result.errors.length > 0) {
      throw new TypeError(`NotInteger: ${value}`)
    }
  }
}

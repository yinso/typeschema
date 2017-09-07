import { ValueObject } from './value-object';
import * as S from './schema';
import * as N from './number';

export class IntegerSchema extends S.TypeSchema {
  readonly multipleOf ?: N.MultipleOfConstraint;
  readonly minimum ?: N.MinimumConstraint;
  readonly maximum ?: N.MaximumConstraint;
  readonly enum ?: S.EnumConstraint<number>;
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
    let type = new S.TypeConstraint('integer');
    super('integer', constraints)
    if (options.enum) this.enum = options.enum;
    if (options.maximum) this.maximum = options.maximum;
    if (options.minimum) this.minimum = options.minimum;
    if (options.multipleOf) this.multipleOf = options.multipleOf;
  }

  jsonify(value : any) : any {
    if (S.TypeMap.integer.isa(value)) {
      return value;
    } else if (value instanceof Integer) {
      return value.valueOf();
    } else {
      throw new Error("Not an integer");
    }
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

S.registerSchema(Integer, s);

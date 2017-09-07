import * as S from './schema';

S.TypeMap['number'] = {
  isa: (value : any) => typeof(value) === 'number',
  make: (v : any) => v
};

export type NumberSchemOptions = {
  multipleOf ?: MultipleOfConstraint;
  minimum ?: MinimumConstraint;
  maximum ?: MaximumConstraint;
  enum ?: S.EnumConstraint<number>;
} & S.SchemaCtorOptions;

export class NumberSchema extends S.TypeSchema {
  constructor(options : NumberSchemOptions = {}) {
    let constraints : S.IJsonSchema[] = [];
    if (options.multipleOf)
      constraints.push(options.multipleOf);
    if (options.minimum)
      constraints.push(options.minimum);
    if (options.maximum)
      constraints.push(options.maximum);
    if (options.enum)
      constraints.push(options.enum);
    super('number', constraints);
  }

  jsonify(value : any) {
    if (S.TypeMap.number.isa(value)) {
      return value;
    } else if (value instanceof Number) {
      return value.valueOf();
    } else {
      throw new Error(`Not a number`);
    }
  }
}

S.registerSchema(Number, new NumberSchema());

export class MultipleOfConstraint implements S.IJsonSchema {
  readonly multipleOf: number;
  constructor(multipleOf: number) {
    this.multipleOf = multipleOf;
  }

  isa(value : any) : boolean {
    return S.TypeMap['number'].isa(value) && (value % this.multipleOf) === 0;
  }

  validate(value : any, path : string, errors : S.ValidationError[]) {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: `Not a multiple of ${this.multipleOf}`
      })
    }
  }

  errorMessage(value : any) : string {
    return `Not a multiple of ${value}`;
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() {
    return {
      multipleOf: this.multipleOf
    }
  }

  jsonify(value : any) {
    return value;
  }
}

export class MinimumConstraint implements S.IJsonSchema {
  readonly minimum : number;
  readonly exclusive : boolean;
  constructor(minimum : number, exclusive : boolean) {
    this.minimum = minimum;
    this.exclusive = exclusive;
  }

  isa(value : any) : boolean {
    return S.TypeMap['number'].isa(value) && this.exclusive ? value > this.minimum : value >= this.minimum;
  }

  validate(value : any, path : string, errors : S.ValidationError[]) {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: this.errorMessage(value)
      })
    }
  }

  errorMessage(value : any) : string {
    return `Less than ${this.exclusive ? 'or equal to' : ''} ${this.minimum}`
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() : any {
    return {
      minimum: this.minimum,
      exclusiveMinimum: this.exclusive
    };
  }

  jsonify(value : any) {
    return value;
  }
}

export class MaximumConstraint implements S.IJsonSchema {
  readonly maximum : number;
  readonly exclusive : boolean;
  constructor(maximum : number, exclusive : boolean) {
    this.maximum = maximum;
    this.exclusive = exclusive;
  }

  isa(value : any) : boolean {
    return S.TypeMap['number'].isa(value) && this.exclusive ? value < this.maximum : value <= this.maximum;
  }

  errorMessage(value : any) : string {
    return `Greater than ${this.exclusive ? 'or equal to' : ''} ${this.maximum}`
  }

  validate(value : any, path : string, errors : S.ValidationError[]) {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: this.errorMessage(value)
      })
    }
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() : any {
    return {
      maximum: this.maximum,
      exclusiveMaximum: this.exclusive
    };
  }

  jsonify(value : any) {
    return value;
  }
}

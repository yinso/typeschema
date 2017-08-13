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
}

export class NumberSchema extends S.CompoundSchema {
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
    super([<S.IJsonSchema>new S.TypeSchema('number')].concat(constraints));
  }
}

export class MultipleOfConstraint extends S.TypeConstraint<number> {
  readonly multipleOf: number;
  constructor(multipleOf: number) {
    super()
    this.multipleOf = multipleOf;
  }

  satisfy(value : number) : boolean {
    return (value % this.multipleOf) === 0;
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
}

export class MinimumConstraint extends S.TypeConstraint<number> {
  readonly minimum : number;
  readonly exclusive : boolean;
  constructor(minimum : number, exclusive : boolean) {
    super()
    this.minimum = minimum;
    this.exclusive = exclusive;
  }

  satisfy(num : number) : boolean {
    return this.exclusive ? num > this.minimum : num >= this.minimum;
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
}

export class MaximumConstraint extends S.TypeConstraint<number> {
  readonly maximum : number;
  readonly exclusive : boolean;
  constructor(maximum : number, exclusive : boolean) {
    super()
    this.maximum = maximum;
    this.exclusive = exclusive;
  }

  satisfy(num : number) : boolean {
    return this.exclusive ? num < this.maximum : num <= this.maximum;
  }

  errorMessage(value : any) : string {
    return `Greater than ${this.exclusive ? 'or equal to' : ''} ${this.maximum}`
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
}

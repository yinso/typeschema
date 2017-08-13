import * as util from './util';
import valiDate = require('vali-date');

export interface ValidationResult {
  errors: ValidationError[];
}

export interface ValidationError {
  message : string;
  path : string;
  schema : IJsonSchema;
  value : any;
}

export class ValidationException extends Error {
  readonly errors : ValidationError[];
  constructor(errors : ValidationError[] = []) {
    super();
    this.errors = errors;
  }
}

export type Validator = {
  isa(value : any) : boolean;
  make(value : any) : any;
}

export interface IJsonSchema {
  isa(value : any) : boolean;
  validate(value : any, path : string, errors : ValidationError[]) : void;
  //errorMessage(value : any) : string;
  toJSON() : any;
  fromJSON(value : any) : any;
}

export type SchemaType = 'number' | 'integer' | 'boolean' | 'string' | 'null' | 'array' | 'object';

export const TypeMap : {[key: string]: Validator } = { 
  number: {
    isa: (value : any) => typeof(value) === 'number',
    make: (value : any) => value
  },
  integer: {
    isa: (value : any) => TypeMap.number.isa(value) && ((value % 1) === 0),
    make: (value : any) => value
  },
  boolean: {
    isa: (value : any) => typeof(value) === 'boolean',
    make: (value : any) => value
  },
  string: {
    isa: (value : any) => typeof(value) === 'string',
    make: (value : any) => value
  },
  null: {
    isa: (value : any) => value === null,
    make: (value : any) => value
  },
  array: {
    isa: (value : any) => value instanceof Array,
    make: (value : any) => value
  },
  object: {
    isa: (value : any) => value instanceof Object,
    make: (value : any) => value
  }
};

export type SchemaCtorOptions = {
  $make ?: (value : any) => any
};

export class TypeSchema implements IJsonSchema {
  readonly type: SchemaType;
  readonly maker : (data : any) => any;
  constructor(type : SchemaType, maker : (data : any) => any = (data : any) => data) {
    this.type = type;
    this.maker = maker;
  }

  isa(value : any) : boolean {
    return TypeMap[this.type].isa(value);
  }

  validate(value : any, path : string, errors: ValidationError[]) : void {
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
    return `Not ${this.type}: ${value}`
  }

  fromJSON(data : any) : any {
    if (this.isa(data)) {
      return this.maker(data);
    } else {
      throw new ValidationException([{
        path: '$',
        value: data,
        schema: this,
        message: `Invalid Value`
      }]);
    }
  }

  toJSON() : any {
    return {
      type: this.type
    }
  }
}

export class CompoundSchema implements IJsonSchema {
  readonly constraints : IJsonSchema[];
  constructor(constraints : IJsonSchema[]) {
    this.constraints = constraints;
  }

  isa(value : any) : boolean {
    for (var i = 0; i < this.constraints.length; ++i) {
      if (!this.constraints[i].isa(value)) {
        return false;
      }
    }
    return true;
  }

  validate(value : any, path : string, errors : ValidationError[]) : void {
    for (var i = 0; i < this.constraints.length; ++i) {
      this.constraints[i].validate(value, path, errors);
    }
  }

  fromJSON(data : any) : any {
    let result : any = data;
    for (var i = 0; i < this.constraints.length; ++i) {
      result = this.constraints[i].fromJSON(result)
    }
    return result;
  }

  toJSON() : any {
    let result = util.extend(...this.constraints.map((s) => s.toJSON()));
    return result;
  }
}

export class EnumConstraint<T> implements IJsonSchema {
  readonly values : T[];
  constructor(values: T[]) {
    this.values = values;
  }
  isa(value : any) : boolean {
    for (var i = 0; i < this.values.length; ++i) {
      if (util.deepEqual(this.values[i], value))
        return true;
    }
    return false;
  }
  validate(value : any, path : string, errors : ValidationError[]) : void {
    if (!this.isa(value)) {
      errors.push({
        path : path,
        message: this.errorMessage(value),
        schema: this,
        value: value
      });
    }
  }

  fromJSON(data : any) : any {
    return data;
  }

  errorMessage(value : any) : string {
    return `Not one of the enumerated values`
  }

  toJSON() : any {
    return {
      enum: this.values
    }
  }
}

export abstract class TypeConstraint<T> implements IJsonSchema {
  isa(value : any) : boolean {
    return this.satisfy(<T>value);
  }
  abstract satisfy(value : T) : boolean;
  validate(value : any, path : string, errors : ValidationError[]) : void {
    if (!this.isa(value)) {
      errors.push({
        path : path,
        message: this.errorMessage(value),
        schema: this,
        value: value
      });
    }
  }

  fromJSON(data : any) : any {
    return data;
  }

  abstract errorMessage(value : any) : string;
  abstract toJSON() : any;
}

// this is the function that'll be recursively called...
export function validate(s : IJsonSchema, value : any) : ValidationException {
  let err = new ValidationException();
  s.validate(value, '', err.errors);
  return err;
}



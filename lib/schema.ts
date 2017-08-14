import * as util from './util';
import valiDate = require('vali-date');
import * as u from 'util';

export class ValidationResult {
  errors: ValidationError[];
  constructor(errors: ValidationError[] = []) {
    this.errors = errors;
  }
  hasErrors() : boolean {
    return this.errors.length > 0;
  }
  raise () {
    throw new ValidationException(this.errors);
  }
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
  hasErrors() : boolean {
    return this.errors.length > 0;
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

export function isFunction(v : any) : v is Function {
  return typeof(v) === 'function' || (v instanceof Function);
}

export function isJsonSchema(obj : any) : obj is IJsonSchema {
  return (obj instanceof Object) && isFunction(obj.isa) && isFunction(obj.validate) && isFunction(obj.fromJSON);
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

export class TypeConstraint implements IJsonSchema {
  readonly type: SchemaType;
  constructor(type : SchemaType) {
    this.type = type;
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
      return data;
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

export class TypeSchema implements IJsonSchema {
  readonly type : TypeConstraint;
  protected readonly _maker : (v : any) => any;
  private readonly _constraints : IJsonSchema[];
  constructor(type : SchemaType, constraints : IJsonSchema[], maker ?: (v : any) => any) {
    this.type = new TypeConstraint(type);
    this._constraints = [<IJsonSchema>this.type].concat(constraints);
    this._maker = maker ? maker : (v : any) => v;
    if (type === 'string')
      console.info(u.inspect(this, { depth : 1000, colors : true }), u.inspect(maker, { colors: true }))
  }

  isa(value : any) : boolean {
    for (var i = 0; i < this._constraints.length; ++i) {
      if (!this._constraints[i].isa(value)) {
        return false;
      }
    }
    return true;
  }

  validate(value : any, path : string, errors : ValidationError[]) : void {
    for (var i = 0; i < this._constraints.length; ++i) {
      this._constraints[i].validate(value, path, errors);
    }
  }

  fromJSON(data : any) : any {
    let exc = validate(this, data);
    if (exc.hasErrors())
      exc.raise();
    return this._maker(data);
  }

  toJSON() : any {
    let result = util.extend(...this._constraints.map((s) => s.toJSON()));
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

// this is the function that'll be recursively called...
export function validate(s : IJsonSchema, value : any) : ValidationResult {
  let err = new ValidationResult();
  s.validate(value, '', err.errors);
  return err;
}



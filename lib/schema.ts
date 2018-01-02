import * as util from './util';
import valiDate = require('vali-date');
import * as u from 'util';
require('es6-shim');

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
  push(err : ValidationError) {
    this.errors.push(err);
  }
}

export interface ValidationError {
  error: string;
  path : string;
  value : any;
  schema ?: IJsonSchema;
  message ?: string;
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
  jsonify(value : any) : any;
}

// T & { toJSON() => any; } 
// this is the decorator function.
export interface Jsonable {
  toJSON() : any;
}

export function isJsonable(v : any) : v is Jsonable {
  return v && isFunction(v.toJSON);
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
    make: (value : any) => {
      console.info('string.make', value);
      return value;
    }
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
  $make ?: (value : any) => any;
  $optional ?: boolean;
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
        error: 'ValidationError',
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
        error: 'ValidationError',
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

  jsonify(value : any) : any {
    return value;
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

  jsonify(value : any) : any {
    return value;
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
        error: 'ValidationError',
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

  jsonify(value : any) : any {
    return value;
  }
}

// this is the function that'll be recursively called...
export function validate(s : IJsonSchema, value : any) : ValidationResult {
  let err = new ValidationResult();
  s.validate(value, '', err.errors);
  return err;
}



const SCHEMA_FIELD = '__schema';

export type GenericConstructor = { new(...args : any[]): {} };

// there are a few things to do in order to construct the right schema tree.
// 1 - every Ctor will have a __schema field
// 2 - the first call will create it.
// 3 - there will be decorators that will be used to generate the __schema field and populate it with information.
// 4 - due to the complexity of the information, there needs to be a way to make sense of it all
// @Schema is a top level

const _builtInSchemas = new Map<any, IJsonSchema>();

export function registerSchema(ctor : any, schema : IJsonSchema) {
  _builtInSchemas.set(ctor, schema);
}

export function attachSchema<T extends GenericConstructor >(constructor : T, schema : IJsonSchema) : T {
  console.info('Schema.attachSchema', constructor, schema);
  if (!constructor.hasOwnProperty(SCHEMA_FIELD)) {
    Object.defineProperty(constructor, SCHEMA_FIELD, {
      value: schema,
      enumerable: true,
      configurable: false,
      writable: false
    });
  } else {
    throw new Error(`Schema Redefinition ${constructor}`);
  }
  return constructor;
}

export function hasAttachedSchema(ctor : any) : IJsonSchema | undefined {
  let prop = Object.getOwnPropertyDescriptor(ctor, SCHEMA_FIELD);
  if (prop) {
    return prop.value;
  } else {
    return undefined;
  }
}

export function hasSchema(ctor : any) : IJsonSchema | undefined {
  if (_builtInSchemas.has(ctor))
    return _builtInSchemas.get(ctor);
  else
    return hasAttachedSchema(ctor);
}

export function getAttachedSchema<T extends GenericConstructor >(constructor : T) : IJsonSchema {
  let prop = Object.getOwnPropertyDescriptor(constructor, SCHEMA_FIELD);
  if (prop) {
    return prop.value;
  } else {
    throw new Error("NoSchemaDefined");
  }
}

export function getSchema(ctor : any) : IJsonSchema {
  let res = _builtInSchemas.get(ctor);
  if (res)
    return res;
  else
    return getAttachedSchema(ctor);
}

export function fromJSON<T>(ctor : Function, data : any) : T {
  let schema = getSchema(ctor);
  let result = validate(schema, data);
  if (result.errors.length > 0) {
    throw new ValidationException(result.errors);
  } else {
    return <T>schema.fromJSON(data);
  }
}

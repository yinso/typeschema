import { Integer } from './integer';
import * as ajv from 'ajv';
import valiDate = require('vali-date');


type TypePrimitive = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object';

// we are not going to support type defined as an array - probably the easiest...
type TypePrimitiveAndList = TypePrimitive | TypePrimitive[];


// the idea is that we are going to have a SchemaBuilder class.
export interface SchemaOptions {
  type ?: TypePrimitiveAndList;
  name ?: string;
  optional ?: boolean;
  // string-based options.
  format ?: string;
  // array
  items ?: SchemaOptions;
  // object
  properties ?: {[key: string]: SchemaOptions};
  required ?: string[];
  // dynamic values.
  $ctor ?: Function;
}

function isNumber(v : any) : boolean {
  return typeof(v) === 'number' || (v instanceof Number);
}

function isInteger(v : any) : boolean {
  return isNumber(v) && ((v % 1) === 0);
}

function isString(v : any) : boolean {
  return typeof(v) === 'string' || (v instanceof String);
}

function isBoolean(v : any) : boolean {
  return typeof(v) === 'boolean' || (v instanceof String);
}

function isArray(v : any) : boolean {
  return v instanceof Array;
}

function isNull(v : any) : boolean {
  return v === null;
}

function isObject(v : any) : boolean {
  return v instanceof Object;
}

export type SchemaValidationError = {
  value: any;
  message: string;
  path: string;
  schema: any;
}

export abstract class JsonSchema {
  readonly type: string;

  abstract isa(val: any) : boolean;

  validate(val : any, path : string = '', errors : SchemaValidationError[] = []) : SchemaValidationError[] {
    this._validate(val, path, errors);
    return errors;
  }

  protected abstract _validate(val: any, path : string, errors : SchemaValidationError[]) : void;

  abstract toSchema() : any;
}


///****************************************************************************************** 
/// string schema
///****************************************************************************************** 

// this is an additional properties...
// can we specify 
export interface StringSchemaOptions {
  minLength ?: number;
  maxLength ? :number;
  pattern ?: string;
  format ?: string;
}



class StringJsonSchema extends JsonSchema {
  type = 'string'

  isa(val: any) : boolean {
    return typeof(val) === 'string' || (val instanceof String);
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not a string',
        schema: this
      });
    }
  }

  toSchema() {
    return {
      type: this.type
    }
  }
}

class DateJsonSchema extends StringJsonSchema {
  isa(val: any) : boolean {
    return super.isa(val) && valiDate(val);
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not a Date',
        schema: this
      });
    }
  }
  
  toSchema() {
    return {
      type: this.type,
      format: 'date-time'
    }
  }
}

class NumberSchema extends JsonSchema {
  type = 'number'
  isa(val: any) : boolean {
    return typeof(val) === 'number' || (val instanceof Number);
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not a number',
        schema: this
      });
    }
  }

  toSchema() {
    return {
      type: this.type
    }
  }
}

class IntegerSchema extends NumberSchema {
  type = 'integer'
  isa(val: any) : boolean {
    return super.isa(val) && ((val % 1) === 0);
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not an integer',
        schema: this
      });
    }
  }

  toSchema() {
    return {
      type: this.type
    }
  }
}

class BooleanSchema extends JsonSchema {
  type = 'boolean'
  isa(val: any) : boolean {
    return typeof(val) === 'boolean' || (val instanceof Boolean);
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not a boolean',
        schema: this
      });
    }
  }

  toSchema() {
    return {
      type: this.type
    }
  }
}

class NullSchema extends JsonSchema {
  type = 'null'
  isa(val: any) : boolean {
    return val === null;
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not null',
        schema: this
      });
    }
  }

  toSchema() {
    return {
      type: this.type
    }
  }
}

class ArraySchema extends JsonSchema {
  type = 'array'
  inner : JsonSchema;
  constructor(inner : JsonSchema) {
    super(); // we need an inner schema...
  }

  isa(val: any) : boolean {
    return val instanceof Array;
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not an array',
        schema: this
      });
    }
    val.forEach((item : any, i : number) => {
      this.inner.validate(item, `${path}.${i}`, errors);
    })
  }

  toSchema() {
    return {
      type: this.type,
      items: this.inner.toSchema()
    }
  }
}

class ObjectSchema extends JsonSchema {
  type = 'object'
  properties: {[key: string]: JsonSchema};
  required: string[];
  constructor(properties: {[key: string]: JsonSchema}) {
    super(); // we need an inner schema...
    this.properties = properties;
    this.required = [];
  }

  isa(val: any) : boolean {
    return val instanceof Object;
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not an object',
        schema: this
      });
    }
  }

  setProperty(key : string, prop : JsonSchema, optional : boolean = false) : void {
    if (this.properties.hasOwnProperty(key)) {
      throw new Error(`ObjectSchema:duplicateProperty: ${key}`)
    }
    this.properties[key] = prop;
    if (!optional) {
      this.required.push(key);
    }
  }

  toSchema() {
    return {
      type: this.type,
      properties: this._toPropertySchemas(),
      required: this.required
    }
  }

  _toPropertySchemas() {
    let result : {[key: string]: any} = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        result[key] = this.properties[key].toSchema();
      }
    }
    return result;
  }
}

class OneOfSchema extends JsonSchema {
  type = 'oneOf' // this is used differently for when generating the schema JSON.
  items: JsonSchema[];
  constructor(items: JsonSchema[]) {
    super(); // we need an inner schema...
    this.items = items;
  }

  isa(val: any) : boolean {
    for (var i = 0; i < this.items.length; ++i) {
      if (this.items[i].isa(val))
        return true;
    }
    return false;
  }

  protected _validate(val: any, path : string, errors : SchemaValidationError[]) : void {
    if (!this.isa(val)) {
      errors.push({
        path: path,
        value: val,
        message: 'Not one of',
        schema: this
      });
    }
  }

  toSchema() {
    return {
      type: this.items.map((schema) => schema.type)
    }
  }
}


export function makeSchema(options : SchemaOptions) : JsonSchema {
  console.info('***************** makeSchema', options);
  let type : TypePrimitiveAndList = options.type || 'object';
  if (type instanceof Array) {
    return makeOneOfSchema(options);
  } else {
    switch (type) {
      case 'number':
        return new NumberSchema();
      case 'integer':
        return new IntegerSchema();
      case 'string':
        if (options.format) {
          return new DateJsonSchema();
        } else {
          return new StringJsonSchema();
        }
      case 'boolean':
        return new BooleanSchema();
      case 'null':
        return new NullSchema();
      case 'array':
        return makeArraySchema(options);
      case 'object':
        return makeObjectSchema(options);
      default:
        throw new Error(`UnknownSchemaType: ${type}`)
    }
  }
}

function makeArraySchema(options : SchemaOptions) : ArraySchema {
  if (options.items) {
    let inner = makeSchema(options.items);
    return new ArraySchema(inner);
  }
  throw new Error(`ArraySchema:no_items`);
}

function makeObjectSchema(options : SchemaOptions) : ObjectSchema {
  if (options.properties) {
    let properties : {[key: string]: JsonSchema} = {};
    for (var key in options.properties) {
      if (options.properties.hasOwnProperty(key)) {
        properties[key] = makeSchema(options.properties[key]);
      }
    }
    return new ObjectSchema(properties);
  } else {
    throw new Error(`ObjectSchema:no_properties`);
  }
}

function makeOneOfSchema(options : SchemaOptions) : OneOfSchema {
  if (options.type instanceof Array) {
    let items = options.type.map((type) => makeSchema({
      ...options,
      type: type
    }));
    return new OneOfSchema(items);
  } else {
    throw new Error(`OneOfSchema:not_array`);
  }
}
const SCHEMA_FIELD = '__schema';

type GenericConstructor = { new(...args : any[]): {} };

// there are a few things to do in order to construct the right schema tree.
// 1 - every Ctor will have a __schema field
// 2 - the first call will create it.
// 3 - there will be decorators that will be used to generate the __schema field and populate it with information.
// 4 - due to the complexity of the information, there needs to be a way to make sense of it all
// @Schema is a top level

export function attachSchema<T extends GenericConstructor >(constructor : T, schema : JsonSchema) : T {
  if (!constructor.hasOwnProperty(SCHEMA_FIELD)) {
    Object.defineProperty(constructor, SCHEMA_FIELD, {
      value: schema,
      enumerable: true,
      configurable: false,
      writable: false
    });
  }
  return constructor;
}

function getAttachedSchema<T extends GenericConstructor >(constructor : T) : JsonSchema {
  let prop = Object.getOwnPropertyDescriptor(constructor, SCHEMA_FIELD);
  if (prop) {
    return prop.value;
  } else {
    throw new Error("NoSchemaDefined");
  }
}

export function addProperty(target : Object, key : string, options : SchemaOptions, ctor : any) : void {
  let constructor : GenericConstructor= <GenericConstructor>target.constructor;
  attachSchema(constructor, makeObjectSchema({
        type: 'object',
        properties: {},
        required: []
      }));
  let schema : ObjectSchema = <ObjectSchema>getAttachedSchema(constructor);
  let propSchema = getSchema(ctor);
  schema.setProperty(key, propSchema, options.optional ? true : false);
  propSchema['$ctor'] = ctor;
}


function isOptional(options : any) : boolean {
  return options.optional === true;
}

// how do deal with default values?
// have a function 

export function getSchema(ctor : any) : JsonSchema {
  console.info('--------getSchema', ctor);
  if (ctor === Integer) {
    return makeSchema({ type: 'integer' })
  } else if (ctor === String) {
    return makeSchema({ type: 'string' })
  } else if (ctor === Boolean) {
    return makeSchema({ type: 'boolean' })
  } else if (ctor === Date) {
    return makeSchema({ type: 'string', format: 'date-time' })
  }
  let prop = Object.getOwnPropertyDescriptor(ctor, SCHEMA_FIELD);
  if (prop) {
    return prop.value;
  } else {
    throw new Error("NoSchemaDefined");
  }
}


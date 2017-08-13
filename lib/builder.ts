import * as S from './schema';
import * as N from './number';
import * as I from './integer';
import * as T from './string';
import * as A from './array';
import * as O from './object';
import * as U from './null';
import * as B from './boolean';
import * as AO from './any-of';

export type EnumOnlyDefinition = {
  enum: any[]
} & S.SchemaCtorOptions;

export type AnyOfDefinition = {
  anyOf: JsonSchemaDefinition[]
} & S.SchemaCtorOptions;

export type NumberConstraints = {
  enum ?: number[];
  multipleOf ?: number;
  minimum ?: number;
  exclusiveMinimum ?: boolean;
  maximum ?: number;
  exclusiveMaximum ?: boolean;
};

export type NumberDefinition = {
  type: 'number';
} & NumberConstraints & S.SchemaCtorOptions;

export type IntegerDefinition = {
  type: 'integer';
} & NumberConstraints & S.SchemaCtorOptions;

export type NullDefinition = {
  type: 'null'
} & S.SchemaCtorOptions;

export type BooleanConstraints = {
  enum ?: boolean[];
};

export type BooleanDefinition = {
  type: 'boolean';
} & BooleanConstraints & S.SchemaCtorOptions;

export type StringConstraints = {
  enum ?: string[];
  minLength ?: number;
  maxLength ?: number;
  pattern ?: string;
  format ?: string;
}

export type StringDefinition = {
  type: 'string';
} & StringConstraints & S.SchemaCtorOptions;

export type ArrayConstraints = {
  enum ?: Array<any>[];
  items : JsonSchemaDefinition;
  minItems ?: number;
  maxItems ?: number;
}

export type ArrayDefinition = {
  type: 'array';
} & ArrayConstraints & S.SchemaCtorOptions;

export type ObjectConstraints = {
  enum ?: {[key: string]: any}[];
  properties : {[key: string]: JsonSchemaDefinition},
  required: string[]
}

export type ObjectDefinition = {
  type: 'object';
} & ObjectConstraints & S.SchemaCtorOptions;

export type JsonSchemaDefinition =
  NumberDefinition
  | IntegerDefinition
  | NullDefinition
  | BooleanDefinition
  | StringDefinition
  | ArrayDefinition
  | ObjectDefinition
  | EnumOnlyDefinition 
  | AnyOfDefinition
  ;

function isIntegerDefinition(data : JsonSchemaDefinition) : data is IntegerDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'integer';
}

function isNullDefinition(data : JsonSchemaDefinition) : data is NullDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'null';
}

function isNumberDefinition(data : JsonSchemaDefinition) : data is NumberDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'number';
}

function isBooleanDefinition(data : JsonSchemaDefinition) : data is BooleanDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'boolean';
}

function isStringDefinition(data : JsonSchemaDefinition) : data is StringDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'string';
}

function isArrayDefinition(data : JsonSchemaDefinition) : data is ArrayDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'array';
}

function isObjectDefinition(data : JsonSchemaDefinition) : data is ObjectDefinition {
  return data.hasOwnProperty('type') && (<{[key: string]: any}>data)['type'] === 'object';
}

function isAnyOfDefinition(data : JsonSchemaDefinition) : data is AnyOfDefinition {
  return data.hasOwnProperty('anyOf');
}

function isEnumOnlyDefinition(data : JsonSchemaDefinition) : data is EnumOnlyDefinition {
  return data.hasOwnProperty('enum') && !data.hasOwnProperty('type');
}

export function makeSchema(data : JsonSchemaDefinition) : S.IJsonSchema {
  if (isAnyOfDefinition(data)) {
    return new AO.AnyOfSchema(data.anyOf.map(makeSchema));
  } else if (isIntegerDefinition(data)) {
    return makeIntegerSchema(<IntegerDefinition>data);
  } else if (isNullDefinition(data)) {
    return makeNullSchema(<NullDefinition>data);
  } else if (isNumberDefinition(data)) {
    return makeNumberSchema(<NumberDefinition>data);
  } else if (isBooleanDefinition(data)) {
    return makeBooleanSchema(<BooleanDefinition>data);
  } else if (isStringDefinition(data)) {
    return makeStringSchema(<StringDefinition>data);
  } else if (isArrayDefinition(data)) {
    return makeArraySchema(<ArrayDefinition>data);
  } else if (isObjectDefinition(data)) {
    return makeObjectSchema(<ObjectDefinition>data);
  } else if (isEnumOnlyDefinition(data)) {
    return makeEnumSchema(data);
  } else {
    throw new Error(`Invaild Json Schema`)
  }
}

function makeEnumSchema(data : EnumOnlyDefinition) : S.EnumConstraint<any> {
  return new S.EnumConstraint<any>(data.enum);
}

function makeNumberSchema(data : NumberDefinition) : N.NumberSchema {
  let options : N.NumberSchemOptions = {};
  if (data.enum) {
    options.enum = new S.EnumConstraint<number>(data.enum);
  }
  if (data.multipleOf) {
    options.multipleOf = new N.MultipleOfConstraint(data.multipleOf);
  }
  if (data.minimum) {
    options.minimum = new N.MinimumConstraint(data.minimum, data.exclusiveMinimum || false)
  }
  if (data.maximum) {
    options.maximum = new N.MaximumConstraint(data.maximum, data.exclusiveMaximum || false)
  }
  return new N.NumberSchema(options);
}

function makeIntegerSchema(data : IntegerDefinition) : I.IntegerSchema {
  let options : N.NumberSchemOptions = {};
  if (data.enum) {
    options.enum = new S.EnumConstraint<number>(data.enum);
  }
  if (data.multipleOf) {
    options.multipleOf = new N.MultipleOfConstraint(data.multipleOf);
  }
  if (data.minimum) {
    options.minimum = new N.MinimumConstraint(data.minimum, data.exclusiveMinimum || false)
  }
  if (data.maximum) {
    options.maximum = new N.MaximumConstraint(data.maximum, data.exclusiveMaximum || false)
  }
  return new I.IntegerSchema(options);
}

function makeNullSchema(data : NullDefinition) : U.NullSchema {
  return new U.NullSchema();
}

function makeBooleanSchema(data : BooleanDefinition) : B.BooleanSchema {
  let options : B.BooleanSchemaOptions = {};
  if (data.enum) {
    options.enum = new S.EnumConstraint<boolean>(data.enum);
  }
  return new B.BooleanSchema(options);
}

function makeStringSchema(data : StringDefinition) : T.StringSchema {
  let options : T.StringSchemaOptions = {};
  if (data.enum) {
    options.enum = new S.EnumConstraint<string>(data.enum);
  }
  if (data.minLength) {
    options.minLength = new T.MinLength(data.minLength);
  }
  if (data.maxLength) {
    options.maxLength = new T.MaxLength(data.maxLength);
  }
  if (data.pattern) {
    options.pattern = new T.Pattern(data.pattern);
  }
  if (data.format) {
    options.format = new T.Format(data.format);
  }
  return new T.StringSchema(options);
}

function makeArraySchema(data : ArrayDefinition) : A.ArraySchema {
  let options : A.ArraySchemaOptions = {};
  if (data.enum) {
    options.enum = new S.EnumConstraint<Array<any>>(data.enum);
  }
  if (data.items) {
    options.items = new A.ItemsConstraint(makeSchema(data.items));
  }
  if (data.minItems) {
    options.minItems = new T.MinLength(data.minItems);
  }
  if (data.maxItems) {
    options.maxItems = new T.MaxLength(data.maxItems);
  }
  return new A.ArraySchema(options);
}

function makeObjectSchema(data : ObjectDefinition) : O.ObjectSchema {
  let options : O.ObjectSchemaOptions = {};
  if (data.enum) {
    options.enum = new S.EnumConstraint<Object>(data.enum);
  }
  if (data.properties) {
    options.properties = makePropertySchemas(data.properties);
  }
  if (data.required) {
    options.required = new O.RequiredConstraint(data.required);
  }
  return new O.ObjectSchema(options);
}

function makePropertySchemas(props : {[key: string]: JsonSchemaDefinition}) : O.PropertiesConstraint {
  let schemaMap : {[key: string]: S.IJsonSchema} = {};
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      schemaMap[key] = makeSchema(props[key]);
    }
  }
  return new O.PropertiesConstraint(schemaMap);
}


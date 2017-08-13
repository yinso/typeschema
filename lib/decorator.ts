import 'reflect-metadata'
import * as S from './schema';
import * as B from './builder';
import * as V from './value-object';
import * as O from './object';

const SCHEMA_FIELD = '__schema';

type GenericConstructor = { new(...args : any[]): {} };

// there are a few things to do in order to construct the right schema tree.
// 1 - every Ctor will have a __schema field
// 2 - the first call will create it.
// 3 - there will be decorators that will be used to generate the __schema field and populate it with information.
// 4 - due to the complexity of the information, there needs to be a way to make sense of it all
// @Schema is a top level

export function attachSchema<T extends GenericConstructor >(constructor : T, schema : S.IJsonSchema) : T {
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

function getAttachedSchema<T extends GenericConstructor >(constructor : T) : S.IJsonSchema {
  let prop = Object.getOwnPropertyDescriptor(constructor, SCHEMA_FIELD);
  if (prop) {
    return prop.value;
  } else {
    throw new Error("NoSchemaDefined");
  }
}

export function getSchema(ctor : any) : S.IJsonSchema {
  if (ctor === String) {
    return B.makeSchema({ type: 'string' })
  } else if (ctor === Boolean) {
    return B.makeSchema({ type: 'boolean' })
  } else if (ctor === Date) {
    return B.makeSchema({ type: 'string', format: 'date-time' })
  } else if (ctor === Number) {
    return B.makeSchema({ type: 'number' })
  } else {
    return getAttachedSchema(ctor);
  }
}

export function addProperty(target : Object, key : string, options : B.JsonSchemaDefinition, ctor : any) : void {
  let constructor : GenericConstructor= <GenericConstructor>target.constructor;
  attachSchema(constructor, B.makeSchema({
        type: 'object',
        properties: {},
        required: []
      }));
  let schema : O.ObjectSchema = <O.ObjectSchema>getAttachedSchema(constructor);
  let propSchema = getSchema(ctor);
  schema.setProperty(key, propSchema, options.required ? true : false);
  propSchema['$ctor'] = ctor;
}

function isOptional(options : any) : boolean {
  return options.optional === true;
}

// this is the decorator function.
export function Schema(options : B.JsonSchemaDefinition) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema(options));
  }
}

export function IntegerSchema(options : B.NumberConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'integer' , ...options }));
  }
}

export function NumberSchema(options : B.NumberConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'number' , ...options }));
  }
}

export function BooleanSchema(options : B.BooleanConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'boolean' , ...options }));
  }
}

export function NullSchema() {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'null' }));
  }
}

export function StringSchema(options : B.StringConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'string', ...options }));
  }
}

export function ArraySchema(options : B.ArrayConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'array', ...options }));
  }
}

export function ObjectSchema(options : B.ObjectConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return attachSchema(Clazz, B.makeSchema({ type: 'object', ...options }));
  }
}

// this is for special case of dealing with Null types...
@NullSchema()
class _Null extends V.ValueObject<null> { }

// decorator function
export function Property(options : any) : PropertyDecorator {
  return (target : Object, key : string ) : void => {
    let ctor = Reflect.getMetadata('design:type', target, key);
    if (ctor === Object) {
      // this is a complex type - in such case we need the inform the user...
      console.warn('Complex type - be sure to add $ctors check');
    }
    addProperty(target, key, options, ctor || _Null); // ctor is undefined for null type.
  }
}

// this is... hmmm...
// how the heck am I suppose to make use of this for typing?
type TypedConstructor<T> = { new(...args: any[]) : T };

type TypeMaker<T> = (data : any) => T;

export function fromJSON<T>(ctor : Function, data : any) : T {
  let schema = getSchema(ctor);
  let result = S.validate(schema, data);
  if (result.errors.length > 0) {
    throw new S.ValidationException(result.errors);
  } else {
    return <T>schema.fromJSON(data);
  }
}

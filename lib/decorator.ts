import 'reflect-metadata'
import * as S from './schema';
import * as B from './builder';
import * as V from './value-object';
import * as O from './object';

/*
: {
    new (...args: any[]): {};
    prototype: any;
} & T 
*/


function attachClassSchema<T extends { new(...args : any[]): {} } >(Clazz : T, schema : S.IJsonSchema) {
  S.attachSchema(Clazz, schema);
  (<any>Clazz).fromJSON = function <T>(value : any) : T {
    console.info('***** clazz level fromJSON', value);
    return schema.fromJSON(value);
  };
  Clazz.prototype.toJSON = function () : any {
    console.info('***** object level toJSON', this);
    return schema.jsonify(this);
  };
  return Clazz;

}

export function Schema(options : B.JsonSchemaDefinition) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) => {
    console.info('Schema.maker', Clazz, options);
    return attachClassSchema(Clazz, B.makeSchema({ ...options, $make : (value : any) => new Clazz(value) }));
  }
}

export function IntegerSchema(options : B.NumberConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'integer' , ...options }));
  }
}

export function NumberSchema(options : B.NumberConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'number' , ...options }));
  }
}

export function BooleanSchema(options : B.BooleanConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'boolean' , ...options }));
  }
}

export function NullSchema() {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'null' }));
  }
}

export function StringSchema(options : B.StringConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'string', ...options }));
  }
}

export function ArraySchema(options : B.ArrayConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'array', ...options }));
  }
}

export function ObjectSchema(options : B.ObjectConstraints) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, B.makeSchema({ type: 'object', ...options }));
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  PROPERTY-LEVEL Decorators.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function addProperty(target : Object, key : string, options : B.JsonSchemaDefinition, ctor : any) : void {
  let constructor : S.GenericConstructor= <S.GenericConstructor>target.constructor;
  let schema : O.ObjectSchema | undefined = <O.ObjectSchema | undefined>S.hasAttachedSchema(constructor);
  if (!schema) {
    schema = new O.ObjectSchema();
    attachClassSchema(constructor, schema);
  }
  let propSchema = S.getSchema(ctor);
  if (!S.isJsonSchema(options)) {
    schema.setProperty(key, propSchema, options.$optional ? !options.$optional : true);
  }
  (<any>propSchema)['$ctor'] = ctor;
}

// this is for special case of dealing with Null types...
@NullSchema()
class _Null extends V.ValueObject<null> { }

export function makeValueObject<T>(options : B.ValueSchemaDefinition) {
  let schema = B.makeValueSchema(options);
  let Clazz = class extends V.ValueObject<T> {
    static getSchema() {
      return schema;
    }

    static isa(value : any) : boolean {
      return value instanceof Clazz;
    }

    static fromJSON(value : any) {
      return schema.fromJSON(value);
    } 

    _validate(value : any) {
      let errors : S.ValidationError[] = [];
      schema.validate(value, '$', errors);
      if (errors.length > 0) {
        throw new S.ValidationException(errors);
      }
    }
  }
  S.attachSchema(Clazz, schema);
  return Clazz;
}

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


// do we want the type to have their own JSON capability? by default the answer should be yes but 
// that's 
// converting the 
export function toJSON(ctor: Function, data : any) : any {
  return data;
}

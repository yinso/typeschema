import 'reflect-metadata'
import * as ajv from 'ajv';
import { Integer } from './integer';
import * as S from './schema2';
import * as util from 'util';

export { Integer } from './integer';

export function test<T extends { new(...args : any[]):{} } >(clazz : T ) : T {
  console.log('Class constructor', clazz)
  return clazz;
}

export function Schema(options : S.SchemaOptions) {
  return <T extends { new(...args : any[]): {} } >(Clazz : T) : T => {
    return S.attachSchema(Clazz, S.makeSchema(options));
  }
}

/*
type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
//*/


export class ValueObject<T> {
  protected readonly __value: T;
  constructor(value : T) {
    this.__value = this._validate(value);
  }

  protected _validate(value : T) : T {
    return validate(this.constructor, value);
  }

  valueOf() : T {
    return this.__value;
  }

  toJSON() : T {
    return this.__value;
  }
}

// this is for special case of dealing with Null types...
@Schema({ type: 'null' })
class _Null extends ValueObject<null> { }

export function Property(options : any) : PropertyDecorator {
  return (target : Object, key : string ) : void => {
    let ctor = Reflect.getMetadata('design:type', target, key);
    if (ctor === Object) {
      // this is a complex type - in such case we need the inform the user...
      console.warn('Complex type - be sure to add $ctors check');
    }
    S.addProperty(target, key, options, ctor || _Null); // ctor is undefined for null type.
  }
}

export function validate<T>(Ctor : Function, val : T) : T {
  let _ajv = new ajv();
  let schema = S.getSchema(Ctor);
  let result = _ajv.validate(schema, val);
  console.info('validate.result', Ctor, val, schema, result, _ajv.errors);
  if (_ajv.errors) {
    let e = new Error("ValidationError");
    Object.defineProperty(e, 'errors', {
      value: _ajv.errors,
      configurable: false,
      writable: false
    });
    throw e;
  }
  return val;
}

import * as S from '../lib/schema';
import * as B from '../lib/builder';
import * as D from '../lib/decorator';
import * as I from '../lib/integer';
import * as N from '../lib/number';
import * as T from '../lib/string';
import * as A from '../lib/array';
import * as O from '../lib/object';
import * as BO from '../lib/boolean';
import * as V from '../lib/value-object';
import { suite , test , hasErrors, noErrors , throws , deepEqual } from '../lib/test-util';
import * as util from 'util';

@suite
class ObjectSchemaTest {
  @test
  canCreateSchema() {
    let x = new O.ObjectSchema({
      properties: new O.PropertiesConstraint({
        foo: new I.IntegerSchema(),
        bar: new T.StringSchema(),
        xyz: new A.ArraySchema({ items: new A.ItemsConstraint(new BO.BooleanSchema()) })
      }), 
      required: new O.RequiredConstraint(['foo', 'bar'])
    })
    noErrors(S.validate(x, {
      foo: 1, bar: 'hello'
    }))
    noErrors(S.validate(x, {
      foo: 1, bar: 'hello', xyz: [ true, false , true]
    }))
  }
  @test
  canUseBuilder() {
    let x = B.makeSchema({
      type: 'object',
      properties: {
        foo: { type: 'integer' },
        bar: { type: 'string' },
        xyz: {
          type: 'array',
          items: { type: 'boolean'}
        }
      },
      required: ['foo', 'bar']
    })
    noErrors(S.validate(x, {
      foo: 1, bar: 'hello'
    }))
    noErrors(S.validate(x, {
      foo: 1, bar: 'hello', xyz: [ true, false , true]
    }))
  }

  @test
  canDeserialize() {
    class SSN extends V.ValueObject<string> {}
    class Person {
      name : string;
      ssn : SSN;
      birthday: Date;
      constructor(options : {name : string, ssn : SSN, birthday: Date}) {
        this.name = options.name;
        this.ssn = options.ssn;
        this.birthday = options.birthday;
      }
      toJSON() {
        return {
          name: this.name,
          ssn: this.ssn.toJSON(),
          birthday: this.birthday.toISOString()
        };
      }
    }
    //T.registerFormat('ssn', (v) => /^\d\d\d-?\d\d-?\d\d\d\d$/.test(v), (v) => new SSN(v))
    let s_ssn = B.makeSchema({
      type: 'string',
      pattern: '^\\d\\d\\d-?\\d\\d-?\\d\\d\\d\\d$',
      $make: (v) => new SSN(v)
    });
    let s_person = B.makeSchema({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        ssn: s_ssn,
        birthday: {
          type: 'string', format: 'date-time'
        }
      },
      required: ['name', 'ssn', 'birthday'],
      $make: (v) => {
        console.info('new Person being called...', v)
        return new Person(v)
      }
    });
    let johnJson = {
      name: 'John',
      ssn: '123-45-6789',
      birthday: '1970-01-10T00:00:00.000Z'
    };
    let john = s_person.fromJSON(johnJson)
    deepEqual(john.toJSON(), johnJson);
    console.info(util.inspect(john, { depth: 1000, colors: true }))
  }
}

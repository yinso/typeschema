import * as S from '../lib/schema';
import * as T from '../lib/string';
import * as B from '../lib/builder';
import * as V from '../lib/value-object';
import * as D from '../lib/decorator';
import { suite , test , hasErrors, noErrors , throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class StringSchemaTest {
  @test
  canValidate() {
    let s = new T.StringSchema();
    noErrors(S.validate(s, 'hello'))
    hasErrors(S.validate(s, false))
    hasErrors(S.validate(s, 1))
    hasErrors(S.validate(s, []))
    hasErrors(S.validate(s, null))
    hasErrors(S.validate(s, {}))
  }

  @test
  canDeserialize() {
    let s = new T.StringSchema();
    deepEqual(s.fromJSON('hello'), 'hello')
    throws(() => s.fromJSON(1.1))
    throws(() => s.fromJSON(true))
    throws(() => s.fromJSON(1))
    throws(() => s.fromJSON([]))
    throws(() => s.fromJSON({}))
    throws(() => s.fromJSON(null))
  }

  @test
  canDeserializeDate() {
    let s = new T.StringSchema({format: new T.Format('date-time')});
    let ts = '2017-01-01T00:00:00Z'
    deepEqual(s.fromJSON(ts), new Date(ts))
    throws(() => s.fromJSON('hello'))
  }

  @test
  canUseDecorator() {
    let SSN = D.makeValueObject<string>({
      type: 'string',
      pattern: /^\d\d\d-?\d\d-?\d\d\d\d$/
    });
    noThrows(() => new SSN('123-45-6789'));
    throws(() => new SSN('134'));
    noThrows(() => SSN.fromJSON('123456789'));
    throws(() => SSN.fromJSON('junk'));
    deepEqual(new SSN('123-45-6789').toJSON(), '123-45-6789')
  }

  @test
  canAddNewFormat() {
    let SSN = D.makeValueObject<string>({
      type: 'string',
      pattern: /^\d\d\d-?\d\d-?\d\d\d\d$/
    });
    T.registerFormat('ssn', {
      isa: (v) => SSN.getSchema().isa(v), // can't directly use SSN.isa, which tests for whether the value belongs to the class.
      fromJSON: (v) => SSN.fromJSON(v),
      jsonify: (v) => v.toJSON()
    });
    let s = new T.StringSchema({format: new T.Format('ssn')})
    let ssn = '123456789'
    deepEqual(s.fromJSON(ssn), new SSN(ssn))
    deepEqual(new SSN(ssn).toJSON(), ssn)
  }

}

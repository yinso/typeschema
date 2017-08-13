import * as S from '../lib/schema';
import * as N from '../lib/number';
import * as I from '../lib/integer';
import * as B from '../lib/builder';
import { suite , test , hasErrors, noErrors , throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class IntegerSchemaTest {
  @test
  canValidateInteger() {
    let x = new I.IntegerSchema();
    noErrors(S.validate(x, 10));
    deepEqual(x.toJSON(), { type: 'integer'})
  }

  @test
  canRejectNonInteger() {
    let x = new I.IntegerSchema();
    hasErrors(S.validate(x, 10.1));
  }

  @test
  canConstraintMultipleOf() {
    let x = new I.IntegerSchema({ multipleOf: new N.MultipleOfConstraint(5) });
    hasErrors(S.validate(x, 4));
    noErrors(S.validate(x, 10))
    deepEqual(x.toJSON(), { type: 'integer', multipleOf: 5 })
  }

  @test
  canConstraintMinimum() {
    let x = new I.IntegerSchema({ minimum: new N.MinimumConstraint(5, false) });
    hasErrors(S.validate(x, 4));
    noErrors(S.validate(x, 6))
    deepEqual(x.toJSON(), { type: 'integer', minimum: 5, exclusiveMinimum: false })
  }

  @test
  canConstraintMaximum() {
    let x = new I.IntegerSchema({ maximum: new N.MaximumConstraint(5, false) });
    noErrors(S.validate(x, 4));
    hasErrors(S.validate(x, 6))
    deepEqual(x.toJSON(), { type: 'integer', maximum: 5, exclusiveMaximum: false })
  }

  @test
  canCreateInteger () {
    let x = new I.Integer(10)
  }
  
  @test
  canValidateIntegerObject() {
    throws(() => new I.Integer(16.1))
    noThrows(() => new I.Integer(16))
  }

  @test
  canDeserialize() {
    let s = new I.IntegerSchema();
    deepEqual(s.fromJSON(1), 1)
    throws(() => s.fromJSON(1.1))
    throws(() => s.fromJSON('hello'))
    throws(() => s.fromJSON(true))
    throws(() => s.fromJSON([]))
    throws(() => s.fromJSON({}))
    throws(() => s.fromJSON(null))
  }
}

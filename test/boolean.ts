import * as S from '../lib/schema';
import * as BO from '../lib/boolean';
import * as B from '../lib/builder';
import { suite , test , hasErrors, noErrors , throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class BooleanSchemaTest {
  @test
  canValidate() {
    let s = new BO.BooleanSchema();
    noErrors(S.validate(s, true))
    noErrors(S.validate(s, false))
    hasErrors(S.validate(s, 1))
    hasErrors(S.validate(s, 'hello'))
    hasErrors(S.validate(s, []))
    hasErrors(S.validate(s, null))
    hasErrors(S.validate(s, {}))
  }

  @test
  canDeserialize() {
    let s = new BO.BooleanSchema();
    deepEqual(s.fromJSON(true), true)
    deepEqual(s.fromJSON(false), false)
    throws(() => s.fromJSON(1.1))
    throws(() => s.fromJSON('hello'))
    throws(() => s.fromJSON(1))
    throws(() => s.fromJSON([]))
    throws(() => s.fromJSON({}))
    throws(() => s.fromJSON(null))
  }
}

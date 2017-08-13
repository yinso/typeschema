import * as S from '../lib/schema';
import { suite , test , hasErrors, noErrors , throws , deepEqual , noThrows } from '../lib/test-util';
import * as D from '../lib/decorator';
import * as U from '../lib/null';

@suite
class NullSchemaTest {
  @test
  canValidateNull() {
    let s = new U.NullSchema();
    noErrors(S.validate(s, null))
    hasErrors(S.validate(s, 1))
    hasErrors(S.validate(s, 'hello'))
    hasErrors(S.validate(s, true))
    hasErrors(S.validate(s, []))
    hasErrors(S.validate(s, {}))
  }

  @test
  canDeserialize() {
    let s = new U.NullSchema();
    deepEqual(s.fromJSON(null), null)
    throws(() => s.fromJSON(1))
    throws(() => s.fromJSON('hello'))
    throws(() => s.fromJSON(true))
    throws(() => s.fromJSON([]))
    throws(() => s.fromJSON({}))
  }
}

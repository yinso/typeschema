import * as S from '../lib/schema';
import * as B from '../lib/builder';
import * as D from '../lib/decorator';
import * as I from '../lib/integer';
import * as N from '../lib/number';
import * as T from '../lib/string';
import * as A from '../lib/array';
import * as O from '../lib/object';
import { suite , test , hasErrors, noErrors , throws , deepEqual } from '../lib/test-util';

@suite
class EnumConstraintTest {
  @test
  canValidate() {
    let x = new S.EnumConstraint<any>([1, 'hello', 'test'])
    noErrors(S.validate(x, 1))
    noErrors(S.validate(x, 'hello'))
    noErrors(S.validate(x, 'test'))
    hasErrors(S.validate(x, true))

  }
}

@suite
class ArraySchemaTest {
  @test
  canCreateSchema() {
    let x = new A.ArraySchema({ items: new A.ItemsConstraint(new I.IntegerSchema()) });
    noErrors(S.validate(x, [5, 10, 15]))
    hasErrors(S.validate(x, [1, 'ehllo', 5]))
  }

  @test
  canUseBuilder() {
    let x = B.makeSchema({
      type: 'array',
      items: {
        type: 'integer'
      }
    })
    noErrors(S.validate(x, [1, 2, 3]));
    hasErrors(S.validate(x, 'hello'));
    hasErrors(S.validate(x, [1, 'hello']));
  }
}

@suite
class DeserializeTest {
  @test
  canDeserializeNumber() {
    // is this what I'm looking for?
    let num : number = S.fromJSON<number>(Number, 1);
    let str : string = S.fromJSON<string>(String, 'test')
    let date : Date = S.fromJSON<Date>(Date, '2013-01-01T00:00:00Z') 
  }
}

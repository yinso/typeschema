import * as util from 'util';
import * as TS from '../lib';
import { suite, test, slow, timeout } from "mocha-typescript";
import * as assert from 'assert';

@suite
class BaseTest {
  @test
  canConstructStringSchema() {
    @TS.Schema({ type: 'string', pattern: '\\S+' })
    class Name extends TS.ValueObject<string> {

    }
    let name = new Name('Yinso')
    assert.equal(name.valueOf(), 'Yinso')
    assert.throws(() => {
      new Name(1)
    })
  }
}


class Test {
  pattern = /[^\s]+/; // does this make use of the validation???
}

@TS.Schema({ type: 'string', pattern: '\\S+' })
class Name extends TS.ValueObject<string> {

}

@TS.Schema({ type: 'integer' })
class Integer extends TS.ValueObject<number> { }

class Foo {
  constructor() {}

  @TS.Property({

  })
  foo: Integer;

  @TS.Property({})
  bar: string ;

  @TS.Property({
    optional: true
  })
  baz: boolean;

  @TS.Property({})
  test: null;

  @TS.Property({
  })
  created: Date;
}
console.info(util.inspect(Foo, { depth : 1000 , colors: true }));
new Integer(10)
new Integer(5)
//new Integer(5.1)
//new Name(' ')

console.info(JSON.stringify({
  foo: new TS.Integer(10),
  bar: new Name('hello world'),
  created: new Date()
}));


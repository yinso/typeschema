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
class BuilderTest {
  equals(json : B.JsonSchemaDefinition) : void {
    let s = B.makeSchema(json);
    deepEqual(s.toJSON(), json);
  }

  @test
  canBuildSchema() {
    this.equals({ type: 'integer' });
    this.equals({ type: 'number' });
    this.equals({ type: 'boolean' });
    this.equals({ type: 'null' });
    this.equals({ type: 'string' });
    this.equals({ type: 'array' , items: { type: 'string' }});
    this.equals({ type: 'object',
      properties: { foo: { type: 'integer'}, bar: { type: 'string'}},
      required: []
    });
  }
}
import * as T from '../lib/ast';
import * as G from '../lib/grammar';
import * as P from '../lib/typescript';
import { suite , test , hasErrors, noErrors , ok, throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class TypeScriptTest {

  @test
  canLoadTemplates() {
    let printer = new P.TypeScriptPrinter();
    return printer.loadTemplates()
      .then(() => {
        // now we can print.
        return printer.renderDeclaration(new T.TypeDeclaration('SSN', new T.StringType([new T.Pattern(/^\d\d\d-?\d\d-?\d\d\d\d$/), new T.MinLength(5)])))
      })
      .then((res) => {
        console.info(res);
      })
  }

  @test
  canParseTypeDefinition() {
    let res = G.parse('type SSN = string with { pattern: /^\\d\\d\\d-?\\d\\d-?\\d\\d\\d\\d$/ minLength: 10 }');
    let decl = new T.TypeDeclaration('SSN', new T.StringType([new T.MinLength(10), new T.Pattern(/^\d\d\d-?\d\d-?\d\d\d\d$/)]));

    ok(res.length > 0 && res.get('SSN').equals(decl.typeExp));
  }

  @test
  canParseObjectTypeDefinition() {
    let text = `
    type Person = {
      firstName: string
      lastName: string
      ssn ?: SSN
    }
    `;
    let res = G.parse(text);
    let decl = new T.TypeDeclaration('Person', new T.ObjectType([
      new T.ObjectTypeKeyVal('lastName', new T.StringType(), true),
      new T.ObjectTypeKeyVal('firstName', new T.StringType(), true),
      new T.ObjectTypeKeyVal('ssn', new T.RefType('SSN'), false),
    ]))
    ok(res.length > 0 && res.get('Person').equals(decl.typeExp));
  }
  @test
  canPrintObjectType() {
    let printer = new P.TypeScriptPrinter();
    return printer.loadTemplates()
      .then(() => {
        let text = `
        type Person = {
          firstName: string
          lastName: string
          ssn ?: SSN
        }
        `;
        let res = G.parse(text);
        return printer.render(res)
      })
      .then((res) => {
        console.info(res);
      })
  }
}
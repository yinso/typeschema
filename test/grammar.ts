import * as ast from '../lib/ast';
import * as grammar from '../lib/grammar';
import { suite , test , hasErrors, noErrors , ok, throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class EnvironmentTest {
    @test
    canCreate() {
        let result = grammar.parse('type SSN = (a : string) where a =~ /^\\d\\d\\d-?\\d\\d-?\\d\\d\\d\\d$/');
        console.info(result);
    }
}

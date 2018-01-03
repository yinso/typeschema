import * as ast from '../lib/ast';
import { suite , test , hasErrors, noErrors , ok, throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class EnvironmentTest {
    @test
    canCreate() {
        let env = new ast.Environment<ast.IExpression>();
        env.set(ast.identifier('test'), ast.integerExp(1));
        console.log(env.get(ast.identifier('test')));
        let nested = env.pushEnv();
        console.log(env.get(ast.identifier('test'))); // expect to exist again.
    }
}

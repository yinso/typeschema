import * as ast from '../lib/formatter';
import * as pp from '../lib/printer';
import { suite , test , hasErrors, noErrors , ok, throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class PrinterTest {
    @test
    canPrint() {
        let printer = new pp.TypeScriptPrinter();
        console.info(printer.print(ast.ifExp(
            ast.binaryExp('==', ast.identifier('a'), ast.integerExp(5)),
            ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ ast.identifier('a') ])
            ]),
            ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ ast.identifier('a') ])
            ]),
        )));
    }
}
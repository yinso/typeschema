import * as ast from '../lib/ast';
import * as ts from '../lib/typescript';
import { suite , test , hasErrors, noErrors , ok, throws , deepEqual , noThrows } from '../lib/test-util';
import { transform } from 'typescript';

@suite
class PrinterTest {
    @test
    canPrint() {
        let printer = new ts.Printer();
        console.info(printer.print(ast.ifExp(
            ast.binaryExp('==', ast.identifier('a'), ast.stringExp('hello kitty\'s')),
            ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ ast.identifier('a') ])
            ]),
            ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ ast.identifier('a') ])
            ]),
        )));
        let transformer = new ts.StringTypeTransformer(ast.stringTypeExp(ast.identifier('SSN')));
        console.info(printer.print(transformer.transform()));
    }
}
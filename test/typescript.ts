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
        console.info(printer.print(ts.transformStringType(ast.stringTypeExp(ast.identifier('SSN'), {
            pattern: ast.patternConstraint('^\\d-\\d-\\d-?\\d-\\d-?\\d-\\d-\\d-\\d$'),
            minLength: ast.minLengthConstraint(9, true),
            maxLength: ast.maxLengthConstraint(11, true)
        }))));
    }

    @test
    canPrintPatternTest() {
        let printer = new ts.Printer();
        console.info(printer.print(
            ast.ifExp(
                ast.unaryExp('!',
                    ast.funcallExp(
                        ast.memberExp(ast.regexExp('^\\d\\d\\d-?\\d\\d-?\\d\\d\\d\\d$'), ast.identifier('test')),
                        [
                            ast.identifier('v')
                        ]
                    )),
                ast.funcallExp(
                    ast.memberExp(ast.identifier('err'), ast.identifier('push')),
                    [
                        ast.objectExp([
                            ast.objectExpKV(ast.identifier('error'), ast.stringExp('PatternMismatch')),
                            ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                            ast.objectExpKV(ast.identifier('value'), ast.identifier('v'))
                    ])
                    ]
                )
            )
        ))
    }
}

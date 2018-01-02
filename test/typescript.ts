import * as ast from '../lib/ast';
import * as pp from '../lib/typescript';
import { suite , test , hasErrors, noErrors , ok, throws , deepEqual , noThrows } from '../lib/test-util';

@suite
class PrinterTest {
    @test
    canPrint() {
        let printer = new pp.TypeScriptPrinter();
        console.info(printer.print(ast.ifExp(
            ast.binaryExp('==', ast.identifier('a'), ast.stringExp('hello kitty\'s')),
            ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ ast.identifier('a') ])
            ]),
            ast.blockExp([
                ast.funcallExp(ast.memberExp(ast.identifier('console'), ast.identifier('log')), [ ast.identifier('a') ])
            ]),
        )));
        console.info(printer.print(
            ast.classDecl(ast.identifier('SSN'), [
                ast.classPropertyDecl(ast.identifier('_v'), 'private', 'instance', 'readonly', ast.scalarTypeExp('string')),
                ast.methodDecl(
                    ast.identifier('constructor'),
                    'public',
                    'instance',
                    'readonly',
                    [
                        ast.parameterDecl(ast.identifier('v'), ast.scalarTypeExp('string'))
                    ],
                    ast.blockExp([
                        ast.assignmentExp(ast.memberExp(ast.identifier('this'), ast.identifier('_v')), ast.identifier('v'))
                    ])
                ),
                ast.methodDecl(
                    ast.identifier('valueOf'),
                    'public',
                    'instance',
                    'readonly',
                    [],
                    ast.blockExp([
                        ast.returnExp(ast.memberExp(ast.identifier('this'), ast.identifier('_v')))
                    ]),
                    ast.scalarTypeExp('string')
                ),
                ast.methodDecl(
                    ast.identifier('toString'),
                    'public',
                    'instance',
                    'readonly',
                    [],
                    ast.blockExp([
                        ast.returnExp(ast.memberExp(ast.identifier('this'), ast.identifier('_v')))
                    ]),
                    ast.scalarTypeExp('string')
                ),
                ast.methodDecl(
                    ast.identifier('toJSON'),
                    'public',
                    'instance',
                    'readonly',
                    [],
                    ast.blockExp([
                        ast.returnExp(ast.memberExp(ast.identifier('this'), ast.identifier('_v')))
                    ]),
                    ast.refTypeExp(ast.identifier('any'))
                ),
                ast.methodDecl(
                    ast.identifier('fromJSON'),
                    'public',
                    'class',
                    'readonly',
                    [
                        ast.parameterDecl(ast.identifier('v'), ast.refTypeExp(ast.identifier('any')))
                    ],
                    ast.blockExp([
                        ast.letExp(ast.identifier('res'),
                            ast.funcallExp(ast.memberExp(ast.identifier('SSN'), ast.identifier('validate')), [
                                ast.identifier('v')
                            ])
                        ),
                        ast.ifExp(
                            ast.funcallExp(ast.memberExp(ast.identifier('res'), ast.identifier('hasErrors')), []),
                            ast.throwExp(ast.identifier('res')),
                        ),
                        ast.returnExp(ast.newExp(ast.identifier('SSN'), [ ast.identifier('v') ]))
                    ]),
                    ast.refTypeExp(ast.identifier('SSN'))
                ),
                ast.methodDecl(
                    ast.identifier('isJSON'),
                    'public',
                    'class',
                    'readonly',
                    [
                        ast.parameterDecl(ast.identifier('v'), ast.refTypeExp(ast.identifier('any')))
                    ],
                    ast.blockExp([
                        ast.letExp(ast.identifier('res'),
                            ast.funcallExp(ast.memberExp(ast.identifier('SSN'), ast.identifier('validate')), [
                                ast.identifier('v')
                            ])
                        ),
                        ast.returnExp(ast.unaryExp('!', ast.funcallExp(ast.memberExp(ast.identifier('res'), ast.identifier('hasErrors')), [])))
                    ]),
                    ast.refTypeExp(ast.identifier('SSN'))
                ),
                ast.methodDecl(
                    ast.identifier('validate'),
                    'public',
                    'class',
                    'readonly',
                    [
                        ast.parameterDecl(ast.identifier('v'), ast.refTypeExp(ast.identifier('any'))),
                        ast.parameterDecl(ast.identifier('path'), ast.scalarTypeExp('string'), ast.stringExp('$')),
                        ast.parameterDecl(ast.identifier('err'),
                            ast.refTypeExp(ast.identifier('ValidationResult')),
                            ast.newExp(ast.identifier('ValidationResult'), [])),
                    ],
                    ast.blockExp([
                        ast.ifExp(
                            ast.binaryExp('==', ast.funcallExp(ast.identifier('typeof'), [ast.identifier('v')]), ast.stringExp('string')),
                            ast.funcallExp(
                                ast.memberExp(ast.identifier('err'), ast.identifier('push')),
                                [
                                    ast.objectExp([
                                        ast.objectExpKV(ast.identifier('error'), ast.stringExp('Not a string.')),
                                        ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                                        ast.objectExpKV(ast.identifier('value'), ast.identifier('v'))
                                    ])
                                ]
                            )
                        ),
                        ast.returnExp(ast.identifier('err'))
                    ]),
                    ast.refTypeExp(ast.identifier('ValidationResult'))
                ),
            ])
        ));
    }
}
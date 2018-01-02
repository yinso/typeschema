import * as ast from './ast';
import { Doc , layout , nest , text, empty, concat, flexWS, line } from './pretty-printer';
import { validate } from './schema';

export class ScalarTypeTransformer {
    className : ast.Identifier;
    _v : ast.Identifier;
    innerType : ast.ScalarTypeExp;
    arg : ast.Identifier;
    res : ast.Identifier;

    constructor(className : ast.Identifier, _v: ast.Identifier, innerType : ast.ScalarTypeExp) {
        this.className = className;
        this._v = _v;
        this.innerType = innerType;
        this.arg = ast.identifier('v');
        this.res = ast.identifier('res');
    }

    _inner_ref() {
        return ast.memberExp(ast.identifier('this'), this._v);
    }

    _inner() {
        return ast.classPropertyDecl(this._v, 'private', 'instance', 'readonly', this.innerType);
    }

    _constructor() {
        return ast.methodDecl(
            ast.identifier('constructor'),
            'public',
            'instance',
            'readonly',
            [
                ast.parameterDecl(this.arg, this.innerType)
            ],
            ast.blockExp([
                ast.assignmentExp(this._inner_ref(), this.arg)
            ])
        );
    }

    _valueOf() {
        return ast.methodDecl(
            ast.identifier('valueOf'),
            'public',
            'instance',
            'readonly',
            [],
            ast.blockExp([
                ast.returnExp(this._inner_ref())
            ]),
            this.innerType
        );
    }

    _toString() {
        return ast.methodDecl(
            ast.identifier('toString'),
            'public',
            'instance',
            'readonly',
            [],
            ast.blockExp([
                ast.returnExp(this._inner_ref())
            ]),
            ast.scalarTypeExp('string')
        );
    }

    _toJSON() {
        return ast.methodDecl(
            ast.identifier('toJSON'),
            'public',
            'instance',
            'readonly',
            [],
            ast.blockExp([
                ast.returnExp(this._inner_ref())
            ]),
            ast.refTypeExp(ast.identifier('any'))
        );
    }

    _fromJSON() {
        return ast.methodDecl(
            ast.identifier('fromJSON'),
            'public',
            'class',
            'readonly',
            [
                ast.parameterDecl(this.arg, ast.refTypeExp(ast.identifier('any')))
            ],
            ast.blockExp([
                ast.letExp(this.res,
                    ast.funcallExp(ast.memberExp(this.className, ast.identifier('validate')), [
                        this.arg
                    ])
                ),
                ast.ifExp(
                    ast.funcallExp(ast.memberExp(this.res, ast.identifier('hasErrors')), []),
                    ast.throwExp(this.res),
                ),
                ast.returnExp(ast.newExp(this.className, [ this.res ]))
            ]),
            ast.refTypeExp(this.className)
        );
    }

    _isJSON() {
        return ast.methodDecl(
            ast.identifier('isJSON'),
            'public',
            'class',
            'readonly',
            [
                ast.parameterDecl(this.arg, ast.refTypeExp(ast.identifier('any')))
            ],
            ast.blockExp([
                ast.letExp(this.res,
                    ast.funcallExp(ast.memberExp(this.className, ast.identifier('validate')), [
                        this.arg
                    ])
                ),
                ast.returnExp(ast.unaryExp('!', ast.funcallExp(ast.memberExp(this.res, ast.identifier('hasErrors')), [])))
            ]),
            ast.refTypeExp(this.className)
        );
    }

    _validate() {
        return ast.methodDecl(
            ast.identifier('validate'),
            'public',
            'class',
            'readonly',
            [
                ast.parameterDecl(this.arg, ast.refTypeExp(ast.identifier('any'))),
                ast.parameterDecl(ast.identifier('path'), ast.scalarTypeExp('string'), ast.stringExp('$')),
                ast.parameterDecl(ast.identifier('err'),
                    ast.refTypeExp(ast.identifier('ValidationResult')),
                    ast.newExp(ast.identifier('ValidationResult'), [])),
            ],
            ast.blockExp([
                ast.ifExp(
                    ast.binaryExp('==', ast.funcallExp(ast.identifier('typeof'), [this.arg]), ast.stringExp(this.innerType.name)),
                    ast.funcallExp(
                        ast.memberExp(ast.identifier('err'), ast.identifier('push')),
                        [
                            ast.objectExp([
                                ast.objectExpKV(ast.identifier('error'), ast.stringExp('Not a string.')),
                                ast.objectExpKV(ast.identifier('path'), ast.identifier('path')),
                                ast.objectExpKV(ast.identifier('value'), this.arg)
                            ])
                        ]
                    )
                ),
                ast.returnExp(ast.identifier('err'))
            ]),
            ast.refTypeExp(ast.identifier('ValidationResult'))
        );
    }

    transform() {
        return ast.classDecl(this.className, [
            this._inner(),
            this._constructor(),
            this._valueOf(),
            this._toString(),
            this._toJSON(),
            this._fromJSON(),
            this._isJSON(),
            this._validate()
        ]);
    }
}

export class StringTypeTransformer {
    private _inner : ast.StringTypeExp;

    constructor(inner : ast.StringTypeExp) {
        this._inner = inner;
    }

    transform() : ast.ClassDecl {
        let transformer = new ScalarTypeTransformer(this._inner.name, ast.identifier('_v'), ast.scalarTypeExp('string'))
        return transformer.transform();
    }
}

export class Printer {

    print(node : ast.Node) : string {
        let doc = this._node(node);
        return layout(doc);
    }

    private _node(node : ast.Node) : Doc {
        if (ast.isIdentifier(node)) {
            return this._identifier(node);
        } else if (ast.isStringExp(node)) {
            return this._string(node);
        } else if (ast.isIntegerExp(node)) {
            return this._integer(node);
        } else if (ast.isDoubleExp(node)) {
            return this._double(node);
        } else if (ast.isBooleanExp(node)) {
            return this._boolean(node);
        } else if (ast.isObjectExp(node)) {
            return this._object(node);
        } else if (ast.isIfExp(node)) {
            return this._if(node);
        } else if (ast.isUnaryExp(node)) {
            return this._unary(node);
        } else if (ast.isBinaryExp(node)) {
            return this._binary(node);
        } else if (ast.isMemberExp(node)) {
            return this._member(node);
        } else if (ast.isFuncallExp(node)) {
            return this._funcall(node);
        } else if (ast.isNewExp(node)) {
            return this._new(node);
        } else if (ast.isBlockExp(node)) {
            return this._block(node);
        } else if (ast.isThrowExp(node)) {
            return this._throw(node);
        } else if (ast.isClassDecl(node)) {
            return this._class(node);
        } else if (ast.isMethodDecl(node)) {
            return this._method(node);
        } else if (ast.isClassPropertyDecl(node)) {
            return this._classProperty(node);
        } else if (ast.isAssignmentExp(node)) {
            return this._assign(node);
        } else if (ast.isLetExp(node)) {
            return this._let(node);
        } else if (ast.isReturnExp(node)) {
            return this._return(node);
        } else if (ast.isStringTypeExp(node)) {
            return this._stringType(node);
        } else if (ast.isScalarTypeExp(node)) {
            return this._scalarType(node);
        } else if (ast.isRefTypeExp(node)) {
            return this._refType(node);
        } else {
            throw new Error(`Unknown Node: ${node.type}`);
        }
    }

    private _class(node : ast.ClassDecl) : Doc {
        return concat(
            flexWS(), text(`class ${node.name.name} {`),
            ...node.properties.map((prop) => nest(4, this._node(prop))),
            line(), text('}')
        );
    }

    private _classProperty(node : ast.ClassPropertyDecl) : Doc {
        let typeDoc = ast.isTypeExp(node.propType) ? this._typeDecl(node.propType) : empty();
        return concat(line(), this._visibility(node.visibility), this._propScope(node.scope), this._mutability(node.mutability), this._identifier(node.name), typeDoc, text(';'));
    }

    private _defaultValue(exp : ast.IExpression) : Doc {
        return concat(flexWS(), text('='), flexWS(), this._node(exp));
    }

    private _param(param : ast.ParameterDecl) : Doc {
        let typeDoc = ast.isTypeExp(param.paramType) ? this._typeDecl(param.paramType) : empty();
        let defaultDoc = ast.isExpression(param.defaultValue) ? this._defaultValue(param.defaultValue) : empty();
        return concat(this._identifier(param.name), typeDoc, defaultDoc);
    }

    private _methodParamList(paramlist : ast.ParameterDecl[]) : Doc {
        let inner = paramlist.map((param, i) => {
            if (i > 0)
                return concat(text(','), this._param(param));
            else
                return this._param(param);
        });
        return concat(text('('), ...inner, text(')'));
    }

    private _visibility(visibility : ast.Visibility) : Doc {
        return concat(flexWS(), visibility === 'public' ? flexWS() : text(visibility));
    }

    private _propScope(scope : ast.PropertyScope) : Doc {
        return concat(flexWS(), scope === 'class' ? text('static') : flexWS());
    }

    private _mutability(mutability : ast.Mutability) : Doc {
        return concat(flexWS(), text(mutability));
    }

    private _method(node : ast.MethodDecl) : Doc {
        let retTypeDoc = ast.isTypeExp(node.returnType) ? this._typeDecl(node.returnType) : flexWS();
        return concat(
            line(), this._visibility(node.visibility), this._propScope(node.scope), this._identifier(node.name), this._methodParamList(node.paramList), retTypeDoc, this._node(node.body)
        );
    }

    private _assign(node : ast.AssignmentExp) : Doc {
        return concat(
            this._node(node.lhs), text(' = '), this._node(node.exp), text(';')
        );
    }

    private _let(node : ast.LetExp) : Doc {
        return concat(
            text('let'), this._node(node.lhs), flexWS(), text('='), this._node(node.exp), text(';')
        );
    }

    private _typeDecl(node : ast.TypeExp) : Doc {
        return concat(flexWS(), text(':'), this._node(node));
    }

    private _stringType(node : ast.StringTypeExp) : Doc {
        return concat(flexWS(), text('string'));
    }

    private _scalarType(node : ast.ScalarTypeExp) : Doc {
        let typeName = node.name === 'integer' || node.name === 'double' ? 'number' : node.name;
        return concat(flexWS(), text(typeName));
    }

    private _refType(node : ast.RefTypeExp) : Doc {
        return this._identifier(node.name);
    }

    private _identifier(node : ast.Identifier) : Doc {
        return concat(flexWS(), text(node.name));
    }

    private _string(node : ast.StringExp) : Doc {
        let value = node.value.replace(/\'/g, "\\'");
        return text("'" + value + "'");
    }

    private _integer(node : ast.IntegerExp) : Doc {
        return text(node.value.toString());
    }

    private _double(node : ast.DoubleExp) : Doc {
        return text(node.value.toString());
    }

    private _boolean(node : ast.BooleanExp) : Doc {
        return text(node.value.toString());
    }

    private _objectKV(node : ast.ObjectExpKV, i : number = 0) : Doc {
        return concat(
            i > 0 ? text(',') : flexWS(), this._node(node.key), text(':'), this._node(node.value)
        );
    }

    private _object(node : ast.ObjectExp) : Doc {
        return concat(
            flexWS(), text('{'),
            ...(node.keyValList.map((kv, i) => nest(4, concat(line(), this._objectKV(kv, i))))),
            line(), text('}')
        );
    }

    private _if(node : ast.IfExp) : Doc {
        let elseBranch : Doc = flexWS();
        if (ast.isExpression(node.rhs)) {
            elseBranch = concat(
                flexWS(), text('else'), ast.isBlockExp(node.rhs) ? this._block(node.rhs) : nest(4, concat(line(), this._node(node.rhs)))
            );
        }
        return concat(
            text('if ('), this._node(node.cond), text(')'),
            ast.isBlockExp(node.lhs) ? this._node(node.lhs) : nest(4, concat(line(), this._node(node.lhs))),
            elseBranch
        );
    }

    private _return(node : ast.ReturnExp) : Doc {
        return concat(
            text('return'), flexWS(), this._node(node.exp), text(';')
        );
    }

    private _unary(node : ast.UnaryExp) : Doc {
        return concat(
            text('!'), this._node(node.rhs)
        );
    }

    private _binary(node : ast.BinaryExp) : Doc {
        return concat(
            text('('), this._node(node.lhs), text(` ${node.operator} `), this._node(node.rhs), text(')')
        );
    }

    private _member(node : ast.MemberExp) : Doc {
        return concat(this._node(node.head), text('.'), this._node(node.key));
    }

    private _funcall(node : ast.FuncallExp) : Doc {
        let params : Doc[] = [];
        node.paramList.forEach((param, i) => {
            if (i > 0) {
                params.push(text(", "));
            }
            params.push(this._node(node.paramList[i]));
        })
        return concat(this._node(node.function), text('('), ...params, text(')'));
    }

    private _new(node : ast.NewExp) : Doc {
        let params : Doc[] = [];
        node.paramList.forEach((param, i) => {
            if (i > 0) {
                params.push(text(", "));
            }
            params.push(this._node(node.paramList[i]));
        })
        return concat(text('new'), flexWS(), this._node(node.function), text('('), ...params, text(')'));
    }

    private _block(node : ast.BlockExp) : Doc {
        return concat(
            flexWS(), text('{'),
            ...node.exps.map((item) => nest(4, concat(line(), this._node(item)))),
            line(), text('}')
        );
    }

    private _throw(node : ast.ThrowExp) : Doc {
        return concat(
            flexWS(), text('throw'), this._node(node.value), text(';')
        );
    }
}

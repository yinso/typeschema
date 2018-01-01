"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
function isNode(arg) {
    return !!arg && arg.type !== undefined;
}
exports.isNode = isNode;
function identifier(name) {
    return { type: 'Identifier', name: name };
}
exports.identifier = identifier;
function isIdentifier(arg) {
    return !!arg && arg.type === 'Identifier' && arg.name !== undefined;
}
exports.isIdentifier = isIdentifier;
function stringExp(value) {
    return { type: 'StringExp', value: value };
}
exports.stringExp = stringExp;
function isStringExp(arg) {
    return !!arg && arg.type === 'StringExp' && typeof (arg.value) === 'string';
}
exports.isStringExp = isStringExp;
function integerExp(value) {
    return { type: 'IntegerExp', value: value };
}
exports.integerExp = integerExp;
function isIntegerExp(arg) {
    return !!arg && arg.type === 'IntegerExp' && typeof (arg.value) === 'number';
}
exports.isIntegerExp = isIntegerExp;
function doubleExp(value) {
    return { type: 'DoubleExp', value: value };
}
exports.doubleExp = doubleExp;
function isDoubleExp(arg) {
    return !!arg && arg.type === 'DoubleExp' && typeof (arg.value) === 'number';
}
exports.isDoubleExp = isDoubleExp;
function booleanExp(value) {
    return { type: 'BooleanExp', value: value };
}
exports.booleanExp = booleanExp;
function isBooleanExp(arg) {
    return !!arg && arg.type === 'BooleanExp' && typeof (arg.value) === 'boolean';
}
exports.isBooleanExp = isBooleanExp;
function nullExp() {
    return { type: 'NullExp' };
}
exports.nullExp = nullExp;
function isNullExp(arg) {
    return !!arg && arg.type === 'NullExp';
}
exports.isNullExp = isNullExp;
function regexExp(pattern, flags) {
    return { type: 'RegexExp', pattern: pattern, flags: flags };
}
exports.regexExp = regexExp;
function isRegexExp(arg) {
    return !!arg && arg.type === 'RegexExp' && typeof (arg.pattern) === 'string' && typeof (arg.flags) === 'string';
}
exports.isRegexExp = isRegexExp;
function isLiteralExp(arg) {
    return isStringExp(arg) || isIntegerExp(arg) || isDoubleExp(arg) || isBooleanExp(arg) || isNullExp(arg) || isRegexExp(arg);
}
exports.isLiteralExp = isLiteralExp;
function arrayExp(items) {
    return { type: 'ArrayExp', items: items };
}
exports.arrayExp = arrayExp;
function isArrayExp(arg) {
    return !!arg && (arg.type === 'ArrayExp') && isArrayOf(arg.items, isExpression);
}
exports.isArrayExp = isArrayExp;
function isObjectKeyExp(arg) {
    return isStringExp(arg) || isIdentifier(arg);
}
exports.isObjectKeyExp = isObjectKeyExp;
function objectExpKV(key, value) {
    return { type: 'ObjectExpKV', key: key, value: value };
}
exports.objectExpKV = objectExpKV;
function isObjectExpKV(arg) {
    return !!arg && arg.type === 'ObjectExpKV' && isObjectKeyExp(arg.key) && isExpression(arg.value);
}
exports.isObjectExpKV = isObjectExpKV;
function objectExp(keyValList) {
    return { type: 'ObjectExp', keyValList: keyValList };
}
exports.objectExp = objectExp;
function isArrayOf(arg, isType) {
    if (!(arg instanceof Array))
        return false;
    for (var i = 0; i < arg.length; ++i) {
        if (!isType(arg[i]))
            return false;
    }
    return true;
}
function isObjectExp(arg) {
    return !!arg && arg.type === 'ObjectExp' && isArrayOf(arg.keyValList, isObjectExpKV);
}
exports.isObjectExp = isObjectExp;
function isUnaryOperator(arg) {
    return arg === '!';
}
exports.isUnaryOperator = isUnaryOperator;
function unaryExp(operator, rhs) {
    return { type: 'UnaryExp', operator: operator, rhs: rhs };
}
exports.unaryExp = unaryExp;
function isUnaryExp(arg) {
    return !!arg && arg.type === 'UnaryExp' && isUnaryOperator(arg.operator);
}
exports.isUnaryExp = isUnaryExp;
function isBinaryOperator(arg) {
    var operators = ['+', '-', '*', '/', '%', '==', '!=', '>', '>=', '<', '<=', '.'];
    return operators.indexOf(arg) !== -1;
}
exports.isBinaryOperator = isBinaryOperator;
function binaryExp(operator, lhs, rhs) {
    return { type: 'BinaryExp', operator: operator, lhs: lhs, rhs: rhs };
}
exports.binaryExp = binaryExp;
function isBinaryExp(arg) {
    var res = !!arg && arg.type === 'BinaryExp' && isBinaryOperator(arg.operator) && isExpression(arg.lhs) && isExpression(arg.rhs);
    console.info('***************** isBinaryExp', res);
    return res;
}
exports.isBinaryExp = isBinaryExp;
function memberExp(head, key) {
    return { type: 'MemberExp', head: head, key: key };
}
exports.memberExp = memberExp;
function isMemberExp(arg) {
    return !!arg && arg.type === 'MemberExp' && isExpression(arg.head) && isIdentifier(arg.key);
}
exports.isMemberExp = isMemberExp;
function isAssignableExp(arg) {
    return isIdentifier(arg) || isMemberExp(arg);
}
exports.isAssignableExp = isAssignableExp;
function assignmentExp(name, exp) {
    return { type: 'AssignmentExp', lhs: name, exp: exp };
}
exports.assignmentExp = assignmentExp;
function isAssignmentExp(arg) {
    return !!arg && arg.type === 'AssignmentExp' && isAssignableExp(arg.name) && isExpression(arg.exp);
}
exports.isAssignmentExp = isAssignmentExp;
function ifExp(cond, lhs, rhs) {
    return { type: 'IfExp', cond: cond, lhs: lhs, rhs: rhs };
}
exports.ifExp = ifExp;
function isIfExp(arg) {
    var res = !!arg && arg.type === 'IfExp' && isExpression(arg.cond) && isExpression(arg.lhs) && isExpression(arg.rhs);
    console.log('^^^^^^^^^^^^^^^^^^^isIfExp:', res);
    return res;
}
exports.isIfExp = isIfExp;
function blockExp(exps) {
    return { type: 'BlockExp', exps: exps };
}
exports.blockExp = blockExp;
function isBlockExp(arg) {
    return !!arg && arg.type === 'BlockExp' && isArrayOf(arg.exps, isExpression);
}
exports.isBlockExp = isBlockExp;
function throwExp(value) {
    return { type: 'ThrowExp', value: value };
}
exports.throwExp = throwExp;
function isThrowExp(arg) {
    return !!arg && arg.type === 'ThrowExp' && isExpression(arg.value);
}
exports.isThrowExp = isThrowExp;
function catchClause(error, clause) {
    return { type: 'CatchClause', error: error, clause: clause };
}
exports.catchClause = catchClause;
function isCatchClause(arg) {
    return !!arg && arg.type === 'CatchClause' && isIdentifier(arg.error) && isExpression(arg.clause);
}
exports.isCatchClause = isCatchClause;
function tryCatchFinallyExp(tryClause, catchClause, finallyClause) {
    return {
        type: 'TryCatchFinallyExp',
        try: tryClause,
        catch: catchClause,
        finally: finallyClause
    };
}
exports.tryCatchFinallyExp = tryCatchFinallyExp;
function isTryCatchFinallyExp(arg) {
    return !!arg && arg.type === 'TryCatchFinallyExp' && isExpression(arg.try) && isCatchClause(arg.catch) && isExpression(arg.finally);
}
exports.isTryCatchFinallyExp = isTryCatchFinallyExp;
function funcallExp(func, paramList) {
    return { type: 'FuncallExp', function: func, paramList: paramList };
}
exports.funcallExp = funcallExp;
function isFuncallExp(arg) {
    var res = !!arg && arg.type === 'FuncallExp' && isExpression(arg.function) && isArrayOf(arg.paramList, isExpression);
    console.info('((((((((((((((( isFuncallExp', res);
    return res;
}
exports.isFuncallExp = isFuncallExp;
function isExpression(arg) {
    return isIdentifier(arg)
        || isLiteralExp(arg)
        || isArrayExp(arg)
        || isObjectExp(arg)
        || isUnaryExp(arg)
        || isBinaryExp(arg)
        || isMemberExp(arg)
        || isAssignmentExp(arg)
        || isIfExp(arg)
        || isBlockExp(arg)
        || isThrowExp(arg)
        || isTryCatchFinallyExp(arg)
        || isFuncallExp(arg);
}
exports.isExpression = isExpression;
function parameterDecl(name, paramType, defaultValue) {
    return { type: 'ParameterDecl', name: name, paramType: paramType, defaultValue: defaultValue };
}
exports.parameterDecl = parameterDecl;
function isParameterDecl(arg) {
    return !!arg && arg.type === 'ParameterDecl'
        && isIdentifier(arg.name)
        && (arg.paramType ? isParamTypeExp(arg.paramType) : true)
        && (arg.defaultValue ? isExpression(arg.defaultValue) : true);
}
exports.isParameterDecl = isParameterDecl;
function functionDecl(name, paramList, body) {
    return {
        type: 'FunctionDecl',
        name: name,
        paramList: paramList,
        body: body
    };
}
exports.functionDecl = functionDecl;
function isFunctionDecl(arg) {
    return !!arg && arg.type === 'FunctionDecl' && isIdentifier(arg.name) && isArrayOf(arg.paramList, isParameterDecl) && isExpression(arg.body);
}
exports.isFunctionDecl = isFunctionDecl;
function isVisibility(arg) {
    return arg === 'public' || arg === 'protected' || arg === 'private';
}
exports.isVisibility = isVisibility;
function isPropertyScope(arg) {
    return arg === 'class' || arg === 'instance';
}
exports.isPropertyScope = isPropertyScope;
function methodDecl(name, visibility, scope, paramList, body) {
    return {
        type: 'MethodDecl',
        visibility: visibility,
        scope: scope,
        name: name,
        paramList: paramList,
        body: body
    };
}
exports.methodDecl = methodDecl;
function isMethodDecl(arg) {
    return !!arg && arg.type === 'MethodDecl'
        && isVisibility(arg.visibility)
        && isPropertyScope(arg.scope)
        && isIdentifier(arg.name)
        && isArrayOf(arg.paramList, isParameterDecl)
        && isExpression(arg.body);
}
exports.isMethodDecl = isMethodDecl;
function classPropertyDecl(name, visibility, scope, value) {
    return {
        type: 'ClassPropertyDecl',
        visibility: visibility,
        scope: scope,
        name: name,
        value: value
    };
}
exports.classPropertyDecl = classPropertyDecl;
function isClassPropertyDecl(arg) {
    return !!arg
        && arg.type === 'ClassPropertyDecl'
        && isVisibility(arg.visibility)
        && isPropertyScope(arg.scope)
        && isIdentifier(arg.name)
        && isFunctionDecl(arg.value);
}
exports.isClassPropertyDecl = isClassPropertyDecl;
function classDecl(name, properties) {
    return { type: 'ClassDecl', name: name, properties: properties };
}
exports.classDecl = classDecl;
function isClassDecl(arg) {
    return !!arg && arg.type === 'ClassDecl' && isIdentifier(arg.name) && isArrayOf(arg.properties, isClassPropertyDecl);
}
exports.isClassDecl = isClassDecl;
function importExp(alias, from) {
    return { type: 'ImportExp', alias: alias, from: from };
}
exports.importExp = importExp;
function isImportExp(arg) {
    return !!arg && arg.type === 'ImportExp' && isIdentifier(arg.alias) && isStringExp(arg.from);
}
exports.isImportExp = isImportExp;
function isExportable(arg) {
    return isClassDecl(arg) || isFunctionDecl(arg) || isIdentifier(arg);
}
exports.isExportable = isExportable;
function exportExp(value) {
    return { type: 'ExportExp', value: value };
}
exports.exportExp = exportExp;
function isExportExp(arg) {
    return !!arg && arg.type === 'ExportExp' && isExportable(arg.value);
}
exports.isExportExp = isExportExp;
function isTypeExp(arg) {
    return isScalarTypeExp(arg) || isArrayTypeExp(arg) || isObjectTypeExp(arg) || isFunctionTypeExp(arg);
}
exports.isTypeExp = isTypeExp;
function isBuiltinType(arg) {
    return arg === 'string' || arg === 'integer' || arg === 'double' || arg === 'boolean' || arg === 'null';
}
exports.isBuiltinType = isBuiltinType;
function scalarTypeExp(name) {
    return { type: 'ScalarTypeExp', name: name };
}
exports.scalarTypeExp = scalarTypeExp;
function isScalarTypeExp(arg) {
    return !!arg && arg.type === 'ScalarTypeExp' && isBuiltinType(arg.name);
}
exports.isScalarTypeExp = isScalarTypeExp;
function arrayTypeExp(inner) {
    return { type: 'ArrayTypeExp', inner: inner };
}
exports.arrayTypeExp = arrayTypeExp;
function isArrayTypeExp(arg) {
    return !!arg && arg.type === 'ArrayTypeExp' && isTypeExp(arg.inner);
}
exports.isArrayTypeExp = isArrayTypeExp;
function objectTypeExpKV(key, val, optional) {
    if (optional === void 0) { optional = false; }
    return { type: 'ObjectTypeExpKV', key: key, val: val, optional: optional };
}
exports.objectTypeExpKV = objectTypeExpKV;
function isObjectTypeExpKV(arg) {
    return !!arg && arg.type === 'ObjectTypeExpKV' && isObjectKeyExp(arg.key) && isTypeExp(arg.val) && util_1.isBoolean(arg.optional);
}
exports.isObjectTypeExpKV = isObjectTypeExpKV;
function objectTypeExp(properties) {
    return { type: 'ObjectTypeExp', properties: properties };
}
exports.objectTypeExp = objectTypeExp;
function isObjectTypeExp(arg) {
    return !!arg && arg.type == 'ObjectTypeExp' && isArrayOf(arg.properties, isObjectTypeExpKV);
}
exports.isObjectTypeExp = isObjectTypeExp;
function paramTypeExp(name, paramType) {
    return { type: 'ParamTypeExp', name: name, paramType: paramType };
}
exports.paramTypeExp = paramTypeExp;
function isParamTypeExp(arg) {
    return !!arg && arg.type === 'ParamTypeExp' && isIdentifier(arg.name) && isTypeExp(arg.paramType);
}
exports.isParamTypeExp = isParamTypeExp;
function functionTypeExp(parameters, returnType) {
    return { type: 'FunctionTypeExp', parameters: parameters, returnType: returnType };
}
exports.functionTypeExp = functionTypeExp;
function isFunctionTypeExp(arg) {
    return !!arg && arg.type === 'FunctionTypeExp' && isArrayOf(arg.parameters, isParamTypeExp) && isTypeExp(arg.returnType);
}
exports.isFunctionTypeExp = isFunctionTypeExp;
classDecl(identifier('SSN'), [
    classPropertyDecl(// private _v: string;
    identifier('_v'), 'private', 'instance', {
        $type: identifier('string')
    }),
    classPropertyDecl(identifier('constructor'), 'public', 'class', functionDecl(identifier('constructor'), [
        parameterDecl(identifier('v'))
    ], blockExp([
        assignmentExp(memberExp(identifier('this'), identifier('_v')), identifier('v'))
    ])))
]);
//# sourceMappingURL=formatter.js.map
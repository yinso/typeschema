import { isRegExp, isNull, isNumber , isBoolean, isString } from "util";
import { Map } from "es6-shim";

export interface Node {
    type: string;
}

export function isNode(arg : any) : arg is Node {
    return !!arg && arg.type !== undefined;
}

export interface Identifier extends Node {
    readonly type : 'Identifier';
    readonly name: string;
}

export function identifier(name : string) : Identifier {
    return { type: 'Identifier', name: name };
}

export function isIdentifier(arg: any) : arg is Identifier {
    return !!arg && arg.type === 'Identifier' && arg.name !== undefined;
}

export interface StringExp extends Node {
    readonly type : 'StringExp';
    readonly value: string;
}

export function stringExp(value: string) : StringExp {
    return { type: 'StringExp', value: value };
}

export function isStringExp(arg: any) : arg is StringExp {
    return !!arg && arg.type === 'StringExp' && typeof(arg.value) === 'string';
}

export interface IntegerExp extends Node {
    readonly type : 'IntegerExp';
    readonly value: number;
}

export function integerExp(value : number) : IntegerExp {
    return { type: 'IntegerExp', value: value };
}

export function isIntegerExp(arg: any) : arg is IntegerExp {
    return !!arg && arg.type === 'IntegerExp' && typeof(arg.value) === 'number';
}

export interface DoubleExp extends Node {
    readonly type : 'DoubleExp';
    readonly value : number;
}

export function doubleExp(value: number) : DoubleExp {
    return { type : 'DoubleExp', value: value };
}

export function isDoubleExp(arg: any) : arg is DoubleExp {
    return !!arg && arg.type === 'DoubleExp' && typeof(arg.value) === 'number';
}

export interface BooleanExp extends Node {
    readonly type : 'BooleanExp';
    readonly value : boolean;
}

export function booleanExp(value:  boolean) : BooleanExp {
    return { type: 'BooleanExp', value: value };
}

export function isBooleanExp(arg: any) : arg is BooleanExp {
    return !!arg && arg.type === 'BooleanExp' && typeof(arg.value) === 'boolean';
}

export interface NullExp extends Node {
    readonly type : 'NullExp';
}

export function nullExp() : NullExp {
    return { type: 'NullExp' };
}

export function isNullExp(arg: any) : arg is NullExp {
    return !!arg && arg.type === 'NullExp';
}

export interface RegexExp extends Node {
    readonly type : 'RegexExp';
    readonly pattern : string;
    readonly flags : string;
}

export function regexExp(pattern: string, flags : string = '') : RegexExp {
    return { type: 'RegexExp', pattern: pattern, flags: flags };
}

export function isRegexExp(arg : any) : arg is RegexExp {
    return !!arg && arg.type === 'RegexExp' && typeof(arg.pattern) === 'string' && typeof(arg.flags) === 'string';
}

export type LiteralExp = StringExp | IntegerExp | DoubleExp | BooleanExp | NullExp | RegexExp ;

export function isLiteralExp(arg: any) : arg is LiteralExp {
    return isStringExp(arg) || isIntegerExp(arg) || isDoubleExp(arg) || isBooleanExp(arg) || isNullExp(arg) || isRegexExp(arg);
}

export interface ArrayExp extends Node {
    readonly type: 'ArrayExp';
    readonly items: IExpression[];
}

export function arrayExp(items: IExpression[]) : ArrayExp {
    return { type: 'ArrayExp', items: items };
}

export function isArrayExp(arg : any) : arg is ArrayExp {
    return !!arg && (arg.type === 'ArrayExp') && isArrayOf(arg.items, isExpression);
}

export type ObjectKeyExp = StringExp | Identifier;

export function isObjectKeyExp(arg : any) : arg is ObjectKeyExp {
    return isStringExp(arg) || isIdentifier(arg);
}

export interface ObjectExpKV extends Node {
    readonly type: 'ObjectExpKV';
    readonly key: ObjectKeyExp;
    readonly value: IExpression;
}

export function objectExpKV(key : ObjectKeyExp, value : IExpression) : ObjectExpKV {
    return { type: 'ObjectExpKV', key: key, value: value };
}

export function isObjectExpKV(arg : any) : arg is ObjectExpKV {
    return !!arg && arg.type === 'ObjectExpKV' && isObjectKeyExp(arg.key) && isExpression(arg.value);
}

export interface ObjectExp extends Node {
    readonly type: 'ObjectExp';
    readonly keyValList: ObjectExpKV[];
}

export function objectExp(keyValList : ObjectExpKV[]) : ObjectExp {
    return { type: 'ObjectExp', keyValList : keyValList };
}

function isArrayOf<T>(arg : any, isType: (item : any) => item is T) : arg is T[] {
    if (!(arg instanceof Array))
        return false;
    for (var i = 0; i < arg.length; ++i) {
        if (!isType(arg[i]))
            return false;
    }
    return true;
}

export function isObjectExp(arg : any) : arg is ObjectExp {
    return !!arg && arg.type === 'ObjectExp' && isArrayOf(arg.keyValList, isObjectExpKV);
}

export type UnaryOperators = '!';

export function isUnaryOperator(arg : any) : arg is UnaryOperators {
    return arg === '!';
}

export interface UnaryExp extends Node {
    readonly type: 'UnaryExp';
    readonly operator: '!';
    readonly rhs: IExpression;
}

export function unaryExp(operator : UnaryOperators, rhs : IExpression) : UnaryExp {
    return { type: 'UnaryExp', operator: operator, rhs: rhs };
}

export function isUnaryExp(arg : any) : arg is UnaryExp {
    return !!arg && arg.type === 'UnaryExp' && isUnaryOperator(arg.operator);
}

export interface ReturnExp extends Node {
    readonly type: 'ReturnExp';
    readonly exp ?: IExpression;
}

export function returnExp(exp ?: IExpression) : ReturnExp {
    return { type: 'ReturnExp', exp: exp };
}

export function isReturnExp(arg : any) : arg is ReturnExp {
    return !!arg && arg.type === 'ReturnExp' && (arg.exp ? isExpression(arg.exp) : true);
}

export type BinaryOperators = '+' | '-' | '*' | '/' | '%' | '==' | '!=' | '>' | '>=' | '<' | '<=' | '.'; // member exp is here...

export function isBinaryOperator(arg : any) : arg is BinaryOperators {
    let operators = ['+', '-', '*', '/', '%', '==', '!=', '>', '>=', '<', '<=', '.'];
    return operators.indexOf(arg) !== -1;
}

export interface BinaryExp extends Node {
    readonly type: 'BinaryExp';
    readonly operator: BinaryOperators;
    readonly lhs: IExpression;
    readonly rhs: IExpression;
}

export function binaryExp(operator: BinaryOperators, lhs: IExpression, rhs: IExpression) : BinaryExp {
    return { type: 'BinaryExp', operator: operator, lhs: lhs, rhs: rhs };
}

export function isBinaryExp(arg : any) : arg is BinaryExp {
    return !!arg && arg.type === 'BinaryExp' && isBinaryOperator(arg.operator) && isExpression(arg.lhs) && isExpression(arg.rhs);
}

export interface MemberExp extends Node {
    readonly type: 'MemberExp';
    readonly head: IExpression;
    readonly key: Identifier;
}

export function memberExp(head : IExpression, key: Identifier) : MemberExp {
    return { type: 'MemberExp', head: head, key: key };
}

export function isMemberExp(arg : any) : arg is MemberExp {
    return !!arg && arg.type === 'MemberExp' && isExpression(arg.head) && isIdentifier(arg.key);
}

export type AssignableExp = Identifier | MemberExp;

export function isAssignableExp(arg : any) : arg is AssignableExp {
    return isIdentifier(arg) || isMemberExp(arg);
}

export interface AssignmentExp extends Node {
    readonly type: 'AssignmentExp';
    readonly lhs: AssignableExp;
    readonly exp: IExpression;
}

export function assignmentExp(lhs : AssignableExp, exp : IExpression) : AssignmentExp {
    return { type: 'AssignmentExp', lhs: lhs, exp : exp };
}

export function isAssignmentExp(arg : any) : arg is AssignmentExp {
    return !!arg && arg.type === 'AssignmentExp' && isAssignableExp(arg.lhs) && isExpression(arg.exp);
}

export interface LetExp extends Node {
    readonly type: 'LetExp';
    readonly lhs: Identifier;
    readonly exp: IExpression;
}

export function letExp(lhs : Identifier, exp : IExpression) : LetExp {
    return { type: 'LetExp', lhs: lhs, exp : exp };
}

export function isLetExp(arg : any) : arg is LetExp {
    return !!arg && arg.type === 'LetExp' && isIdentifier(arg.lhs) && isExpression(arg.exp);
}

export interface IfExp extends Node {
    readonly type: 'IfExp';
    readonly cond: IExpression;
    readonly lhs: IExpression;
    readonly rhs ?: IExpression;
}

export function ifExp(cond: IExpression, lhs: IExpression, rhs ?: IExpression) : IfExp {
    return { type: 'IfExp', cond: cond, lhs: lhs, rhs: rhs };
}

export function isIfExp(arg : any) : arg is IfExp {
    return !!arg && arg.type === 'IfExp'
        && isExpression(arg.cond)
        && isExpression(arg.lhs)
        && (arg.rhs ? isExpression(arg.rhs) : true);
}

export interface BlockExp extends Node {
    readonly type: 'BlockExp';
    readonly exps: IExpression[];
}

export function blockExp(exps: IExpression[]) : BlockExp {
    return { type: 'BlockExp', exps: exps };
}

export function isBlockExp(arg : any) : arg is BlockExp {
    return !!arg && arg.type === 'BlockExp' && isArrayOf(arg.exps, isExpression);
}

export interface ThrowExp extends Node {
    readonly type: 'ThrowExp';
    readonly value: IExpression;
}

export function throwExp(value : IExpression) : ThrowExp {
    return { type: 'ThrowExp', value: value };
}

export function isThrowExp(arg : any) : arg is ThrowExp {
    return !!arg && arg.type === 'ThrowExp' && isExpression(arg.value);
}

export interface CatchClause extends Node {
    readonly type: 'CatchClause';
    readonly error: Identifier;
    readonly clause: IExpression;
}

export function catchClause(error: Identifier, clause: IExpression) : CatchClause {
    return { type: 'CatchClause', error: error, clause : clause };
}

export function isCatchClause(arg : any) : arg is CatchClause {
    return !!arg && arg.type === 'CatchClause' && isIdentifier(arg.error) && isExpression(arg.clause);
}

export interface TryCatchFinallyExp extends Node {
    readonly type: 'TryCatchFinallyExp';
    readonly try: IExpression;
    readonly catch: CatchClause;
    readonly finally ?: IExpression;
}

export function tryCatchFinallyExp(tryClause : IExpression, catchClause: CatchClause, finallyClause ?: IExpression) : TryCatchFinallyExp {
    return {
        type: 'TryCatchFinallyExp',
        try: tryClause,
        catch: catchClause,
        finally: finallyClause
    };
}

export function isTryCatchFinallyExp(arg : any) : arg is TryCatchFinallyExp {
    return !!arg && arg.type === 'TryCatchFinallyExp' && isExpression(arg.try) && isCatchClause(arg.catch) && isExpression(arg.finally);
}

export interface FuncallExp extends Node {
    readonly type: 'FuncallExp';
    readonly function: IExpression;
    readonly paramList: IExpression[];
}

export function funcallExp(func: IExpression, paramList: IExpression[]) : FuncallExp {
    return { type: 'FuncallExp', function: func, paramList: paramList };
}

export function isFuncallExp(arg : any) : arg is FuncallExp {
    return !!arg && arg.type === 'FuncallExp' && isExpression(arg.function) && isArrayOf(arg.paramList, isExpression);
}

export interface NewExp extends Node {
    readonly type: 'NewExp';
    readonly function: IExpression;
    readonly paramList: IExpression[];
}

export function newExp(func: IExpression, paramList: IExpression[]) : NewExp {
    return { type: 'NewExp', function: func, paramList: paramList };
}

export function isNewExp(arg : any) : arg is NewExp {
    return !!arg && arg.type === 'NewExp' && isExpression(arg.function) && isArrayOf(arg.paramList, isExpression);
}

export type IExpression =
    Identifier
    | LiteralExp
    | ObjectExp
    | ArrayExp
    | UnaryExp
    | ReturnExp
    | BinaryExp
    | MemberExp
    | AssignmentExp
    | LetExp
    | IfExp
    | BlockExp
    | ThrowExp
    | TryCatchFinallyExp
    | FuncallExp
    | NewExp;

export function isExpression(arg : any) : arg is IExpression {
    return isIdentifier(arg)
        || isLiteralExp(arg)
        || isArrayExp(arg)
        || isObjectExp(arg)
        || isUnaryExp(arg)
        || isReturnExp(arg)
        || isBinaryExp(arg)
        || isMemberExp(arg)
        || isAssignmentExp(arg)
        || isLetExp(arg)
        || isIfExp(arg)
        || isBlockExp(arg)
        || isThrowExp(arg)
        || isTryCatchFinallyExp(arg)
        || isFuncallExp(arg)
        || isNewExp(arg);
}

export interface ParameterDecl extends Node {
    type: 'ParameterDecl';
    name: Identifier;
    paramType ?: TypeExp;
    defaultValue ?: IExpression;
}

export function parameterDecl(name : Identifier, paramType ?: TypeExp, defaultValue ?: IExpression) : ParameterDecl {
    return { type: 'ParameterDecl', name: name , paramType : paramType, defaultValue : defaultValue };
}

export function isParameterDecl(arg : any) : arg is ParameterDecl {
    return !!arg && arg.type === 'ParameterDecl' 
        && isIdentifier(arg.name) 
        && (arg.paramType ? isTypeExp(arg.paramType) : true)
        && (arg.defaultValue ? isExpression(arg.defaultValue) : true);
}

export interface FunctionDecl extends Node {
    type: 'FunctionDecl';
    name: Identifier;
    paramList : ParameterDecl[];
    returnType ?: TypeExp;
    body: IExpression;
}

export function functionDecl(name: Identifier, paramList: ParameterDecl[], body: IExpression) : FunctionDecl {
    return {
        type: 'FunctionDecl',
        name: name,
        paramList: paramList,
        body: body
    };
}

export function isFunctionDecl(arg : any) : arg is FunctionDecl {
    return !!arg && arg.type === 'FunctionDecl' && isIdentifier(arg.name) && isArrayOf(arg.paramList, isParameterDecl) && isExpression(arg.body);
}

export type Visibility = 'public' | 'protected' | 'private';

export function isVisibility(arg : any) : arg is Visibility {
    return arg === 'public' || arg === 'protected' || arg === 'private';
}

export type PropertyScope = 'class' | 'instance';

export function isPropertyScope(arg : any) : arg is PropertyScope {
    return arg === 'class' || arg === 'instance';
}

export type Mutability = 'readonly' | 'const' | 'mutable';

export function isMutability(arg : any) : arg is Mutability {
    return arg === 'readonly' || arg === 'const' || arg === 'mutable';
}

export interface ClassPropertyDecl extends Node {
    type: 'ClassPropertyDecl';
    visibility: Visibility;
    scope: PropertyScope;
    mutability: Mutability;
    name: Identifier;
    propType ?: TypeExp;
}

export function classPropertyDecl(name: Identifier, visibility: Visibility, scope: PropertyScope, mutability: Mutability, propType ?: TypeExp) : ClassPropertyDecl {
    return {
        type: 'ClassPropertyDecl',
        visibility: visibility,
        scope: scope,
        mutability: mutability,
        name: name,
        propType: propType
    };
}

export function isClassPropertyDecl(arg : any) : arg is ClassPropertyDecl {
    return !!arg
        && arg.type === 'ClassPropertyDecl'
        && isVisibility(arg.visibility)
        && isPropertyScope(arg.scope)
        && isMutability(arg.mutability)
        && isIdentifier(arg.name)
        && (arg.propType ? isTypeExp(arg.propType) : true);
}

export interface MethodDecl extends ClassPropertyDecl {
    paramList: ParameterDecl[];
    returnType ?: TypeExp;
    body: IExpression;
}

export function methodDecl(name: Identifier, visibility : Visibility, scope: PropertyScope, mutability: Mutability, paramList: ParameterDecl[], body: IExpression, returnType ?: TypeExp) : MethodDecl {
    return {
        type: 'ClassPropertyDecl',
        visibility: visibility,
        scope: scope,
        mutability: mutability,
        name: name,
        paramList: paramList,
        returnType: returnType,
        body: body
    };
}

export function isMethodDecl(arg : any) : arg is MethodDecl {
    return isClassPropertyDecl(arg)
        && isArrayOf((<any>arg).paramList, isParameterDecl)
        && ((<any>arg).returnType ? isTypeExp((<any>arg).returnType) : true)
        && isExpression((<any>arg).body);
}

export interface ClassDecl extends Node {
    type: 'ClassDecl';
    name : Identifier;
    properties: ClassPropertyDecl[];
}

export function classDecl(name: Identifier, properties: ClassPropertyDecl[]) : ClassDecl {
    return { type: 'ClassDecl', name: name, properties: properties };
}

export function isClassDecl(arg : any) : arg is ClassDecl {
    return !!arg && arg.type === 'ClassDecl' && isIdentifier(arg.name) && isArrayOf(arg.properties, isClassPropertyDecl);
}

export interface ImportExp {
    type: 'ImportExp';
    alias: Identifier;
    from: StringExp;
}

export function importExp(alias: Identifier, from: StringExp) : ImportExp {
    return { type: 'ImportExp', alias: alias, from: from };
}

export function isImportExp(arg : any) : arg is ImportExp {
    return !!arg && arg.type === 'ImportExp' && isIdentifier(arg.alias) && isStringExp(arg.from);
}

export type Exportable = ClassDecl | FunctionDecl | Identifier;

export function isExportable(arg : any) : arg is Exportable {
    return isClassDecl(arg) || isFunctionDecl(arg) || isIdentifier(arg);
}

export interface ExportExp {
    type: 'ExportExp';
    value: Exportable;
}

export function exportExp(value : Exportable) : ExportExp {
    return { type: 'ExportExp', value: value };
}

export function isExportExp(arg : any) : arg is ExportExp {
    return !!arg && arg.type === 'ExportExp' && isExportable(arg.value);
}

// dealing with types!!!
export type TypeExp = ScalarTypeExp | ArrayTypeExp | ObjectTypeExp | FunctionTypeExp | RefTypeExp | StringTypeExp;

export function isTypeExp(arg : any) : arg is TypeExp {
    return isScalarTypeExp(arg)
        || isArrayTypeExp(arg)
        || isObjectTypeExp(arg)
        || isFunctionTypeExp(arg)
        || isRefTypeExp(arg)
        || isStringTypeExp(arg);
}

export type BuiltinType = 'string' | 'integer' | 'double' | 'boolean' | 'null'; // these are types that won't get changed.

export function isBuiltinType(arg : any) : arg is BuiltinType {
    return arg === 'string' || arg === 'integer' || arg === 'double' || arg === 'boolean' || arg === 'null';
}

export interface StringTypeExp extends Node {
    type: 'StringTypeExp';
    name ?: Identifier;
    pattern ?: PatternConstraint;
    minLength ?: MinLengthConstraint;
    maxLength ?: MaxLengthConstraint;
}

export function stringTypeExp(args : {name ?: Identifier, pattern ?: PatternConstraint, minLength ?: MinLengthConstraint, maxLength ?: MaxLengthConstraint } = {}) : StringTypeExp {
    return { type: 'StringTypeExp', ...args };
}

export function isStringTypeExp(arg : any) : arg is StringTypeExp {
    return !!arg && arg.type === 'StringTypeExp'
        && (arg.name ? isIdentifier(arg.name) : true)
        && (arg.pattern ? isPatternConstraint(arg.pattern) : true)
        && (arg.minLength ? isMinLengthConstraint(arg.minInclusive) : true)
        && (arg.maxLength ? isMaxLengthConstraint(arg.maxLength) : true);
}

export interface ScalarTypeExp extends Node {
    type: 'ScalarTypeExp';
    name: BuiltinType;
}

export function scalarTypeExp(name : BuiltinType) : ScalarTypeExp {
    return { type: 'ScalarTypeExp', name: name };
}

export function isScalarTypeExp(arg : any) : arg is ScalarTypeExp {
    return !!arg && arg.type === 'ScalarTypeExp' && isBuiltinType(arg.name);
}

export interface ArrayTypeExp extends Node {
    type: 'ArrayTypeExp';
    inner: TypeExp;
}

export function arrayTypeExp(inner : TypeExp) : ArrayTypeExp {
    return { type : 'ArrayTypeExp', inner : inner }; 
}

export function isArrayTypeExp(arg : any) : arg is ArrayTypeExp {
    return !!arg && arg.type === 'ArrayTypeExp' && isTypeExp(arg.inner);
}

export interface ObjectTypeExpKV extends Node {
    type: 'ObjectTypeExpKV',
    key: ObjectKeyExp;
    val: TypeExp;
    optional: boolean;
}

export function objectTypeExpKV(key: ObjectKeyExp, val: TypeExp, optional : boolean = false) : ObjectTypeExpKV {
    return { type:  'ObjectTypeExpKV', key: key, val: val, optional: optional };
} 

export function isObjectTypeExpKV(arg : any) : arg is ObjectTypeExpKV {
    return !!arg && arg.type === 'ObjectTypeExpKV' && isObjectKeyExp(arg.key) && isTypeExp(arg.val) && isBoolean(arg.optional);
}

export interface ObjectTypeExp extends Node {
    type: 'ObjectTypeExp';
    properties: ObjectTypeExpKV[];
}

export function objectTypeExp(properties: ObjectTypeExpKV[]) : ObjectTypeExp {
    return { type: 'ObjectTypeExp', properties: properties };
}

export function isObjectTypeExp(arg : any) : arg is ObjectTypeExp {
    return !!arg && arg.type == 'ObjectTypeExp' && isArrayOf(arg.properties, isObjectTypeExpKV);
}

export interface ParamTypeExp {
    type: 'ParamTypeExp';
    name: Identifier;
    paramType: TypeExp;
}

export function paramTypeExp(name: Identifier, paramType: TypeExp) : ParamTypeExp {
    return { type: 'ParamTypeExp', name: name, paramType: paramType };
}

export function isParamTypeExp(arg : any) : arg is ParamTypeExp {
    return !!arg && arg.type === 'ParamTypeExp' && isIdentifier(arg.name) && isTypeExp(arg.paramType);
}

export interface FunctionTypeExp {
    type: 'FunctionTypeExp';
    parameters: ParamTypeExp[];
    returnType: TypeExp;
}

export function functionTypeExp(parameters: ParamTypeExp[], returnType : TypeExp) : FunctionTypeExp {
    return { type: 'FunctionTypeExp', parameters: parameters, returnType: returnType };
}

export function isFunctionTypeExp(arg : any) : arg is FunctionTypeExp {
    return !!arg && arg.type === 'FunctionTypeExp' && isArrayOf(arg.parameters, isParamTypeExp) && isTypeExp(arg.returnType);
}

export interface RefTypeExp {
    type: 'RefTypeExp';
    name: Identifier;
}

export function refTypeExp(name: Identifier) : RefTypeExp {
    return { type: 'RefTypeExp', name: name };
}

export function isRefTypeExp(arg : any) : arg is RefTypeExp {
    return !!arg && arg.type === 'RefTypeExp' && isIdentifier(arg.name);
}

export interface PatternConstraint extends Node {
    type: 'PatternConstraint';
    pattern: string;
    flags: string;
}

export function patternConstraint(pattern: string, flags : string = '') : PatternConstraint {
    return { type: 'PatternConstraint', pattern: pattern, flags: flags };
}

export function isPatternConstraint(arg : any) : arg is PatternConstraint {
    return !!arg && arg.type === 'PatternConstraint' && isString(arg.pattern) && isString(arg.flags);
}

export interface MinLengthConstraint extends Node {
    type: 'MinLengthConstraint';
    minLength: number;
    inclusive: boolean;
}

export function minLengthConstraint(minLength: number, inclusive: boolean = false) : MinLengthConstraint {
    return { type: 'MinLengthConstraint', minLength: minLength, inclusive: inclusive };
}

export function isMinLengthConstraint(arg : any) : arg is MinLengthConstraint {
    return !!arg && arg.type === 'MinLengthConstraint' && isNumber(arg.minLength) && isBoolean(arg.inclusive);
}

export interface MaxLengthConstraint extends Node {
    type: 'MaxLengthConstraint';
    maxLength: number;
    inclusive: boolean;
}

export function maxLengthConstraint(maxLength: number, inclusive: boolean = false) : MaxLengthConstraint {
    return { type: 'MaxLengthConstraint', maxLength: maxLength, inclusive: inclusive };
}

export function isMaxLengthConstraint(arg : any) : arg is MinLengthConstraint {
    return !!arg && arg.type === 'MaxLengthConstraint' && isNumber(arg.maxLength) && isBoolean(arg.inclusive);
}

export type Constraint =
    PatternConstraint
    | MinLengthConstraint
    | MaxLengthConstraint;

export function isConstraint(arg : any) : arg is Constraint {
    return isPatternConstraint(arg)
        || isMinLengthConstraint(arg)
        || isMaxLengthConstraint(arg);
}

// **** need to have environments. // there are actually 2 environments needed, one for type, and one for expressions.

// should we make use of identifier as the type?
export class Environment<T> {
    _inner : { [key: string]: T; }; // using Object for simplified equality comparison.
    _prev ?: Environment<T>;
    constructor(prev ?: Environment<T>) {
        this._inner = {};
        this._prev = prev;
    }

    has(key: Identifier) : boolean {
        if (this._inner.hasOwnProperty(key.name)) {
            return true;
        } else if (this._prev) {
            return this._prev.has(key);
        } else {
            return false;
        }
    }

    get(key: Identifier) : T {
        if (this._inner.hasOwnProperty(key.name)) {
            return this._inner[key.name];
        } else if (this._prev) {
            return this._prev.get(key);
        } else {
            throw new Error(`UnknownIdentifer: ${key.name}`);
        }
    }

    del(key: Identifier) : void {
        delete this._inner[key.name];
    }

    set(key: Identifier, val: T) : T {
        this._inner[key.name] = val;
        return val;
    }

    define(key: Identifier, val: T) : T {
        if (this._inner.hasOwnProperty(key.name)) {
            throw new Error(`DuplicateIdentifier: ${key.name}`);
        }
        this._inner[key.name] = val;
        return val;
    }

    pushEnv() : Environment<T> {
        return new Environment<T>(this);
    }
}


// DefineTypeExp
export interface DefineTypeExp extends Node {
    type: 'DefineTypeExp';
    name: Identifier;
    typeValue: TypeExp;
}

export function defineTypeExp(name: Identifier, typeValue: TypeExp ) : DefineTypeExp {
    return { type: 'DefineTypeExp', name: name, typeValue : typeValue };
}

export function isDefineTypeExp(arg : any) : arg is DefineTypeExp {
    return !!arg && arg.type === 'DefineTypeExp' && isIdentifier(arg.name) && isTypeExp(arg.typeValue);
}

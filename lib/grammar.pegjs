{
  var T = require('./old-ast');
  var map = new T.TypeMap();
  var ast = require('./ast');
  var env = new ast.Environment(); // we will use this as the typed map.
  var helper = require('./grammar-helper');
}

start =
  _ decls:TypeDeclaration+ _ {
    /*
    decls.forEach(function (decl) {
      map.declare(decl.typeName, decl.typeExp);
    });
    return map;
    //*/
    return decls;
  };

/**
type SSN = (a: string) where a.match(/.../) and a.length >= x and a.length <= 5
type Name = (a: string) where a.match(/\W+/)
type Natural = (a: integer) where a > 0
type Person = {
  firstName: Name;
  middleName ?: Name;
  lastName: Name;
  ssn: SSN;
  age: Natural;
}
*/
TypeDeclaration =
  'type' _ name:Identifier _ '=' _ exp:TypeExpression _ {
    env.define(name, exp);
    return { name : name , exp : exp }; // if this is the case we aren't going to take in the identifier at the type level...!!!
    //return new T.TypeDeclaration(name, exp)
  };

TypeExpression =
  StringTypeExpression;

StringTypeExpression =
  '(' _ varName:Identifier _ ':' _ 'string' _ ')' _ _ constraints:StringTypeRefinmentList _ {
    return helper.makeStringType(varName, constraints);
  };

StringTypeRefinmentList =
  // you can only specify one of... I guess
  'where' _ head:StringTypeRefinementItem _ items:('and' _ item:StringTypeRefinementItem { return item; })* {
    return [ head ].concat(items);
  }
  ;

StringTypeRefinementItem =
  PatternConstraint
/ MinLengthConstraint
/ MaxLengthConstraint
  ;

PatternConstraint =
  varName:Identifier _ '=~' _ regExp:RegExp _ {
    return { type: 'PatternConstraint' , pattern: regExp.source , flags: regExp.flags, varName : varName };
  };

MinLengthConstraint =
  varName:Identifier _ '.' _ 'length' op:('<' / '<=') _ minLength:Integer _ {
    return { type: 'MinLengthConstraint', minLength: minLength, inclusive: op == '<=' , varName : varName };
  };

MaxLengthConstraint =
  varName:Identifier _ '.' _ 'length' op:('>' / '>=') _ maxLength:Integer _ {
    return { type: 'MaxLengthConstraint', maxLength: maxLength, inclusive: op == '>=' , varName: varName };
  };

//ObjectTypeExp =
//  '{' _ kvs:ObjectTypeKeyVal* _ '}' _ { return new T.ObjectType(kvs); };

//ObjectTypeKeyVal =
//  key:Identifier _ ':' _ val:TypeExpression _ ';'? _ { return new T.ObjectTypeKeyVal(key, val, true); }
//  / key:Identifier _ '?:' _ val:TypeExpression _ ';'? _ { return new T.ObjectTypeKeyVal(key, val, false); }

Identifier =
  c1:[a-zA-Z_] cRest:[a-zA-Z0-9_]* { return c1 + cRest.join(''); };

RegExp =
  '/' chars:RegExpChar* '/' { return new RegExp(chars.join('')) };

RegExpChar = 
  '\\/'
  / [^\/]
  ;

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*

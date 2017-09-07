{
  var T = require('./ast');
  var map = new T.TypeMap();
}

start =
  _ decls:TypeDeclaration+ _ {
    decls.forEach(function (decl) {
      map.declare(decl.typeName, decl.typeExp);
    });
    return map;
  };

TypeDeclaration =
  'type' _ name:Identifier _ '=' _ exp:TypeExpression _ { return new T.TypeDeclaration(name, exp) };

TypeExpression =
  'string' _ props:StringTypeRefinement? _ { return new T.StringType(props || []); }
  / ObjectTypeExp
  / id:Identifier _ { return new T.RefType(id)}

StringTypeRefinement =
  'with' _ '{' _ props:StringRefinementProp+ _ '}' _ { return props; };

StringRefinementProp =
  PatternProp
/ MinLengthProp
/ MaxLengthProp;

PatternProp =
  'pattern' _ ':' _ value:RegExp _ { return new T.Pattern(value); };

MinLengthProp =
  'minLength' _ ':' _ value:Integer _ { return new T.MinLength(value) };

MaxLengthProp =
  'maxLength' _ ':' _ value:Integer _ { return new T.MaxLength(value); };

ObjectTypeExp =
  '{' _ kvs:ObjectTypeKeyVal* _ '}' _ { return new T.ObjectType(kvs); };

ObjectTypeKeyVal =
  key:Identifier _ ':' _ val:TypeExpression _ ';'? _ { return new T.ObjectTypeKeyVal(key, val, true); }
  / key:Identifier _ '?:' _ val:TypeExpression _ ';'? _ { return new T.ObjectTypeKeyVal(key, val, false); }

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

import * as util from './util';

export interface Constraint {
  name: string;
  toSchema() : any;
  equals(v : any): boolean;
}

function regexEqual(x : RegExp, y : RegExp) : boolean {
  return (x instanceof RegExp) && (y instanceof RegExp) && 
         (x.source === y.source) && (x.global === y.global) && 
         (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
}

export class Pattern implements Constraint {
  name: string;
  regexp: RegExp;
  constructor(regex : RegExp) {
    this.regexp = regex;
    this.name = 'pattern';
  }

  equals(v : any) {
    console.log('Pattern.equals', (v instanceof Pattern), v.regexp, this.regexp)
    return (v instanceof Pattern) && regexEqual(v.regexp, this.regexp);
  }

  toSchema() {
    return {
      pattern: this.regexp.source
    }
  }
}

export class MinLength implements Constraint {
  name: string;
  minLength: number;
  constructor(minLength: number) {
    this.minLength = minLength;
    this.name = 'minLength';
  }

  equals(v : any) {
    return (v instanceof MinLength) && v.minLength === this.minLength;
  }

  toSchema() {
    return {
      minLength: this.minLength
    }
  }
}

export class MaxLength implements Constraint {
  name: string;
  maxLength: number;
  constructor(maxLength: number) {
    this.maxLength = maxLength;
    this.name = 'maxLength';
  }

  equals(v : any) {
    return (v instanceof MaxLength) && v.maxLength === this.maxLength;
  }

  toSchema() {
    return {
      maxLength: this.maxLength
    }
  }
}

export interface TypeExp {
  readonly type : string; 
  toSchema() : any;
  equals(v : any) : boolean;
}

export class RefType implements TypeExp {
  type = '$ref';
  ref: string;
  constructor(ref : string) {
    this.ref = ref;
  }
  toSchema() {
    return {
      $ref: this.ref
    };
  }

  equals(v: any) : boolean {
    return (v instanceof RefType) && v.ref === this.ref;
  }
}

export class StringType implements TypeExp {
  type = 'string';
  readonly constraints: Constraint[];
  constructor(constraints: Constraint[] = []) {
    this.constraints = constraints.concat().sort((a, b) => a.name.localeCompare(b.name));
  }

  equals(v : any) : boolean {
    return (v instanceof StringType) && this._constraintEquals(v.constraints || []);
  }

  private _constraintEquals(constraints: Constraint[]) : boolean {
    if (this.constraints.length !== constraints.length)
      return false;
    for (var i = 0 ; i < this.constraints.length; ++i) {
      // what about orders??? assume sorted.
      if (!this.constraints[i].equals(constraints[i])) {
        return false;
      }
    }
    return true;
  }

  toSchema() {
    return util.extend({type: 'string'}, ...this.constraints.map((c) => c.toSchema()));
  }
}

export class ObjectTypeKeyVal {
  key: string;
  val : TypeExp;
  required : boolean;
  constructor(key : string, val : TypeExp, required : boolean) {
    this.key = key;
    this.val = val;
    this.required = required;
  }

  equals(v : any) : boolean {
    if (!(v instanceof ObjectTypeKeyVal))
      return false;
    if (v.key !== this.key)
      return false;
    if (v.required != this.required)
      return false;
    return this.val.equals(v.val);
  }
}

export class ObjectType implements TypeExp {
  type = 'object'
  keyvals : ObjectTypeKeyVal[];
  constructor(keyvals: ObjectTypeKeyVal[] = []) {
    this.keyvals = keyvals;
  }

  equals(v : any) {
    return (v instanceof ObjectType) && this.keyValsEquals(v);
  }

  keyValsEquals(v : ObjectType) : boolean {
    if (v.keyvals.length !== this.keyvals.length)
      return false;
    // get sorted keys...
    let sorted = this.sortedKeyVals;
    let vSorted = v.sortedKeyVals;
    for (var i = 0; i < sorted.length; ++i) {
      if (!sorted[i].equals(vSorted[i]))
        return false;
    }
    return true;
  }

  get sortedKeyVals() {
    return this.keyvals.concat().sort((a, b) => a.key.localeCompare(b.key));
  }

  get required() {
    let result : string[] = [];
    this.keyvals.forEach(kv => {
      if (kv.required) {
        result.push(kv.key);
      }
    });
    return result;
  }

  get properties() {
    let result : {[key: string]: TypeExp} = {};
    this.keyvals.forEach((kv) => {
      result[kv.key] = kv.val.toSchema();
    })
    return result;
  }

  toSchema() {
    return {
      type: 'object',
      required: this.required,
      properties: this.properties
    };
  }
}

export class TypeDeclaration {
  typeName : string;
  typeExp : TypeExp;
  constructor(typeName: string, typeExp: TypeExp) {
    this.typeName = typeName;
    this.typeExp = typeExp;
  }
  equals(v : any) : boolean {
    console.log('TypeDeclaration.equals', (v instanceof TypeDeclaration), v.typeName === this.typeName, this.typeExp.equals(v.typeExp));
    return (v instanceof TypeDeclaration) && v.typeName === this.typeName && this.typeExp.equals(v.typeExp);
  }
}

export class TypeMap {
  _map : Map<string, TypeExp>;
  constructor() {
    this._map = new Map<string, TypeExp>();
  }

  declare(name : string, type : TypeExp) {
    if (this.has(name)) {
      throw new Error(`Duplicate type name: ${name}`);
    }
    this._map.set(name, type);
  }

  has(name : string) {
    return this._map.has(name);
  }

  get(name : string) : TypeExp {
    let res = this._map.get(name);
    if (!res)
      throw new Error(`Unknown type name: ${name}`);
    return res;
  }

  getDecl(name : string) : TypeDeclaration {
    return new TypeDeclaration(name, this.get(name));
  }

  getDeclarations() : TypeDeclaration[] {
    let res : TypeDeclaration[] = [];
    this._map.forEach((type, name) => {
      res.push(new TypeDeclaration(name, type));
    });
    return res;
  }

  get length() {
    return this._map.size;
  }
}
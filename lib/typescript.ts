import * as T from './ast';
import * as Promise from 'bluebird';
import * as fs from 'fs-extra-promise';
import * as glob from 'glob';
import * as path from 'path';

function globAsync(pattern : string) : Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    })
  })
}

class StringTypePrinter {
  name : string;
  exp : T.StringType;
  constructor(decl : T.TypeDeclaration) {
    this.name = decl.typeName;
    this.exp = <T.StringType>decl.typeExp;
  }

  render() {
    return this.renderDeclaration();
  }

  renderIsBaseJson(param : string) {
    return `typeof(${param}) === '${this.exp.type}'`;
  }


  renderCallIsBaseJson(param : string) {
    if (this.exp.isPlainType()) {
      return this.renderIsBaseJson(param);
    } else {
      return `${this.name}.isJSON(${param})`
    }
  }

  renderValidateJson(param : string, pathParam : string, errParam : string) {
    return `
    if (!${this.renderIsBaseJson(param)}) {
      ${errParam}.push({
        error: 'Not a ${this.exp.type}',
        value: ${param},
        path : ${pathParam}
      });
    }`;
  }

  renderCallValidateJson(param : string, pathParam : string, errParam : string) {
    if (this.exp.isPlainType()) {
      return this.renderValidateJson(param, pathParam, errParam);
    } else {
      return `
      ${this.name}.validateJSON(${param}, ${pathParam}, ${errParam});
      `;
    }
  }

  renderDeclaration() {
    let name = this.name;
    let type = this.exp;
    return `
    export class ${name} {
      private readonly _v : ${type.type};
      constructor(v : ${type.type}) {
        this._v = v;
      }

      static fromJSON(v : any) : ${name} {
        let res = ${name}.validateJSON(v);
        if (res.hasErrors()) {
          throw res;
        }
        return new ${name}(v);
      }

      static isJSON(v: any) : boolean {
        return ${this.renderIsBaseJson('v')};
      }

      static validateJSON(v : any, path : string = '$', err = new ValidationResult()) : ValidationResult {
        ${this.renderValidateJson('v', 'path', 'err')}
        return err;
      }

      valueOf() : ${type.type} {
        return this._v;
      }

      toString() {
        return this._v;
      }

      toJSON() : any {
        return this._v;
      }
    }
    `;
  }
}

class ValueTypePrinter {
  decl : T.TypeDeclaration;

  constructor(decl : T.TypeDeclaration) {
    this.decl = decl;
  }

  render() {
    return this.renderDeclaration(this.decl.typeName, this.decl.typeExp);
  }

  renderDeclaration(name : string, type : T.TypeExp) {
    return `
    export class ${name} {
      private readonly _v : ${type.type};
      constructor(v : ${type.type}) {
        this._v = v;
      }

      static fromJSON(v : any) : ${name} {
        let res = validate(v);
        if (res.hasErrors()) {
          throw res;
        }
        return new ${name}(v);
      }

      static validate(v : any, path : string = '$', err = new ValidationResult()) : ValidationResult {
        if (!typeof(v) === '${type.type}') {
          err.push({
            error: 'Not a ${type.type}',
            path : path
          });
        }
        return err;
      }

      valueOf() : ${type.type} {
        return this._v;
      }

      toString() {
        return this._v;
      }

      toJSON() : any {
        return this._v;
      }
    }
    `;
  }
}

class ObjectConstructorOptionsPrinter {
  keyvals : T.ObjectTypeKeyVal[];
  constructor(keyvals : T.ObjectTypeKeyVal[]) {
    this.keyvals = keyvals;
  }

  render() : string {
    return `{${this._renderObjectTypeConstructorKeyVals(this.keyvals)}}`;
  }

  _renderObjectTypeConstructorKeyVals(keyvals: T.ObjectTypeKeyVal[]) : string {
    return keyvals.map((keyval) => this._renderObjectTypeConstructorKeyVal(keyval)).join(', ');
  }

  _renderObjectTypeConstructorKeyVal(keyval : T.ObjectTypeKeyVal) : string {
    return `${keyval.key} ${this.renderOptionality(keyval)} ${this.renderTypeDefinition(keyval.val)}`;
  }

  renderOptionality(keyval : T.ObjectTypeKeyVal) : string {
    return keyval.required ? ':' : '?:'; 
  }

  renderTypeDefinition(type : T.TypeExp) : string {
    let printer = new TypeScriptPrinter();
    return printer.renderTypeDefinition(type);
  }
}

class ObjectConstructorAssignmentPrinter {
  keyvals : T.ObjectTypeKeyVal[];
  constructor(keyvals : T.ObjectTypeKeyVal[]) {
    this.keyvals = keyvals;
  }

  render() : string {
    return this.keyvals.map((kv) => this.renderPropertyAssignment(kv)).join(`\n`);
  }

  renderPropertyAssignment(kv : T.ObjectTypeKeyVal) : string {
    if (kv.required) {
      return `
      if (!v.${kv.key}) {
        throw new Error("RequiredField: ${kv.key}");
      } else {
        this.${kv.key} = v.${kv.key};
      }
      `;
    } else {
      return `
      if (v.${kv.key}) {
        this.${kv.key} = v.${kv.key};
      }
      `;
    }
  }
}

class ObjectPropertyDeclarationPrinter {
  keyval : T.ObjectTypeKeyVal;
  constructor(keyval : T.ObjectTypeKeyVal) {
    this.keyval = keyval;
  }

  render() : string {
    let keyval = this.keyval;
    return `
    readonly ${keyval.key} ${this.renderOptionality(keyval)} ${this.renderTypeDefinition(keyval.val)};
    `
  }

  renderOptionality(keyval : T.ObjectTypeKeyVal) : string {
    return keyval.required ? ':' : '?:'; 
  }

  renderTypeDefinition(type : T.TypeExp) : string {
    let printer = new TypeScriptPrinter();
    return printer.renderTypeDefinition(type);
  }

}

class ObjectValidationJSONPrinter {
  keyval : T.ObjectTypeKeyVal;
  constructor(keyval : T.ObjectTypeKeyVal) {
    this.keyval = keyval;
  }

  render() : string {
    let keyval = this.keyval;
    // let's see if 
    return `
    readonly ${keyval.key} ${this.renderOptionality(keyval)} ${this.renderTypeDefinition(keyval.val)};
    `
  }

  renderOptionality(keyval : T.ObjectTypeKeyVal) : string {
    return keyval.required ? ':' : '?:';
  }

  renderTypeDefinition(type : T.TypeExp) : string {
    let printer = new TypeScriptPrinter();
    return printer.renderTypeDefinition(type);
  }
}

class ObjectIsJsonPrinter {
  keyval : T.ObjectTypeKeyVal;
  constructor(keyval : T.ObjectTypeKeyVal) {
    this.keyval = keyval;
  }

  render() : string {
    let keyval = this.keyval;
    // let's see if 
    return `
    readonly ${keyval.key} ${this.renderOptionality(keyval)} ${this.renderTypeDefinition(keyval.val)};
    `
  }

  renderOptionality(keyval : T.ObjectTypeKeyVal) : string {
    return keyval.required ? ':' : '?:'; 
  }

  renderTypeDefinition(type : T.TypeExp) : string {
    let printer = new TypeScriptPrinter();
    return printer.renderTypeDefinition(type);
  }
}


class ObjectTypePrinter {
  decl : T.TypeDeclaration;
  name : string;
  type : T.ObjectType;

  constructor(decl : T.TypeDeclaration) {
    this.decl = decl;
    this.name = decl.typeName;
    this.type = <T.ObjectType>decl.typeExp;
  }

  render() {
    return this.renderDeclaration(this.decl.typeName, <T.ObjectType>this.decl.typeExp);
  }

  renderIsBaseJson(param : string) : string {
    return `typeof(${param}) === 'object'`;
  }

  renderIsJsonKeyVals(param : string) : string {
    return this.type.keyvals.map((kv) => {
      let printer = new StringTypePrinter(new T.TypeDeclaration(kv.key, kv.val));
      return `
      if (${kv.required ? '' : `${param}.${kv.key} && `}!${printer.renderCallIsBaseJson(param + '.' + kv.key)}) { // ${param + '.' + kv.key} is ${kv.required ? 'required' : 'optional'}
        return false;
      }
      `;
    }).join('\n');
  }

  renderValidateBaseJson(param: string, pathParam : string, errorParam : string) {
    return `
    if (!(${param} instanceof Object)) {
      ${errorParam}.push({
        error: 'Not an Object',
        value: ${param},
        path: ${pathParam === '' ? "''" : pathParam}
      });
    }
    `;
  }

  renderValidateJsonKeyVals(param : string, pathParam : string, errorParam : string) : string {
    return this.type.keyvals.map((kv) => {
      let printer = new StringTypePrinter(new T.TypeDeclaration(kv.key, kv.val));
      return `
      ${kv.required ? '' : `${param}.${kv.key} && `}${printer.renderCallValidateJson(param + '.'  + kv.key, pathParam === '' ? "''" : pathParam + " + '." + kv.key + "'", errorParam)} // ${param + '.' + kv.key} is ${kv.required ? 'required' : 'optional'}
      `;
    }).join('\n');
  }

  renderDeclaration(name : string, type : T.ObjectType) {
    return `
    export class ${name} {
      ${this.renderPropertyDeclarations(type.keyvals)}
      // constructors expect the values are already of the proper-type.
      constructor( v: ${this.renderConstructorOptions(type)}) {
        if (!(v instanceof Object)) {
          throw new Error("InvalidParameter: must be object");
        }
        ${this.renderConstructorAssignment(type)}
      }

      static isJSON(v: any) : boolean {
        if (!${this.renderIsBaseJson('v')})
          return false;
        // add the test for each of the keyvals!!!
        ${this.renderIsJsonKeyVals('v')}
        return true;
      }

      // validate is meant to validate the **JSON*** values of the structure...
      static validateJSON(v : any, path = '$', err = new ValidationResult()) : ValidationResult {
        ${this.renderValidateBaseJson('v', 'path', 'err')}
        // add the validation for each of the keyvals!!!
        ${this.renderValidateJsonKeyVals('v', 'path', 'err')}
        return err;
      }

      // converts the JSON value into the appropriate class.
      static fromJSON(v : any) : ${name} {
        let err = new ValidationResult();
        ${this.renderValidateBaseJson('v', '', 'err')}
        if (err.hasErrors())
          throw err;
        let json = {};
        return new ${name}(json);
      }

      toJSON() : any {
        return this;
      }
    }`;
  }

  renderPropertyDeclarations(keyvals : T.ObjectTypeKeyVal[]) {
    return keyvals.map((keyval) => {
      let printer = new ObjectPropertyDeclarationPrinter(keyval);
      return printer.render();
    }).join('');
  }

  renderConstructorOptions(type : T.ObjectType) {
    let printer = new ObjectConstructorOptionsPrinter(type.keyvals);
    return printer.render();
  }

  renderConstructorAssignment(type : T.ObjectType) {
    let printer = new ObjectConstructorAssignmentPrinter(type.keyvals);
    return printer.render();
  }
}

export class TypeScriptPrinter {
  constructor() {

  }

  loadTemplates() {
    return Promise.resolve();
  }

  render(map : T.TypeMap) : string {
    let decls = map.getDeclarations();
    return decls.map((decl) => this.renderDeclaration(decl)).join(`\n`);
  }

  renderDeclaration(decl : T.TypeDeclaration) : string {
    if (decl.typeExp instanceof T.StringType) {
      let printer = new ValueTypePrinter(decl);
      return printer.render();
    } else {
      let printer = new ObjectTypePrinter(decl);
      return printer.render();
    }
  }

  renderTypeDefinition(type : T.TypeExp) : string {
    if (type instanceof T.StringType) {
      return `string`;
    } else if (type instanceof T.ObjectType) {
      return this.renderObjectTypeDefinition(type as T.ObjectType);
    } else if (type instanceof T.RefType) {
      return this.renderRefType(type as T.RefType);
    } else {
      throw new Error(`Unknown type!: ${JSON.stringify(type.toSchema(), null, 2)}`);
    }
  }

  renderRefType(type : T.RefType) : string {
    return type.ref;
  }

  renderObjectTypeDefinition(type : T.ObjectType) : string {
    let printer = new ObjectConstructorOptionsPrinter(type.keyvals);
    return printer.render();
  }

}

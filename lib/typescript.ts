import * as T from './ast';
import * as handlebars from 'handlebars';
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
      return this._renderDeclareValueType(decl.typeName, decl.typeExp);
    } else {
      return this._renderDeclareObjectType(decl.typeName, decl.typeExp as T.ObjectType);
    }
  }

  _renderDeclareValueType(name : string, type : T.TypeExp) : string {
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

      static validate(v : any, path : string = '$') : ValidationResult {
        let res = new ValidationResult();
        if (!typeof(v) === '${type.type}') {
          res.push({
            error: 'Not a ${type.type}',
            path : path
          });
        }
        return res;
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

  _renderDeclareObjectType(name : string, type: T.ObjectType) : string {
    return `
    export class ${name} {
      ${this._renderObjectTypePropertyDeclarations(type.keyvals)}
      constructor( v: ${this._renderObjectTypeConstructorOptions(type)}) {
        ${this._renderObjectTypeConstructorAssignment(type)};
      }

      // validate is meant to validate the **JSON*** values of the structure...
      static validateJSON(v : any) : ValidationResult {
        let res = new ValidationResult();
        retun res;
      }

      static fromJSON(v : any) : ${name} {
        if (!(v instanceof Object)) {
          throw new ERror('Not an object');
        }
        throw new Error('Not yet implemented');
      }

      toJSON() : any {
        return this;
      }
    }`;
  }

  _renderObjectTypeConstructorOptions(type : T.ObjectType) : string {
    return `{${this._renderObjectTypeConstructorKeyVals(type.keyvals)}}`;
  }

  _renderObjectTypeConstructorKeyVals(keyvals: T.ObjectTypeKeyVal[]) : string {
    return keyvals.map((keyval) => this._renderObjectTypeConstructorKeyVal(keyval)).join(', ');
  }

  _renderObjectTypeConstructorKeyVal(keyval : T.ObjectTypeKeyVal) : string {
    return `${keyval.key} ${this._renderKeyValOptionality(keyval)} ${this._renderTypeDefinition(keyval.val)}`;
  }

  _renderObjectTypeConstructorAssignment(type : T.ObjectType) : string {
    return type.keyvals.map((kv) => this._renderObjectTypeConstructorPropertyAssignment(kv)).join(`\n`);
  }

  _renderObjectTypeConstructorPropertyAssignment(kv : T.ObjectTypeKeyVal) : string {
    return `
    this.${kv.key} = v.${kv.key};`;
  }

  _renderObjectTypePropertyDeclarations(keyvals : T.ObjectTypeKeyVal[]) : string {
    return keyvals.map((keyval) => {
      return this._renderObjectTypePropertyDeclaration(keyval);
    }).join('');
  }

  _renderTypeDefinition(type : T.TypeExp) : string {
    if (type instanceof T.StringType) {
      return `string`;
    } else if (type instanceof T.ObjectType) {
      return this._renderObjectTypeDefinition(type as T.ObjectType);
    } else if (type instanceof T.RefType) {
      return this._renderRefType(type as T.RefType);
    } else {
      throw new Error(`Unknown type!: ${JSON.stringify(type.toSchema(), null, 2)}`);
    }
  }

  _renderRefType(type : T.RefType) : string {
    return type.ref;
  }

  _renderObjectTypeDefinition(type : T.ObjectType) : string {
    return `{
      ${this._renderObjectTypePropertyDeclarations(type.keyvals)}
    }`;
  }

  _renderKeyValOptionality(keyval : T.ObjectTypeKeyVal) : string {
    return keyval.required ? '?:' : ':'; 
  }

  _renderObjectTypePropertyDeclaration(keyval : T.ObjectTypeKeyVal) : string {
    return `
    readonly ${keyval.key} ${this._renderKeyValOptionality(keyval)} ${this._renderTypeDefinition(keyval.val)};
    `
  }
}

class TypeScriptPrinter2 {
  _handlebars : typeof handlebars;
  constructor() {
    // let's 
    this._handlebars = handlebars.create();
    this._handlebars.registerHelper('declare-partial', this.typeDeclarePartial);
    this._handlebars.registerHelper('to-schema', this.typeToSchema);
    this._handlebars.registerHelper('constraint-isa', this.constraintIsa);
    this._handlebars.registerHelper('ctor-param', this._constructorParameters);
  }

  typeDeclarePartial(typeExp : T.TypeExp) : string {
    if (typeExp instanceof T.StringType) {
      return 'value-type';
    } else {
      return 'object-type';
    }
  }

  constraintIsa(constraint : T.Constraint) : string {
    console.info('***** Constraint.isa', constraint);
    if (constraint instanceof T.Pattern) {
      return 'value-type-pattern';
    } else if (constraint instanceof T.MinLength) {
      return 'value-type-minLength';
    } else if (constraint instanceof T.MaxLength) {
      return 'value-type-maxLength';
    } else {
      throw new Error(`Unknown constraint type: ${constraint}`)
    }
  }

  _constructorParameters(typeExp : T.TypeExp) : string {
    if (typeExp instanceof T.StringType) {
      return 'ctor-param-string';
    } else {
      return 'ctor-param-object';
    }
  }

  typeToSchema(typeExp: T.TypeExp) : string {
    return JSON.stringify(typeExp.toSchema(), null, 2);
  }


  loadTemplates() {
    return globAsync(path.join(__dirname, '..', 'templates', 'typescript', '**/*.hbs'))
      .then((paths) => {
        return Promise.map(paths, (filePath) => {
          return fs.readFileAsync(filePath, 'utf8')
            .then((data) => {
              let partialName = path.basename(filePath, path.extname(filePath));
              let template = this._handlebars.compile(data);
              this._handlebars.registerPartial(partialName, template);
            })
        })
      })
  }

  render(decl : T.TypeDeclaration) {
    let template = this._handlebars.partials['type-declaration'];
    if (typeof(template) == 'function') {
      return template(decl);
    } else {
      throw new Error(`Unknown Template: type-declaration: ${template}`);
    }
  }

} 
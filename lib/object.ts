import * as S from './schema';

export class RequiredConstraint implements S.IJsonSchema {
  readonly required: string[];
  constructor(required: string[] = []) {
    this.required = required;
  }

  isa(value : any) : boolean {
    for (var i = 0; i < this.required.length; ++i) {
      if (!value.hasOwnProperty(this.required[i])) {
        return false;
      }
    }
    return true;
  }

  setRequired(key : string) {
    this.required.push(key);
  }

  validate(value : any, path : string, errors : S.ValidationError[]) {
    console.info('RequiredConstraint.validate', value, this);
    for (var i = 0; i < this.required.length; ++i) {
      if (!value.hasOwnProperty(this.required[i])) {
        errors.push({
          path: `${path}.${this.required[i]}`,
          message: this.errorMessage(this.required[i]),
          value: value,
          schema: this
        })
      }
    }
  }

  errorMessage(value : any) : string {
    return `Missing required field: ${value}`;
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() {
    return {
      required: this.required
    }
  }

  jsonify(value : any) : any {
    return value;
  }
}

export class PropertiesConstraint implements S.IJsonSchema {
  readonly properties: {[key: string]: S.IJsonSchema};
  constructor(properties: {[key: string]: S.IJsonSchema} = {}) {
    this.properties = properties;
  }
  isa(value : any) : boolean {
    for (var key in this.properties) {
      if (value.hasOwnProperty(key)) {
        if (!this.properties[key].isa(value[key])) {
          return false;
        }
      }
    }
    return true;
  }

  setProperty(key : string, prop : S.IJsonSchema) {
    this.properties[key] = prop;
  }

  validate(value : any, path : string, errors: S.ValidationError[]) : void {
    for (var key in this.properties) {
      if (value.hasOwnProperty(key)) {
        this.properties[key].validate(value[key], `${path}.${key}`, errors);
      }
    }
  }
  errorMessage(value :any) : string {
    return `Not a Property`;
  }

  fromJSON(data : any) : any {
    let res : {[key: string]: any} = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (this.properties.hasOwnProperty(key)) {
          res[key] = this.properties[key].fromJSON(data[key])
        } else {
          res[key] = data[key]
        }
      }
    }
    return res;
  }

  toJSON() : any {
    let result : {[key: string] : any } = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        result[key] = this.properties[key].toJSON();
      }
    }
    return { properties: result };
  }

  jsonify(value : any) : any {
    console.info('****** Object.properties.jsonify', value);
    let res : {[key: string]: any} = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key) && value.hasOwnProperty(key)) {
        res[key] = this.properties[key].jsonify(value[key]);
      }
    }
    return res;
  }
}

export type ObjectSchemaOptions = {
  enum ?: S.EnumConstraint<{[key: string]: any}>
  properties ?: PropertiesConstraint;
  required ?: RequiredConstraint;
} & S.SchemaCtorOptions;

// we need a bit more ability to figure out what's going on since these things are interacting with each other..
export class ObjectSchema extends S.TypeSchema {
  private properties : PropertiesConstraint;
  private required : RequiredConstraint;
  constructor(options : ObjectSchemaOptions = {}) {
    let constraints : S.IJsonSchema[] = [];
    if (options.enum)
      constraints.push(options.enum);
    if (!options.required)
      options.required = new RequiredConstraint();
    constraints.push(options.required);
    if (!options.properties)
      options.properties = new PropertiesConstraint();
    constraints.push(options.properties);
    super('object', constraints, options.$make ? options.$make : undefined)
    this.required = options.required;
    this.properties = options.properties;
  }

  fromJSON(value : any) : any {
    let validateRes = S.validate(this, value);
    console.log('Object.fromJSON', validateRes);
    if (validateRes.errors.length > 0)
      throw validateRes;
    // otherwise - it's time to get the values converted...
    let res = this.properties.fromJSON(value);
    return this._maker(res);
  }

  setProperty(key : string, prop : S.IJsonSchema, required : boolean = true) {
    // this can be difficult to do!!!
    // perhaps this is where the design falls down? hmm...
    this.properties.setProperty(key, prop);
    if (required) {
      this.required.setRequired(key);
    }
  }

  jsonify(value : any) : any {
    console.info('***** Object.jsonify', value);
    return this.properties.jsonify(value);
  }
}


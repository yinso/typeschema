import * as S from './schema';

export class AnyOfSchema implements S.IJsonSchema {
  readonly schemas : S.IJsonSchema[];
  constructor(schemas : S.IJsonSchema[]) {
    this.schemas = schemas;
  }
  isa(value : any) : boolean {
    for (var i = 0; i < this.schemas.length; ++i) {
      if (this.schemas[i].isa(value))
        return true;
    }
    return false;
  }
  validate(value : any, path : string, errors: S.ValidationError[]) : void {
    for (var i = 0; i < this.schemas.length; ++i) {
      let tempErrors : S.ValidationError[] = [];
      this.schemas[i].validate(value, path, tempErrors);
      if (tempErrors.length === 0) {
        return;
      }
    }
    // if we get here - all validation has failed.
    errors.push({
      path: path,
      value: value,
      schema: this,
      message: `Not any of the inner schema types`
    })
  }

  fromJSON(data : any) : any {
    for (var i = 0; i < this.schemas.length; ++i) {
      if (this.schemas[i].isa(data))
        return this.schemas[i].fromJSON(data);
    }
    // validation error!!!
  }

  toJSON() : any {
    return {
      anyOf: this.schemas.map((s) => s.toJSON())
    }
  }

  jsonify(value : any) : any {
    for (var i = 0; i < this.schemas.length; ++i) {
      if (this.schemas[i].isa(value)) {
        return this.schemas[i].jsonify(value);
      }
    }
    return value;
  }
}

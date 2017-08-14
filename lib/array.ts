import * as S from './schema';
import * as T from './string';

export type ArraySchemaOptions = {
  items ?: ItemsConstraint;
  enum ?: S.EnumConstraint<Array<any>>;
  minItems ?: T.MinLength;
  maxItems ?: T.MaxLength;
} & S.SchemaCtorOptions;

export class ItemsConstraint implements S.IJsonSchema {
  readonly items : S.IJsonSchema;
  constructor(items : S.IJsonSchema) {
    this.items = items;
  }
  isa(value : any) : boolean {
    if (!S.TypeMap.array.isa(value))
      return false;
    for (var i = 0; i < value.length; ++i) {
      if (!this.items.isa(value)) {
        return false;
      }
    }
    return true;
  }
  validate(value : any, path : string, errors: S.ValidationError[]) {
    if (!S.TypeMap.array.isa(value)) {
      errors.push({
        path: path,
        message: `Not an array`,
        schema: this,
        value: value
      })
    } else {
      (<Array<any>>value).forEach((item, i) => {
        this.items.validate(item, `${path}[${i}]`, errors);
      })
    }
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() : any {
    return {
      items: this.items.toJSON()
    }
  }
}

export class ArraySchema extends S.TypeSchema {
  constructor(options : ArraySchemaOptions = {}) {
    let constraints : S.IJsonSchema[] = []
    if (options.items)
      constraints.push(options.items);
    if (options.enum)
      constraints.push(options.enum);
    if (options.minItems)
      constraints.push(options.minItems);
    if (options.maxItems)
      constraints.push(options.maxItems);
    super('array', constraints, options.$make ? options.$make : undefined)
  }
}

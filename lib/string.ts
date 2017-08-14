import * as S from './schema';
import valiDate = require('vali-date');

// minLength
// maxLength
// 
export type StringSchemaOptions = {
  enum ?: S.EnumConstraint<string>;
  minLength ?: MinLength;
  maxLength ?: MaxLength;
  pattern ?: Pattern;
  format ?: Format;
} & S.SchemaCtorOptions;

export class StringSchema extends S.TypeSchema {
  constructor(options : StringSchemaOptions = {}) {
    let constraints : S.IJsonSchema[] = [];
    if (options.minLength)
      constraints.push(options.minLength);
    if (options.maxLength)
      constraints.push(options.maxLength);
    if (options.pattern)
      constraints.push(options.pattern);
    if (options.format)
      constraints.push(options.format);
    super('string', constraints, options.$make ? options.$make : (options.format ? formatMap[options.format.format].make : undefined));
  }
}

export class MinLength implements S.IJsonSchema {
  readonly minLength : number;
  constructor(minLength: number) {
    this.minLength = minLength;
  }
  isa(value : any) : boolean {
    return value.length >= this.minLength;
  }
  validate(value : any, path : string, errors: S.ValidationError[]) : void {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: `Length less than ${this.minLength}`
      })
    }
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() : any {
    return {
      minLength: this.minLength
    }
  }
}

export class MaxLength implements S.IJsonSchema {
  readonly maxLength : number;
  constructor(maxLength: number) {
    this.maxLength = maxLength;
  }
  isa(value : any) : boolean {
    return value.length >= this.maxLength;
  }
  validate(value : any, path : string, errors: S.ValidationError[]) : void {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: `Length greater than ${this.maxLength}`
      })
    }
  }
  fromJSON(data : any) : any {
    return data;
  }

  toJSON() : any {
    return {
      maxLength: this.maxLength
    }
  }
}

export class Pattern implements S.IJsonSchema {
  readonly pattern : RegExp;
  constructor(pattern : string) {
    this.pattern = new RegExp(pattern);
  }
  isa(value : any) : boolean {
    return this.pattern.test(value)
  }
  validate(value : any, path : string, errors: S.ValidationError[]) {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: `Failed pattern: ${this.pattern}`
      })
    }
  }

  fromJSON(data : any) : any {
    return data;
  }

  toJSON() : any {
    return {
      pattern: this.pattern.source
    }
  }
}

const formatMap : {[key: string]: {
  isa: (value : any) => boolean;
  make: (value : any) => any}
} = {
  'date-time': {
    isa: valiDate,
    make: (value : any) => new Date(value)
  }
}

export function registerFormat(format : string, isa : (value : any) => boolean, fromJSON: (value : any) => any) : void {
  formatMap[format] = {
    isa: isa,
    make : fromJSON
  };
}

export class Format implements S.IJsonSchema {
  readonly format : string;
  constructor(format : string) {
    if (!formatMap.hasOwnProperty(format)) {
      throw new Error(`Unknown Format: ${format}`)
    }
    this.format = format;
  }
  isa(value : any) : boolean {
    return formatMap[this.format].isa(value);
  }
  validate(value : any, path : string, errors: S.ValidationError[]) {
    if (!this.isa(value)) {
      errors.push({
        path: path,
        value: value,
        schema: this,
        message: `Failed format: ${this.format}`
      })
    }
  }

  fromJSON(data : any) : any {
    if (this.isa(data)) {
      return formatMap[this.format].make(data);
    } else {
      throw new S.ValidationException([{
        path: '$',
        schema: this,
        value: data,
        message: `Failed format: ${this.format}`
      }
      ]);
    }
  }

  toJSON() : any {
    return {
      pattern: this.format
    }
  }
}


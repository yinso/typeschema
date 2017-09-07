import * as S from './schema';

S.TypeMap['null'] = {
  isa: (v) => v === null,
  make: (v) => v
}

export class NullSchema extends S.TypeSchema {
  constructor(constraints : S.IJsonSchema[] = []) {
    super('null', constraints)
  }

  jsonify(value : any) : any {
    if (value === null)
      return value;
    else
      throw new Error(`Not a null`);
  }
}


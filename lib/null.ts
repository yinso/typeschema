import * as S from './schema';

S.TypeMap['null'] = {
  isa: (v) => v === null,
  make: (v) => v
}

export class NullSchema extends S.CompoundSchema {
  constructor(constraints : S.IJsonSchema[] = []) {
    super([<S.IJsonSchema>new S.TypeSchema('null')].concat(constraints))
  }
}


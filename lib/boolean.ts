import * as S from './schema';

export type BooleanSchemaOptions = {
  enum ?: S.EnumConstraint<boolean>;
}

export class BooleanSchema extends S.CompoundSchema {
  constructor(options : BooleanSchemaOptions = {}) {
    let constraints : S.IJsonSchema[] = [];
    if (options.enum)
      constraints.push(options.enum);
    super([<S.IJsonSchema>new S.TypeSchema('boolean')].concat(constraints))
  }
}

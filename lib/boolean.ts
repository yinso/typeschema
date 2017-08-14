import * as S from './schema';

export type BooleanSchemaOptions = {
  enum ?: S.EnumConstraint<boolean>;
} & S.SchemaCtorOptions;

export class BooleanSchema extends S.TypeSchema {
  constructor(options : BooleanSchemaOptions = {}) {
    let constraints : S.IJsonSchema[] = [];
    if (options.enum)
      constraints.push(options.enum);
    super('boolean', constraints, options.$make ? options.$make : undefined)
  }
}

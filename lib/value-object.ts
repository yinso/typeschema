export class ValueObject<T> {
  protected readonly __v: T;
  constructor(value : T) {
    this._validate(value);
    this.__v = value;
  }

  _validate(value: T) {
  }

  valueOf() : T {
    return this.__v;
  }

  toJSON() : T {
    return this.__v;
  }
}

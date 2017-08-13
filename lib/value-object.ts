export class ValueObject<T> {
  protected readonly __value: T;
  constructor(value : T) {
    this._validate(value);
    this.__value = value;
  }

  _validate(value: T) {

  }

  valueOf() : T {
    return this.__value;
  }

  toJSON() : T {
    return this.__value;
  }
}

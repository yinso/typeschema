
    import { ValidationResult } from '../lib/schema';
    export class SSN {
      private readonly _v : string;
      constructor(v : string) {
        this._v = v;
      }

      static fromJSON(v : any) : SSN {
        let res = SSN.validate(v);
        if (res.hasErrors()) {
          throw res;
        }
        return new SSN(v);
      }

      static validate(v : any, path : string = '$', err = new ValidationResult()) : ValidationResult {
        if (!(typeof(v) === 'string')) {
          err.push({
            error: 'Not a string',
            path : path,
            value: v
          });
        }
        return err;
      }

      static isJSON(v : any) {
        let res = SSN.validate(v);
        return !res.hasErrors();
      }

      valueOf() : string {
        return this._v;
      }

      toString() {
        return this._v;
      }

      toJSON() : any {
        return this._v;
      }
    }
    
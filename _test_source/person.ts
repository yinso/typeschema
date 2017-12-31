
    import { ValidationResult } from '../lib/schema';
    import { SSN } from './ssn';
    export class Person {
      
    readonly firstName : string;
    
    readonly lastName : string;
    
    readonly ssn ?: SSN;
    
      // constructors expect the values are already of the proper-type.
      constructor( v: {firstName : string, lastName : string, ssn ?: SSN}) {
        if (!(typeof(v) === 'object')) {
          throw new Error("InvalidParameter: must be object");
        }
        
      if (!v.firstName) {
        throw new Error("RequiredField: firstName");
      } else {
        this.firstName = v.firstName;
      }
      

      if (!v.lastName) {
        throw new Error("RequiredField: lastName");
      } else {
        this.lastName = v.lastName;
      }
      

      if (v.ssn) {
        this.ssn = v.ssn;
      }
      
      }

      static isJSON(v: any) : boolean {
        if (!(typeof(v) === 'object'))
          return false;
        // add the test for each of the keyvals!!!
        
      if (!(typeof(v.firstName) === 'string')) { // v.firstName is required
        return false;
      }
      

      if (!(typeof(v.lastName) === 'string')) { // v.lastName is required
        return false;
      }
      

      if (v.ssn && !ssn.isJSON(v.ssn)) { // v.ssn is optional
        return false;
      }
      
        return true;
      }

      // validate is meant to validate the **JSON*** values of the structure...
      static validateJSON(v : any, path = '$', err = new ValidationResult()) : ValidationResult {
        
    if (!(v instanceof Object)) {
      err.push({
        error: 'Not an Object',
        value: v,
        path: path
      });
    }
    
        // add the validation for each of the keyvals!!!
        
      
    if (!(typeof(v.firstName) === 'string')) {
      err.push({
        error: 'Not a string',
        value: v.firstName,
        path : path + '.firstName'
      });
    } // v.firstName is required
      

      
    if (!(typeof(v.lastName) === 'string')) {
      err.push({
        error: 'Not a string',
        value: v.lastName,
        path : path + '.lastName'
      });
    } // v.lastName is required
      

      v.ssn && 
      ssn.validateJSON(v.ssn, path + '.ssn', err);
       // v.ssn is optional
      
        return err;
      }

      // converts the JSON value into the appropriate class.
      static fromJSON(v : any) : Person {
        let err = new ValidationResult();
        
    if (!(v instanceof Object)) {
      err.push({
        error: 'Not an Object',
        value: v,
        path: ''
      });
    }
    
        if (err.hasErrors())
          throw err;
        let json = {};
        return new Person(json);
      }

      toJSON() : any {
        return this;
      }
    }
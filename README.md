# Type Schema - JSON-Schema-based annotation for TypeScript 

```typescript
import * as ts from 'typeschema';
@ts.String({ pattern: /^\d\d\d-?\d\d-?\d\d\d\d/ })
class SSN extends ts.ValueObject<string> { }
// adds a construtor that requires a string.
let ssn = new SSN('123-45-6789') // automatically validate the result.
let invalidSSN = new SSN('not a valid ssn') // throws error.
let ssn = SSN.fromJSON('another invalid ssn'); // class method fromJSON added.

@ts.String({ pattern: /\S+/})
class Name extends ts.ValueObject<string> { }

class Person {
  @ts.Property({ $class: () => Name })
  firstName: Name;

  @ts.Properety({ $class: () => Name })
  lastName : Name;

  // by default, object properties are 
  @ts.Property({ $class: () => SSN , $optional: true })
  ssn ?: SSN;
}

let person = new Person({
  firstName: new Name('John'),
  lastName: new Name('Smith')
})

let person = Person.fromJSON({
  firstName: 'John',
  lastName: 'Smith',
  ssn: '123-45-6789'
}); // Person { firstName: Name { _v: 'John' }, lastName: Name { _v: 'Smith' }, ssn: SSN { _v: '123-45-6789' }}

person.toJSON(); // { firstName : 'John', lastName: 'Smith', ssn: '123-45-6789' }

// invalid person
let person = Person.fromJSON({ }); // throws ValidationError([ { error: 'Required', path: '$/firstName' }, ...])

Person.getSchema(); // { type: 'object', required: ['firstName', 'lastName', 'ssn'], properties: { ... }}

```

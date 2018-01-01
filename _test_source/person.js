"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../lib/schema");
var Person = /** @class */ (function () {
    // constructors expect the values are already of the proper-type.
    function Person(v) {
        if (!(typeof (v) === 'object')) {
            throw new Error("InvalidParameter: must be object");
        }
        if (!v.firstName) {
            throw new Error("RequiredField: firstName");
        }
        else {
            this.firstName = v.firstName;
        }
        if (!v.lastName) {
            throw new Error("RequiredField: lastName");
        }
        else {
            this.lastName = v.lastName;
        }
        if (v.ssn) {
            this.ssn = v.ssn;
        }
    }
    Person.isJSON = function (v) {
        if (!(typeof (v) === 'object'))
            return false;
        // add the test for each of the keyvals!!!
        if (!(typeof (v.firstName) === 'string')) {
            return false;
        }
        if (!(typeof (v.lastName) === 'string')) {
            return false;
        }
        if (v.ssn && !ssn.isJSON(v.ssn)) {
            return false;
        }
        return true;
    };
    // validate is meant to validate the **JSON*** values of the structure...
    Person.validateJSON = function (v, path, err) {
        if (path === void 0) { path = '$'; }
        if (err === void 0) { err = new schema_1.ValidationResult(); }
        if (!(v instanceof Object)) {
            err.push({
                error: 'Not an Object',
                value: v,
                path: path
            });
        }
        // add the validation for each of the keyvals!!!
        if (!(typeof (v.firstName) === 'string')) {
            err.push({
                error: 'Not a string',
                value: v.firstName,
                path: path + '.firstName'
            });
        } // v.firstName is required
        if (!(typeof (v.lastName) === 'string')) {
            err.push({
                error: 'Not a string',
                value: v.lastName,
                path: path + '.lastName'
            });
        } // v.lastName is required
        v.ssn &&
            ssn.validateJSON(v.ssn, path + '.ssn', err);
        // v.ssn is optional
        return err;
    };
    // converts the JSON value into the appropriate class.
    Person.fromJSON = function (v) {
        var err = new schema_1.ValidationResult();
        if (!(v instanceof Object)) {
            err.push({
                error: 'Not an Object',
                value: v,
                path: ''
            });
        }
        if (err.hasErrors())
            throw err;
        var json = {};
        return new Person(json);
    };
    Person.prototype.toJSON = function () {
        return this;
    };
    return Person;
}());
exports.Person = Person;
//# sourceMappingURL=person.js.map
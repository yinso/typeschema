"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast = require("./ast");
function makeStringType(varName, constraints) {
    console.log('**** makeStringType', varName, constraints);
    var args = {};
    constraints.forEach(function (c) {
        if (ast.isPatternConstraint(c)) {
            if (args.pattern)
                throw new Error("MoreThanOnePatternConstraint");
            if (c.varName !== varName)
                throw new Error("UnknownIdentifier: " + c.varName);
            args.pattern = c;
        }
        else if (ast.isMinLengthConstraint(c)) {
            if (args.minLength)
                throw new Error("MoreThanOneMinLengthConstraint");
            if (c.varName !== varName)
                throw new Error("UnknownIdentifier: " + c.varName);
            args.minLength = c;
        }
        else if (ast.isMaxLengthConstraint(c)) {
            if (args.maxLength)
                throw new Error("MoreThanOneMaxLengthConstraint");
            if (c.varName !== varName)
                throw new Error("UnknownIdentifier: " + c.varName);
            args.maxLength = c;
        }
        else {
            throw new Error("UnsupportedConstraintForString: " + c.type);
        }
    });
    return ast.stringTypeExp(args);
}
exports.makeStringType = makeStringType;
//# sourceMappingURL=grammar-helper.js.map
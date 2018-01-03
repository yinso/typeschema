import * as ast from './ast';

export function makeStringType(varName : string, constraints : ast.Constraint[]) {
    console.log('**** makeStringType', varName, constraints);
    let args : {
        pattern ?: ast.PatternConstraint;
        minLength ?: ast.MinLengthConstraint;
        maxLength ?: ast.MaxLengthConstraint;
    } = {};
    constraints.forEach((c) => {
        if (ast.isPatternConstraint(c)) {
            if (args.pattern)
                throw new Error(`MoreThanOnePatternConstraint`);
            if ((<any>c).varName !== varName)
                throw new Error(`UnknownIdentifier: ${(<any>c).varName}`);
            args.pattern = c;
        } else if (ast.isMinLengthConstraint(c)) {
            if (args.minLength)
                throw new Error(`MoreThanOneMinLengthConstraint`);
            if ((<any>c).varName !== varName)
                throw new Error(`UnknownIdentifier: ${(<any>c).varName}`);
            args.minLength = c;
        } else if (ast.isMaxLengthConstraint(c)) {
            if (args.maxLength)
                throw new Error(`MoreThanOneMaxLengthConstraint`);
            if ((<any>c).varName !== varName)
                throw new Error(`UnknownIdentifier: ${(<any>c).varName}`);
            args.maxLength = c;
        } else {
            throw new Error(`UnsupportedConstraintForString: ${c.type}`);
        }
    })
    return ast.stringTypeExp(args);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
function noErrors(result) {
    assert.equal(result.errors.length, 0);
}
exports.noErrors = noErrors;
function hasErrors(result) {
    assert.notEqual(result.errors.length, 0);
}
exports.hasErrors = hasErrors;
var assert_1 = require("assert");
exports.throws = assert_1.throws;
exports.deepEqual = assert_1.deepEqual;
exports.noThrows = assert_1.doesNotThrow;
var mocha_typescript_1 = require("mocha-typescript");
exports.suite = mocha_typescript_1.suite;
exports.test = mocha_typescript_1.test;
exports.slow = mocha_typescript_1.slow;
exports.timeout = mocha_typescript_1.timeout;
//# sourceMappingURL=test-util.js.map
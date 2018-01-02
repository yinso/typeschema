"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isWhitespace(str) {
    return /^\s*$/.test(str);
}
function isOperator(str) {
    return /[\(\.\!]$/.test(str);
}
var Text = /** @class */ (function () {
    function Text(inner) {
        this.inner = inner;
    }
    return Text;
}());
var Newline = /** @class */ (function () {
    function Newline() {
        this.inner = '\n';
    }
    return Newline;
}());
var FlexWS = /** @class */ (function () {
    function FlexWS() {
    }
    FlexWS.prototype.shouldNotLeaveSpace = function (buffer) {
        if (buffer.length == 0)
            return true;
        var lastItem = buffer[buffer.length - 1];
        if (isWhitespace(lastItem))
            return true;
        if (isOperator(lastItem))
            return true;
        return false;
    };
    return FlexWS;
}());
var Nest = /** @class */ (function () {
    function Nest(indent, next) {
        this.indent = indent;
        this.next = next;
    }
    return Nest;
}());
var Concat = /** @class */ (function () {
    function Concat(list) {
        this.list = list;
    }
    return Concat;
}());
function empty() {
    return new Text('');
}
exports.empty = empty;
function text(str) {
    return new Text(str);
}
exports.text = text;
function line() {
    return new Newline();
}
exports.line = line;
function flexWS() {
    return new FlexWS();
}
exports.flexWS = flexWS;
function nest(indent, next) {
    return new Nest(indent, next);
}
exports.nest = nest;
function concat() {
    var docs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        docs[_i] = arguments[_i];
    }
    return new Concat(docs);
}
exports.concat = concat;
function layout(doc) {
    var buffer = [];
    _normalize(doc, buffer, 0);
    return buffer.join('');
}
exports.layout = layout;
function _indent(indent) {
    var result = [];
    for (var i = 0; i < indent; ++i) {
        result.push(' ');
    }
    return result.join('');
}
function _normalize(doc, buffer, indent) {
    if (doc instanceof Text) {
        buffer.push(doc.inner);
    }
    else if (doc instanceof Newline) {
        buffer.push('\n' + _indent(indent));
    }
    else if (doc instanceof FlexWS) {
        if (doc.shouldNotLeaveSpace(buffer)) {
            buffer.push('');
        }
        else {
            buffer.push(' ');
        }
    }
    else if (doc instanceof Nest) {
        _normalize(doc.next, buffer, indent + doc.indent);
    }
    else if (doc instanceof Concat) {
        doc.list.forEach(function (inner) {
            _normalize(inner, buffer, indent);
        });
    }
}
//# sourceMappingURL=pretty-printer.js.map
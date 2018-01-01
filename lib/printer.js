"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ast = require("./formatter");
// Wadler's Pretty Printer http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf
// (<>)   :: Doc -> Doc -> Doc    // concats two documents into a single document.
// nil    :: Doc                  // empty document.
// text   :: String -> Doc        // converts a string into a document
// line   :: Doc                  // a line break document.
// nest   :: Int -> Doc -> Doc    // adds indentation to document.
// layout :: Doc -> String        // converts the document back into a string.
var Doc = /** @class */ (function () {
    function Doc() {
    }
    Doc.empty = function () {
        return new Text('');
    };
    Doc.text = function (str) {
        return new Text(str);
    };
    Doc.line = function () {
        return new Newline();
    };
    Doc.nest = function (indent, next) {
        return new Nest(indent, next);
    };
    Doc.concat = function () {
        var docs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            docs[_i] = arguments[_i];
        }
        return new Concat(docs);
    };
    Doc.layout = function (doc) {
        var buffer = [];
        Doc.normalize(doc, buffer, 0);
        return buffer.join('');
    };
    Doc._indent = function (indent) {
        var result = [];
        for (var i = 0; i < indent; ++i) {
            result.push(' ');
        }
        return result.join('');
    };
    Doc.normalize = function (doc, buffer, indent) {
        if (doc instanceof Text) {
            buffer.push(doc.inner);
        }
        else if (doc instanceof Newline) {
            buffer.push('\n' + Doc._indent(indent));
        }
        else if (doc instanceof Nest) {
            Doc.normalize(doc.next, buffer, indent + doc.indent);
        }
        else if (doc instanceof Concat) {
            doc.list.forEach(function (inner) {
                Doc.normalize(inner, buffer, indent);
            });
        }
    };
    return Doc;
}());
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(inner) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        return _this;
    }
    return Text;
}(Doc));
var Newline = /** @class */ (function (_super) {
    __extends(Newline, _super);
    function Newline() {
        var _this = _super.call(this) || this;
        _this.inner = '\n';
        return _this;
    }
    return Newline;
}(Doc));
var Nest = /** @class */ (function (_super) {
    __extends(Nest, _super);
    function Nest(indent, next) {
        var _this = _super.call(this) || this;
        _this.indent = indent;
        _this.next = next;
        return _this;
    }
    return Nest;
}(Doc));
var Concat = /** @class */ (function (_super) {
    __extends(Concat, _super);
    function Concat(list) {
        var _this = _super.call(this) || this;
        _this.list = list;
        return _this;
    }
    return Concat;
}(Doc));
var TypeScriptPrinter = /** @class */ (function () {
    function TypeScriptPrinter() {
    }
    TypeScriptPrinter.prototype.print = function (node) {
        var doc = this._node(node);
        return Doc.layout(doc);
    };
    TypeScriptPrinter.prototype._node = function (node) {
        if (ast.isIdentifier(node)) {
            return this._identifier(node);
        }
        else if (ast.isStringExp(node)) {
            return this._string(node);
        }
        else if (ast.isIntegerExp(node)) {
            return this._integer(node);
        }
        else if (ast.isDoubleExp(node)) {
            return this._double(node);
        }
        else if (ast.isBooleanExp(node)) {
            return this._boolean(node);
        }
        else if (ast.isIfExp(node)) {
            return this._if(node);
        }
        else if (ast.isBinaryExp(node)) {
            return this._binary(node);
        }
        else if (ast.isMemberExp(node)) {
            return this._member(node);
        }
        else if (ast.isFuncallExp(node)) {
            return this._funcall(node);
        }
        else if (ast.isBlockExp(node)) {
            return this._block(node);
        }
        else {
            throw new Error("Unknown Node: " + node.type);
        }
    };
    TypeScriptPrinter.prototype._identifier = function (node) {
        return Doc.text(node.name);
    };
    TypeScriptPrinter.prototype._string = function (node) {
        return Doc.text(node.value);
    };
    TypeScriptPrinter.prototype._integer = function (node) {
        return Doc.text(node.value.toString());
    };
    TypeScriptPrinter.prototype._double = function (node) {
        return Doc.text(node.value.toString());
    };
    TypeScriptPrinter.prototype._boolean = function (node) {
        return Doc.text(node.value.toString());
    };
    TypeScriptPrinter.prototype._if = function (node) {
        return Doc.concat(Doc.text("if "), this._node(node.cond), ast.isBlockExp(node.lhs) ? this._node(node.lhs) : Doc.nest(4, this._node(node.lhs)), Doc.text("else"), ast.isBlockExp(node.rhs) ? this._node(node.rhs) : Doc.nest(4, this._node(node.rhs)));
    };
    TypeScriptPrinter.prototype._binary = function (node) {
        return Doc.concat(Doc.text('('), this._node(node.lhs), " " + node.operator + " ", this._node(node.rhs), Doc.text(')'));
    };
    TypeScriptPrinter.prototype._member = function (node) {
        return Doc.concat(this._node(node.head), Doc.text('.'), this._node(node.key));
    };
    TypeScriptPrinter.prototype._funcall = function (node) {
        var _this = this;
        var params = [];
        node.paramList.forEach(function (param, i) {
            if (i > 0) {
                params.push(Doc.text(", "));
            }
            params.push(_this._node(node.paramList[i]));
        });
        return Doc.concat.apply(Doc, [this._node(node.function), Doc.text('(')].concat(params, [Doc.text(')')]));
    };
    TypeScriptPrinter.prototype._block = function (node) {
        var _this = this;
        return Doc.concat.apply(Doc, [Doc.text('{')].concat(node.exps.map(function (item) { return Doc.nest(4, Doc.concat(Doc.line(), _this._node(item))); }), [Doc.line(), Doc.text('}')]));
    };
    return TypeScriptPrinter;
}());
exports.TypeScriptPrinter = TypeScriptPrinter;
//# sourceMappingURL=printer.js.map
import * as ast from './formatter';
import { ETXTBSY } from 'constants';
import { Ternary } from 'typescript';

// Wadler's Pretty Printer http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf
// (<>)   :: Doc -> Doc -> Doc    // concats two documents into a single document.
// nil    :: Doc                  // empty document.
// text   :: String -> Doc        // converts a string into a document
// line   :: Doc                  // a line break document.
// nest   :: Int -> Doc -> Doc    // adds indentation to document.
// layout :: Doc -> String        // converts the document back into a string.

class Doc {
    static empty() {
        return new Text('');
    }

    static text(str : string) {
        return new Text(str);
    }

    static line() {
        return new Newline();
    }

    static nest(indent : number, next : Doc) {
        return new Nest(indent, next);
    }

    static concat(...docs : Doc[]) {
        return new Concat(docs);
    }

    static layout(doc : Doc) : string {
        let buffer : string[] = [];
        Doc.normalize(doc, buffer, 0);
        return buffer.join('');
    }

    static _indent(indent : number) : string {
        let result : string[] = [];
        for (var i = 0; i < indent; ++i) {
            result.push(' ');
        }
        return result.join('');
    }

    static normalize(doc : Doc, buffer : string[], indent : number) : void {
        if (doc instanceof Text) {
            buffer.push(doc.inner);
        } else if (doc instanceof Newline) {
            buffer.push('\n' + Doc._indent(indent));
        } else if (doc instanceof Nest) {
            Doc.normalize(doc.next, buffer, indent + doc.indent);
        } else if (doc instanceof Concat) {
            doc.list.forEach((inner) => {
                Doc.normalize(inner, buffer, indent);
            });
        }
    }
}

class Text extends Doc {
    readonly inner : string;
    constructor(inner : string) {
        super();
        this.inner = inner;
    }
}

class Newline extends Doc {
    readonly inner: string;
    constructor() {
        super();
        this.inner = '\n';
    }
}

class Nest extends Doc {
    readonly indent : number;
    readonly next : Doc;
    constructor(indent: number, next: Doc) {
        super();
        this.indent = indent;
        this.next = next;
    }
}

class Concat extends Doc {
    readonly list : Doc[];
    constructor(list : Doc[]) {
        super();
        this.list = list;
    }
}





export class TypeScriptPrinter {

    print(node : ast.Node) : string {
        let doc = this._node(node);
        return Doc.layout(doc);
    }

    private _node(node : ast.Node) : Doc {
        if (ast.isIdentifier(node)) {
            return this._identifier(node);
        } else if (ast.isStringExp(node)) {
            return this._string(node);
        } else if (ast.isIntegerExp(node)) {
            return this._integer(node);
        } else if (ast.isDoubleExp(node)) {
            return this._double(node);
        } else if (ast.isBooleanExp(node)) {
            return this._boolean(node);
        } else if (ast.isIfExp(node)) {
            return this._if(node);
        } else if (ast.isBinaryExp(node)) {
            return this._binary(node);
        } else if (ast.isMemberExp(node)) {
            return this._member(node);
        } else if (ast.isFuncallExp(node)) {
            return this._funcall(node);
        } else if (ast.isBlockExp(node)) {
            return this._block(node);
        } else {
            throw new Error(`Unknown Node: ${node.type}`);
        }
    }

    private _identifier(node : ast.Identifier) : Doc {
        return Doc.text(node.name);
    }

    private _string(node : ast.StringExp) : Doc {
        return Doc.text(node.value);
    }

    private _integer(node : ast.IntegerExp) : Doc {
        return Doc.text(node.value.toString());
    }

    private _double(node : ast.DoubleExp) : Doc {
        return Doc.text(node.value.toString());
    }

    private _boolean(node : ast.BooleanExp) : Doc {
        return Doc.text(node.value.toString());
    }

    private _if(node : ast.IfExp) : Doc {
        return Doc.concat(
            Doc.text("if "), this._node(node.cond),
            ast.isBlockExp(node.lhs) ? this._node(node.lhs) : Doc.nest(4, this._node(node.lhs)),
            Doc.text("else"),
            ast.isBlockExp(node.rhs) ? this._node(node.rhs) : Doc.nest(4, this._node(node.rhs)),
        );
    }

    private _binary(node : ast.BinaryExp) : Doc {
        return Doc.concat(
            Doc.text('('), this._node(node.lhs), ` ${node.operator} `, this._node(node.rhs), Doc.text(')')
        );
    }

    private _member(node : ast.MemberExp) : Doc {
        return Doc.concat(this._node(node.head), Doc.text('.'), this._node(node.key));
    }

    private _funcall(node : ast.FuncallExp) : Doc {
        let params : Doc[] = [];
        node.paramList.forEach((param, i) => {
            if (i > 0) {
                params.push(Doc.text(", "));
            }
            params.push(this._node(node.paramList[i]));
        })
        return Doc.concat(this._node(node.function), Doc.text('('), ...params, Doc.text(')'));
    }

    private _block(node : ast.BlockExp) : Doc {
        return Doc.concat(
            Doc.text('{'),
            ...node.exps.map((item) => Doc.nest(4, Doc.concat(Doc.line(), this._node(item)))),
            Doc.line(), Doc.text('}')
        );
    }
}

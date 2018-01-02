function isWhitespace(str : string) {
    return /^\s*$/.test(str);
}

function isOperator(str: string) {
    return /[\(\.\!]$/.test(str)
}

// Wadler's Pretty Printer http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf
// (<>)   :: Doc -> Doc -> Doc    // concats two documents into a single document.
// nil    :: Doc                  // empty document.
// text   :: String -> Doc        // converts a string into a document
// line   :: Doc                  // a line break document.
// nest   :: Int -> Doc -> Doc    // adds indentation to document.
// layout :: Doc -> String        // converts the document back into a string.

export interface Doc {

}

class Text implements Doc {
    readonly inner : string;
    constructor(inner : string) {
        this.inner = inner;
    }
}

class Newline implements Doc {
    readonly inner: string;
    constructor() {
        this.inner = '\n';
    }
}

class FlexWS implements Doc {
    shouldNotLeaveSpace(buffer : string[]) : boolean {
        if (buffer.length == 0)
            return true;
        let lastItem = buffer[buffer.length - 1];
        if (isWhitespace(lastItem))
            return true;
        if (isOperator(lastItem))
            return true;
        return false;
    }
}

class Nest implements Doc {
    readonly indent : number;
    readonly next : Doc;
    constructor(indent: number, next: Doc) {
        this.indent = indent;
        this.next = next;
    }
}

class Concat implements Doc {
    readonly list : Doc[];
    constructor(list : Doc[]) {
        this.list = list;
    }
}

export function empty() {
    return new Text('');
}

export function text(str : string) {
    return new Text(str);
}

export function line() {
    return new Newline();
}

export function flexWS() {
    return new FlexWS();
}

export function nest(indent : number, next : Doc) {
    return new Nest(indent, next);
}

export function concat(...docs : Doc[]) {
    return new Concat(docs);
}

export function layout(doc : Doc) : string {
    let buffer : string[] = [];
    _normalize(doc, buffer, 0);
    return buffer.join('');
}

function _indent(indent : number) : string {
    let result : string[] = [];
    for (var i = 0; i < indent; ++i) {
        result.push(' ');
    }
    return result.join('');
}

function _normalize(doc : Doc, buffer : string[], indent : number) : void {
    if (doc instanceof Text) {
        buffer.push(doc.inner);
    } else if (doc instanceof Newline) {
        buffer.push('\n' + _indent(indent));
    } else if (doc instanceof FlexWS) {
        if (doc.shouldNotLeaveSpace(buffer)) {
            buffer.push('');
        } else {
            buffer.push(' ');
        }
    } else if (doc instanceof Nest) {
        _normalize(doc.next, buffer, indent + doc.indent);
    } else if (doc instanceof Concat) {
        doc.list.forEach((inner) => {
            _normalize(inner, buffer, indent);
        });
    }
}

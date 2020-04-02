"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Term {
    constructor(value) {
        this.value = value;
    }
    eq(t) {
        return this.value === t.value;
    }
}
exports.Term = Term;
class NamedNode extends Term {
}
exports.NamedNode = NamedNode;
class BlankNode extends Term {
}
exports.BlankNode = BlankNode;
class Literal extends Term {
    constructor(value, datatype, language) {
        super(value);
        this.datatype = datatype;
        this.language = language;
    }
}
exports.Literal = Literal;

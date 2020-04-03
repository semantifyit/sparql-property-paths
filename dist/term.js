"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const CustomSet_1 = require("./CustomSet");
class Term {
    constructor(value) {
        this.value = value;
    }
    eq(t) {
        return utils_1.areSameClass(this, t) && this.value === t.value;
    }
    id() {
        return this.constructor.name + "_" + this.value;
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
class TermPatternSet extends CustomSet_1.CustomSet {
    stringifyItem(t) {
        return t ? t.id() : "";
    }
}
exports.TermPatternSet = TermPatternSet;

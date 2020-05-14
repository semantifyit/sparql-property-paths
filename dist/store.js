"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function matchSingle(p1, p2) {
    return p1 === undefined || (utils_1.areSameClass(p1, p2) && p1.value === p2.value);
}
function matchTriple([s1, p1, o1], [s2, p2, o2]) {
    return matchSingle(s1, s2) && matchSingle(p1, p2) && matchSingle(o1, o2);
}
// TODO needs to be made more performant, e.g with maps
class Store {
    constructor() {
        this._triples = [];
    }
    *[Symbol.iterator]() {
        yield* this._triples;
    }
    add(t) {
        this._triples.push(t);
    }
    *triples(tIn) {
        for (const t of this._triples) {
            if (matchTriple(tIn, t)) {
                yield t;
            }
        }
    }
}
exports.Store = Store;

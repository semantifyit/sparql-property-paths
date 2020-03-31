"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const paths_1 = require("./paths");
class Graph {
    constructor() {
        this.store = new store_1.Store();
    }
    add(t) {
        this.store.add(t);
    }
    *triples(t) {
        // console.log({ t });
        const [s, p, o] = t;
        if (p instanceof paths_1.Path) {
            for (const [_s, _o] of p.eval(this, s, o)) {
                yield [_s, p, _o];
            }
        }
        else {
            for (const [_s, _p, _o] of this.store.triples([s, p, o])) {
                yield [_s, _p, _o];
            }
        }
    }
}
exports.Graph = Graph;

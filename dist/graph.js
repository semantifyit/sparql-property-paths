"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = __importDefault(require("jsonld"));
const store_1 = require("./store");
const paths_1 = require("./paths");
const utils_1 = require("./utils");
const replace_1 = require("./replace");
class Graph {
    constructor() {
        this.store = new store_1.Store();
        this.bNodeIssuer = utils_1.bNodeIssuer();
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
    includes(t) {
        return !utils_1.isEmptyIterable(this.triples(t));
    }
    async serialize({ format, prefixes, replaceNodes, }) {
        let doc = "";
        for (const [s, p, o] of this.store) {
            const line = `${s.nt()} ${p.nt()} ${o.nt()} .\n`;
            doc += line;
        }
        if (format === "nt") {
            return doc;
        }
        // console.log(doc);
        let jsonldDoc = await jsonld_1.default.fromRDF(doc, { format: "application/n-quads" });
        if (replaceNodes) {
            // console.log(JSON.stringify(jsonldDoc, null, 2));
            // console.log("-----------------------------------");
            jsonldDoc = replace_1.replace(jsonldDoc);
            // console.log(jsonldDoc);
        }
        if (prefixes) {
            jsonldDoc = await jsonld_1.default.compact(jsonldDoc, utils_1.withAtVocabPrefixes(prefixes));
        }
        return JSON.stringify(jsonldDoc);
    }
}
exports.Graph = Graph;

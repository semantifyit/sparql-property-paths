"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sparql_1 = require("./sparql");
const rdfParse_1 = require("./rdfParse");
const paths_1 = require("./paths");
const utils_1 = require("./utils");
const term_1 = require("./term");
function* seqToResult(ite) {
    for (const seq of ite) {
        if (seq[1]) {
            yield seq[1].value;
        }
    }
}
const results = (graph, path, start) => utils_1.takeAll(seqToResult(paths_1.evalPath(graph, [new term_1.NamedNode(start), path, undefined])));
const usePrefix = (str, prefix) => Object.entries(prefix).reduce((str, [pref, uri]) => str.replace(new RegExp(`^${pref}:`), uri), str);
exports.getGraph = (doc, type) => {
    switch (type) {
        case "jsonld":
            return rdfParse_1.fromJsonLD(doc);
        case "turtle":
            return rdfParse_1.fromTtl(doc);
        default:
            throw new Error(`Unsupported input type: ${type}`);
    }
};
exports.SPPEvaluator = async (doc, inputType) => {
    const graph = await exports.getGraph(doc, inputType);
    return (base, spp, prefix = {}) => results(graph, sparql_1.parseSPP(spp, prefix), usePrefix(base, prefix));
};
// const start = async () => {
//   const evalPP = await SPPEvaluator(
//     `
//     @prefix : <http://example.org/> .
//  :A0 :P :A1, :A2 .
//  :A1 :P :A0, :A2 .
//  :A2 :P :A0, :A1 .`,
//     "turtle",
//   );
//   console.log(evalPP("http://example.org/A0", "((:P)*)*", { "": "http://example.org/" }));
// };
// start();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sparql_1 = require("./sparql");
const rdfParse_1 = require("./rdfParse");
const paths_1 = require("./paths");
exports.evalPath = paths_1.evalPath;
const utils_1 = require("./utils");
exports.takeAll = utils_1.takeAll;
const term_1 = require("./term");
exports.NamedNode = term_1.NamedNode;
exports.Literal = term_1.Literal;
function* seqToResult(ite) {
    for (const seq of ite) {
        if (seq[1]) {
            yield seq[1].value;
        }
    }
}
exports.toTerm = (str) => str.startsWith("_:") ? new term_1.BlankNode(str) : new term_1.NamedNode(str);
const results = (graph, path, start) => utils_1.takeAll(seqToResult(paths_1.evalPath(graph, [exports.toTerm(start), path, undefined])));
const usePrefix = (str, prefix) => Object.entries(prefix).reduce((str, [pref, uri]) => str.replace(new RegExp(`^${pref}:`), uri), str);
exports.SPPEvaluator = async (doc, inputType) => {
    const graph = await rdfParse_1.getGraph(doc, inputType);
    const spp = (base, spp, prefix = {}) => results(graph, sparql_1.parseSPP(spp, prefix), usePrefix(base, prefix));
    return [spp, graph];
};
// const start = async () => {
//     const evalPP = await SPPEvaluator(
//       `
//       @prefix : <http://example.org/> .
//    :A0 :P :A1, :A2 .
//    :A1 :P :A0, :A2 .
//    :A2 :P :A0, :A1 .`,
//       "turtle",
//     );
//     console.log(evalPP("http://example.org/A0", "((:P)*)*", { "": "http://example.org/" }));
// };
// start();

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
//     // `
//     // prefix p: <http://ex.com/>
//     // p:a p:x p:b .
//     // p:b p:y p:c .
//     // p:c p:z p:d .
//     // p:c p:z p:a .`,
//     `@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
//     @prefix rdfs:	<http://www.w3.org/2000/01/rdf-schema#> .
//     @prefix ex:	<http://www.example.org/schema#>.
//     @prefix in:	<http://www.example.org/instance#>.
//     in:a ex:p1 in:b .
//     in:a ex:p2 in:c .
//     in:a ex:p3 in:d .`,
//     "turtle",
//   );
//   console.log(
//     evalPP("http://www.example.org/instance#a", "!(ex:p1|ex:p2)", {
//       ex: "http://www.example.org/schema#",
//       in: "http://www.example.org/instance#",
//     }),
//   );
//   // console.log(evalPP("http://ex.com/a", "!(:y|:z)", { "": "http://ex.com/" }));
// };
// start();

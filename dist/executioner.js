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
const getGraph = (doc, type) => {
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
    const graph = await getGraph(doc, inputType);
    return (base, spp, prefix = {}) => results(graph, sparql_1.parseSPP(spp, prefix), usePrefix(base, prefix));
};
const start = async () => {
    const evalPP = await exports.SPPEvaluator(`
    prefix p: <http://ex.com/>
    p:a p:x p:b .
    p:a p:str "va"@de .
    p:a p:num "12"^^<http://www.w3.org/2001/XMLSchema#integer> .
    p:a p:b [p:s "sd"].
    p:b p:y p:c .
    p:c p:z p:d .
    p:c p:z p:a .`, "turtle");
    const evalPP2 = await exports.SPPEvaluator({
        "@context": {
            p: "http://ex.com/",
        },
        "@graph": [
            {
                "@id": "p:a",
                "p:str": { "@value": "valalva", "@language": "de" },
                "p:num": { "@value": "12", "@type": "http://www.w3.org/2001/XMLSchema#integer" },
                "p:x": {
                    "p:y": {
                        "p:z": { "@id": "p:d" },
                    },
                },
            },
        ],
    }, "jsonld");
    console.log(evalPP("http://ex.com/a", ":x", { "": "http://ex.com/" }));
    //console.log(evalPP2("http://ex.com/a", ":x", { "": "http://ex.com/" }));
};
start();

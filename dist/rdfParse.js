"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = __importDefault(require("jsonld"));
const N3 = __importStar(require("n3"));
const graph_1 = require("./graph");
const term_1 = require("./term");
const utils_1 = require("./utils");
const jsonLdParseTermToTerm = (t, bNodeIssuer, keepBnodeIds) => {
    var _a;
    switch (t.termType) {
        case "NamedNode":
            return new term_1.NamedNode(t.value);
        case "BlankNode":
            return new term_1.BlankNode(keepBnodeIds ? t.value : bNodeIssuer(t.value));
        case "Literal":
            return new term_1.Literal(t.value, (_a = t === null || t === void 0 ? void 0 : t.datatype) === null || _a === void 0 ? void 0 : _a.value, t.language);
        default:
            throw new Error("JSONLD unknown term type: " + t.termType);
    }
};
exports.fromJsonLD = async (doc, g = new graph_1.Graph(), { keepBnodeIds } = { keepBnodeIds: false }) => {
    let obj = doc;
    if (typeof doc === "string") {
        obj = JSON.parse(doc);
    }
    const nquads = (await jsonld_1.default.toRDF(obj));
    const getBnode = utils_1.getBNodeIssuer(g.bNodeIssuer);
    for (const quad of nquads) {
        g.add([
            jsonLdParseTermToTerm(quad.subject, getBnode, keepBnodeIds),
            jsonLdParseTermToTerm(quad.predicate, getBnode, keepBnodeIds),
            jsonLdParseTermToTerm(quad.object, getBnode, keepBnodeIds),
        ]);
    }
    return g;
};
// eslint-disable-next-line  @typescript-eslint/camelcase
const n3TermToTriple = (t) => {
    switch (t.termType) {
        case "NamedNode":
            return new term_1.NamedNode(t.value);
        case "BlankNode":
            return new term_1.BlankNode(`_:${t.value}`);
        case "Literal":
            return new term_1.Literal(t.value, t.datatype.value, t.language);
        default:
            throw new Error("JSONLD unknown term type: " + t.termType);
    }
};
exports.fromTtl = async (str, g = new graph_1.Graph()) => {
    const parser = new N3.Parser();
    const quads = parser.parse(str);
    for (const quad of quads) {
        g.add([
            n3TermToTriple(quad.subject),
            n3TermToTriple(quad.predicate),
            n3TermToTriple(quad.object),
        ]);
    }
    return g;
};
exports.getGraph = (doc, type) => {
    switch (type) {
        case "jsonld":
            return exports.fromJsonLD(doc);
        case "turtle":
            return exports.fromTtl(doc);
        default:
            throw new Error(`Unsupported input type: ${type}`);
    }
};

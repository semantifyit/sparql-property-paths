"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./executioner"));
var rdfParse_1 = require("./rdfParse");
exports.fromJsonLD = rdfParse_1.fromJsonLD;
exports.getGraph = rdfParse_1.getGraph;
var sparql_1 = require("./sparql");
exports.parseSPP = sparql_1.parseSPP;
var utils_1 = require("./utils");
exports.isEmptyIterable = utils_1.isEmptyIterable;

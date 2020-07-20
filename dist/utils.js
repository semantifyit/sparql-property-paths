"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = (arr) => arr[0];
exports.last = (arr) => arr.slice(-1)[0];
exports.allButFist = (arr) => arr.slice(1);
exports.allButLast = (arr) => arr.slice(0, -1);
exports.takeAll = (iterator) => [...iterator];
exports.areSameClass = (o1, o2) => o1.constructor === o2.constructor;
exports.isEmptyIterable = (iterable) => {
    for (const _ of iterable) {
        return false;
    }
    return true;
};
exports.bNodeIssuer = (prefix = "b") => {
    let counter = 0;
    return () => `_:${prefix}${++counter}`;
};
exports.getBNodeIssuer = (issuer) => {
    const bNodeTable = {};
    return (originBNodeVal) => {
        if (!bNodeTable[originBNodeVal]) {
            bNodeTable[originBNodeVal] = issuer();
        }
        return bNodeTable[originBNodeVal];
    };
};
exports.clone = (o) => JSON.parse(JSON.stringify(o));
exports.withAtVocabPrefixes = (prefixes) => {
    const newPrefixes = exports.clone(prefixes);
    if (newPrefixes[""]) {
        newPrefixes["@vocab"] = newPrefixes[""];
        delete newPrefixes[""];
    }
    return newPrefixes;
};
function* map(iter, fn) {
    for (let x of iter) {
        yield fn(x);
    }
}
exports.map = map;
function reduce(iter, fn, initial) {
    let val = initial;
    for (let x of iter) {
        val = fn(val, x);
    }
    return val;
}
exports.reduce = reduce;

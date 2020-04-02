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

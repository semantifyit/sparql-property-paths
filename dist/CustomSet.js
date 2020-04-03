"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomSet {
    constructor() {
        this.map = new Map();
    }
    [Symbol.iterator]() {
        return this.values();
    }
    add(i) {
        this.map.set(this.stringifyItem(i), i);
    }
    values() {
        return this.map.values();
    }
    has(i) {
        return this.map.has(this.stringifyItem(i));
    }
}
exports.CustomSet = CustomSet;

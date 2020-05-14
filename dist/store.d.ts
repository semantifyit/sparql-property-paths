import { Triple, TriplePattern } from "./term";
export declare class Store {
    _triples: Triple[];
    [Symbol.iterator](): Generator<Triple, void, undefined>;
    add(t: Triple): void;
    triples(tIn: TriplePattern): Generator<Triple>;
}

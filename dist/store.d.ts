import { Triple, TriplePattern } from "./term";
export declare class Store {
    _triples: Triple[];
    add(t: Triple): void;
    triples(tIn: TriplePattern): Generator<Triple>;
}

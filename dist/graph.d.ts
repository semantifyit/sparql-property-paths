import { Store } from "./store";
import { Triple, TriplePatternWithPath, TriplePattern } from "./term";
export declare class Graph {
    store: Store;
    add(t: Triple): void;
    triples(t: TriplePattern): Generator<Triple>;
    triples(t: TriplePatternWithPath): Generator<TriplePatternWithPath>;
    includes(t: TriplePattern): boolean;
}
export declare type Prefixes = Record<string, string>;

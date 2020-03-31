import { Store } from "./store";
import { Triple, TriplePatternWithPath } from "./term";
export declare class Graph {
    store: Store;
    add(t: Triple): void;
    triples(t: TriplePatternWithPath): Generator<TriplePatternWithPath>;
}
export declare type Prefixes = Record<string, string>;

import { Store } from "./store";
import { Triple, TriplePatternWithPath, TriplePattern } from "./term";
export declare class Graph {
    store: Store;
    bNodeIssuer: () => string;
    add(t: Triple): void;
    triples(t: TriplePattern): Generator<Triple>;
    triples(t: TriplePatternWithPath): Generator<TriplePatternWithPath>;
    includes(t: TriplePattern): boolean;
    _serializeToN3(): string;
    serialize({ format, prefixes, replaceNodes, }: {
        format: "jsonld" | "nt" | "json";
        prefixes?: Record<string, string>;
        replaceNodes?: boolean;
    }): Promise<string>;
}
export declare type Prefixes = Record<string, string>;

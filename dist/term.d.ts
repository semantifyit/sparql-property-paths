import { Path } from "./paths";
export declare type Triple = [NamedNode | BlankNode, NamedNode, NamedNode | BlankNode | Literal];
export declare type TermPattern = NamedNode | BlankNode | Literal | undefined;
export declare type TriplePattern = [TermPattern, TermPattern, TermPattern];
export declare type TriplePatternWithPath = [TermPattern, TermPattern | Path, TermPattern];
export declare abstract class Term {
    constructor(value: string);
    eq(t: Term): boolean;
    value: string;
}
export declare class NamedNode extends Term {
}
export declare class BlankNode extends Term {
}
export declare class Literal extends Term {
    datatype?: string;
    language?: string;
    constructor(value: string, datatype?: string, language?: string);
}

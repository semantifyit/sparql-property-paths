import { Path } from "./paths";
import { CustomSet } from "./CustomSet";
export declare type Triple = [NamedNode | BlankNode, NamedNode, NamedNode | BlankNode | Literal];
export declare type TermPattern = NamedNode | BlankNode | Literal | undefined;
export declare type TriplePattern = [TermPattern, TermPattern, TermPattern];
export declare type TriplePatternWithPath = [TermPattern, TermPattern | Path, TermPattern];
export declare abstract class Term {
    constructor(value: string);
    eq(t: Term): boolean;
    id(): string;
    value: string;
    nt(): string;
}
export declare class NamedNode extends Term {
    nt(): string;
}
export declare class BlankNode extends Term {
    nt(): string;
}
export declare class Literal extends Term {
    datatype?: string;
    language?: string;
    constructor(value: string, datatype?: string, language?: string);
    nt(): string;
}
export declare class TermPatternSet extends CustomSet<TermPattern> {
    stringifyItem(t: TermPattern): string;
}

import { Graph } from "./graph";
import { TermPattern, TriplePatternWithPath, NamedNode } from "./term";
declare type PathOrNamedNode = Path | NamedNode;
export declare type EvalPathResult = [TermPattern, TermPattern];
export declare abstract class Path {
    abstract eval(g: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}
export declare class PathInv extends Path {
    arg: PathOrNamedNode;
    constructor(arg: PathOrNamedNode);
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}
export declare class PathSeq extends Path {
    args: PathOrNamedNode[];
    constructor(args: PathOrNamedNode[]);
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult, void, unknown>;
}
export declare class PathAlt extends Path {
    args: PathOrNamedNode[];
    constructor(args: PathOrNamedNode[]);
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult, void, unknown>;
}
export declare class PathMult extends Path {
    arg: PathOrNamedNode;
    mod: "*" | "+" | "?";
    withHead: boolean;
    withTail: boolean;
    constructor(arg: PathOrNamedNode, mod: "*" | "+" | "?");
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}
export declare class PathNeg extends Path {
    args: PathOrNamedNode[];
    constructor(arg: PathOrNamedNode);
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}
export declare function evalPath(graph: Graph, t: TriplePatternWithPath): Generator<EvalPathResult>;
export {};

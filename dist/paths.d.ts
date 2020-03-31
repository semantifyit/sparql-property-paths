import { Graph } from "./graph";
import { TermPattern, TriplePatternWithPath, NamedNode } from "./term";
declare type PathOrNamedNode = Path | NamedNode;
export declare type EvalPathResult = [TermPattern, TermPattern];
export declare abstract class Path {
    abstract eval(g: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}
export declare class PathAlt extends Path implements Path {
    args: PathOrNamedNode[];
    constructor(args: PathOrNamedNode[]);
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult, void, unknown>;
}
export declare class PathSeq extends Path {
    args: PathOrNamedNode[];
    constructor(args: PathOrNamedNode[]);
    eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult, void, unknown>;
}
export declare function evalPath(graph: Graph, t: TriplePatternWithPath): Generator<EvalPathResult>;
export {};

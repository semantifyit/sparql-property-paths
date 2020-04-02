import { Graph } from "./graph";
import { TermPattern, TriplePatternWithPath, NamedNode } from "./term";
import * as u from "./utils";

type PathOrNamedNode = Path | NamedNode;

export type EvalPathResult = [TermPattern, TermPattern];

export abstract class Path {
  abstract eval(g: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}

export class PathInv extends Path {
  arg: PathOrNamedNode;

  constructor(arg: PathOrNamedNode) {
    super();
    this.arg = arg;
  }

  *eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult> {
    // finding path from obj to subj, inv in evalPath call and return inverse
    // data :a :x :b
    // path :b ^:x :a
    // call :a :x :b
    // return: found path from :b to :a
    for (const [s, o] of evalPath(graph, [obj, this.arg, subj])) {
      yield [o, s];
    }
  }
}

export class PathAlt extends Path {
  args: PathOrNamedNode[];

  constructor(args: PathOrNamedNode[]) {
    super();
    this.args = args;
  }

  *eval(graph: Graph, subj: TermPattern, obj: TermPattern) {
    // return all paths of each agr (inclusive or)
    for (const x of this.args) {
      for (const y of evalPath(graph, [subj, x, obj])) {
        yield y;
      }
    }
  }
}

export class PathSeq extends Path {
  args: PathOrNamedNode[];

  constructor(args: PathOrNamedNode[]) {
    super();
    this.args = args;
  }

  *eval(graph: Graph, subj: TermPattern, obj: TermPattern) {
    // could do with one recursive function, more optimal with two:
    // one starting from fixed subj the other starting from fixed obj
    function* evalSeq(
      paths: PathOrNamedNode[],
      subj: TermPattern,
      obj: TermPattern,
    ): Generator<EvalPathResult> {
      if (paths.length > 1) {
        for (const [s, o] of evalPath(graph, [subj, paths[0], undefined])) {
          for (const [, r] of evalSeq(u.allButFist(paths), o, obj)) {
            yield [s, r];
          }
        }
      } else {
        yield* evalPath(graph, [subj, paths[0], obj]);
      }
    }

    // backwards
    function* evalSeqBw(
      paths: PathOrNamedNode[],
      subj: TermPattern,
      obj: TermPattern,
    ): Generator<EvalPathResult> {
      if (paths.length > 1) {
        for (const [s, o] of evalPath(graph, [undefined, u.last(paths), obj])) {
          for (const [r] of evalSeqBw(u.allButLast(paths), subj, s)) {
            yield [r, o];
          }
        }
      } else {
        yield* evalPath(graph, [subj, paths[0], obj]);
      }
    }

    if (subj) {
      yield* evalSeq(this.args, subj, obj);
    } else if (obj) {
      yield* evalSeqBw(this.args, subj, obj);
    } else {
      // no fixed obj or subj, either fn is fine
      yield* evalSeq(this.args, subj, obj);
    }
  }
}

export class PathNeg extends Path {
  args: PathOrNamedNode[];

  constructor(arg: PathOrNamedNode) {
    super();
    if (arg instanceof PathInv && arg.arg instanceof NamedNode) {
      this.args = [arg.arg];
    } else if (arg instanceof PathAlt) {
      this.args = arg.args;
    } else {
      throw new Error(`Invalid negated path argument: ${arg.toString()}`);
    }
    // all args are be in alt (iri | iri2 | ^iri3...) ^?iri (| ^?iri)+
  }

  *eval(graph: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult> {
    for (const [s, p, o] of graph.triples([subj, undefined, obj])) {
      let returnTripple = true;
      for (const arg of this.args) {
        if (arg instanceof NamedNode) {
          if (arg.eq(p)) {
            returnTripple = false;
            break;
          }
        } else if (arg instanceof PathInv && arg.arg instanceof NamedNode) {
          // must be inv of path
          if (graph.includes([obj, arg.arg, subj])) {
            returnTripple = false;
            break;
          }
        } else {
          throw new Error(`Invalid negated path argument: ${arg.toString()}`);
        }
      }
      if (returnTripple) {
        yield [s, o];
      }
    }
  }
}

export function* evalPath(graph: Graph, t: TriplePatternWithPath): Generator<EvalPathResult> {
  for (const [s, , o] of graph.triples(t)) {
    yield [s, o];
  }
}

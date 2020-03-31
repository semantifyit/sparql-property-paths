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

    if (obj) {
      yield* evalSeqBw(this.args, subj, obj);
    } else {
      yield* evalSeq(this.args, subj, obj);
    }
  }
}

export function* evalPath(graph: Graph, t: TriplePatternWithPath): Generator<EvalPathResult> {
  for (const [s, , o] of graph.triples(t)) {
    yield [s, o];
  }
}

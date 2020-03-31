import { Graph } from "./graph";
import { TriplePattern, TermPattern, TriplePatternWithPath, NamedNode } from "./term";

type PathOrNamedNode = Path | NamedNode;

export type EvalPathResult = [TermPattern, TermPattern];

export abstract class Path {
  abstract eval(g: Graph, subj: TermPattern, obj: TermPattern): Generator<EvalPathResult>;
}

export class PathAlt extends Path implements Path {
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
    function* eval_seq(
      paths: PathOrNamedNode[],
      subj: TermPattern,
      obj: TermPattern,
    ): Generator<EvalPathResult> {
      if (paths.length > 1) {
        for (const [s, o] of evalPath(graph, [subj, paths[0], undefined])) {
          for (const r of eval_seq(paths.slice(1), o, obj)) {
            yield [s, r[1]];
          }
        }
      } else {
        for (const [s, o] of evalPath(graph, [subj, paths[0], obj])) {
          yield [s, o];
        }
      }
    }

    if (subj) {
      yield* eval_seq(this.args, subj, obj);
    } else if (obj) {
      throw new Error("no obj seq");
    } else {
      yield* eval_seq(this.args, subj, obj);
    }
  }
}

export function* evalPath(graph: Graph, t: TriplePatternWithPath): Generator<EvalPathResult> {
  for (const [s, p, o] of graph.triples(t)) {
    yield [s, o];
  }
}

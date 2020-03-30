import { Graph, TriplePattern } from "./graph";

type EvalPathResult = [string, string];

export abstract class Path {
  abstract eval(g: Graph, sub, obj): Generator<EvalPathResult>;
}

export class PathAlt extends Path implements Path {
  args;
  constructor(args) {
    super();
    this.args = args;
  }
  *eval(graph, subj, obj) {
    for (const x of this.args) {
      for (const y of evalPath(graph, [subj, x, obj])) {
        yield y;
      }
    }
  }
}

export class PathSeq extends Path {
  args;
  constructor(args) {
    super();
    this.args = args;
  }
  *eval(graph, subj, obj) {
    function* eval_seq(paths, subj, obj) {
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

export function* evalPath(
  graph: Graph,
  t: TriplePattern
): Generator<EvalPathResult> {
  for (const [s, p, o] of graph.triples(t)) {
    yield [s, o];
  }
}

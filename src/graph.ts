import { Store } from "./store";
import { Path } from "./paths";
import { Triple, TriplePatternWithPath, TriplePattern } from "./term";
import { isEmptyIterable } from "./utils";

export class Graph {
  store = new Store();

  add(t: Triple) {
    this.store.add(t);
  }

  triples(t: TriplePattern): Generator<Triple>;
  triples(t: TriplePatternWithPath): Generator<TriplePatternWithPath>;
  *triples(t: TriplePattern | TriplePatternWithPath) {
    // console.log({ t });
    const [s, p, o] = t;
    if (p instanceof Path) {
      for (const [_s, _o] of p.eval(this, s, o)) {
        yield [_s, p, _o];
      }
    } else {
      for (const [_s, _p, _o] of this.store.triples([s, p, o])) {
        yield [_s, _p, _o];
      }
    }
  }

  includes(t: TriplePattern): boolean {
    return !isEmptyIterable(this.triples(t));
  }
}

export type Prefixes = Record<string, string>;

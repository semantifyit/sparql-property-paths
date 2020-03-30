import Store, { Triple } from "./store";
import { Path } from "./paths";

export type TriplePattern = [
  string | undefined,
  string | Path,
  string | undefined
];

export class Graph {
  store = new Store();

  add(t: Triple) {
    this.store.add(t);
  }

  *triples(t: TriplePattern): Generator<TriplePattern> {
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
}

export type Prefixes = Record<string, string>;

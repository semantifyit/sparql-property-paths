import jsonld from "jsonld";

import { Store } from "./store";
import { Path } from "./paths";
import { Triple, TriplePatternWithPath, TriplePattern } from "./term";
import { bNodeIssuer, isEmptyIterable, map, takeAll, withAtVocabPrefixes } from "./utils";
import { replace } from "./replace";

export class Graph {
  store = new Store();

  bNodeIssuer = bNodeIssuer();

  add(t: Triple) {
    this.store.add(t);
  }

  triples(t: TriplePattern): Generator<Triple>;
  triples(t: TriplePatternWithPath): Generator<TriplePatternWithPath>;
  *triples(t: TriplePattern | TriplePatternWithPath) {
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

  _serializeToN3(): string {
    let doc = "";
    for (const [s, p, o] of this.store) {
      const line = `${s.nt()} ${p.nt()} ${o.nt()} .\n`;
      doc += line;
    }
    return doc;
  }

  async serialize({
    format,
    prefixes,
    replaceNodes,
  }: {
    format: "jsonld" | "nt" | "json";
    prefixes?: Record<string, string>;
    replaceNodes?: boolean;
  }): Promise<string> {
    switch (format) {
      case "nt":
        const doc = this._serializeToN3();
        return doc;
      case "jsonld": {
        const triples = this._serializeToN3();
        let jsonldDoc: any = await jsonld.fromRDF(triples as any, {
          format: "application/n-quads",
        });

        if (replaceNodes) {
          jsonldDoc = replace(jsonldDoc);
        }

        if (prefixes) {
          jsonldDoc = await jsonld.compact(jsonldDoc, withAtVocabPrefixes(prefixes));
        }

        return JSON.stringify(jsonldDoc);
      }
      case "json": {
        const triples = map(this.store, ([s, p, o]) => [s.value, p.value, o.value]);
        return JSON.stringify(takeAll(triples));
      }
      default:
        throw new Error(`Format "${format}" not supported`);
    }
  }
}

export type Prefixes = Record<string, string>;

import jsonld from "jsonld";

import { Store } from "./store";
import { Path } from "./paths";
import { Triple, TriplePatternWithPath, TriplePattern } from "./term";
import { bNodeIssuer, isEmptyIterable, withAtVocabPrefixes } from "./utils";
import { Util } from "n3";
import prefix = Util.prefix;
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

  async serialize({
    format,
    prefixes,
    replaceNodes,
  }: {
    format: "jsonld" | "nt";
    prefixes?: Record<string, string>;
    replaceNodes: boolean;
  }): Promise<string> {
    let doc = "";
    for (const [s, p, o] of this.store) {
      const line = `${s.nt()} ${p.nt()} ${o.nt()} .\n`;
      doc += line;
    }
    if (format === "nt") {
      return doc;
    }
    // console.log(doc);
    let jsonldDoc: any = await jsonld.fromRDF(doc as any, { format: "application/n-quads" });

    if (replaceNodes) {
      // console.log(JSON.stringify(jsonldDoc, null, 2));
      // console.log("-----------------------------------");
      jsonldDoc = replace(jsonldDoc);
      // console.log(jsonldDoc);
    }

    if (prefixes) {
      jsonldDoc = await jsonld.compact(jsonldDoc, withAtVocabPrefixes(prefixes));
    }

    return JSON.stringify(jsonldDoc);
  }
}

export type Prefixes = Record<string, string>;

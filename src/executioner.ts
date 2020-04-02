import { parseSPP, PathObj } from "./sparql";
import { fromTtl, fromJsonLD } from "./rdfParse";
import { evalPath, EvalPathResult } from "./paths";
import { takeAll } from "./utils";
import { Graph, Prefixes } from "./graph";
import { NamedNode } from "./term";

function* seqToResult(ite: Generator<EvalPathResult>): Generator<string> {
  for (const seq of ite) {
    if (seq[1]) {
      yield seq[1].value;
    }
  }
}

const results = (graph: Graph, path: PathObj, start: string) =>
  takeAll(seqToResult(evalPath(graph, [new NamedNode(start), path, undefined])));

const usePrefix = (str: string, prefix: Prefixes): string =>
  Object.entries(prefix).reduce(
    (str, [pref, uri]) => str.replace(new RegExp(`^${pref}:`), uri),
    str,
  );

type InputType = "jsonld" | "turtle";
export const getGraph = (doc: any, type: InputType): Promise<Graph> => {
  switch (type) {
    case "jsonld":
      return fromJsonLD(doc);
    case "turtle":
      return fromTtl(doc);
    default:
      throw new Error(`Unsupported input type: ${type}`);
  }
};

export const SPPEvaluator = async (doc: any, inputType: InputType) => {
  const graph = await getGraph(doc, inputType);

  return (base: string, spp: string, prefix: Prefixes = {}) =>
    results(graph, parseSPP(spp, prefix), usePrefix(base, prefix));
};

// const start = async () => {
//   const evalPP = await SPPEvaluator(
//     // `
//     // prefix p: <http://ex.com/>
//     // p:a p:x p:b .
//     // p:b p:y p:c .
//     // p:c p:z p:d .
//     // p:c p:z p:a .`,
//     `@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
//     @prefix rdfs:	<http://www.w3.org/2000/01/rdf-schema#> .
//     @prefix ex:	<http://www.example.org/schema#>.
//     @prefix in:	<http://www.example.org/instance#>.

//     in:a ex:p1 in:b .
//     in:a ex:p2 in:c .
//     in:a ex:p3 in:d .`,
//     "turtle",
//   );

//   console.log(
//     evalPP("http://www.example.org/instance#a", "!(ex:p1|ex:p2)", {
//       ex: "http://www.example.org/schema#",
//       in: "http://www.example.org/instance#",
//     }),
//   );
//   // console.log(evalPP("http://ex.com/a", "!(:y|:z)", { "": "http://ex.com/" }));
// };

// start();

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
//     `
//     @prefix : <http://example.org/> .
//  :A0 :P :A1, :A2 .
//  :A1 :P :A0, :A2 .
//  :A2 :P :A0, :A1 .`,
//     "turtle",
//   );

//   console.log(evalPP("http://example.org/A0", "((:P)*)*", { "": "http://example.org/" }));
// };

// start();

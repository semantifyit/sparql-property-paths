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
const getGraph = (doc: any, type: InputType): Promise<Graph> => {
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

const start = async () => {
  const evalPP = await SPPEvaluator(
    `
    prefix p: <http://ex.com/>
    p:a p:x p:b .
    p:a p:str "va"@de .
    p:a p:num "12"^^<http://www.w3.org/2001/XMLSchema#integer> .
    p:a p:b [p:s "sd"].
    p:b p:y p:c .
    p:c p:z p:d .
    p:c p:z p:a .`,
    "turtle",
  );

  const evalPP2 = await SPPEvaluator(
    {
      "@context": {
        p: "http://ex.com/",
      },
      "@graph": [
        {
          "@id": "p:a",
          "p:str": { "@value": "valalva", "@language": "de" },
          "p:num": { "@value": "12", "@type": "http://www.w3.org/2001/XMLSchema#integer" },
          "p:x": {
            "p:y": {
              "p:z": { "@id": "p:d" },
            },
          },
        },
      ],
    },
    "jsonld",
  );

  console.log(evalPP("http://ex.com/a", ":x", { "": "http://ex.com/" }));
  //console.log(evalPP2("http://ex.com/a", ":x", { "": "http://ex.com/" }));
};

//start();

import { parseSPP, PathObj } from "./sparql";
import { fromTtl, fromJsonLD } from "./rdfParse";
import { evalPath } from "./paths";
import { takeAll } from "./utils";
import { Graph, Prefixes } from "./graph";

function* seqToResult(ite): Generator<string> {
  for (const seq of ite) {
    yield seq[1];
  }
}

const results = (graph: Graph, path: PathObj, start: string) =>
  takeAll(seqToResult(evalPath(graph, [start, path, undefined])));

type InputType = "jsonld" | "ttl";
const getGraph = (doc: any, type: InputType): Promise<Graph> => {
  switch (type) {
    case "jsonld":
      return fromJsonLD(doc);
    case "ttl":
      return fromTtl(doc);
    default:
      throw new Error(`Unsupported input type: ${type}`);
  }
};

const SPPEvaluator = async (doc: any, inputType: InputType) => {
  const graph = await getGraph(doc, inputType);

  return (base: string, spp: string, prefix?: Prefixes) =>
    results(graph, parseSPP(spp, prefix), base);
};

const start = async () => {
  const evalPP = await SPPEvaluator(
    `
    prefix p: <http://ex.com/>
    p:a p:x p:b .
    p:b p:y p:c .
    p:c p:z p:d .
    p:c p:z p:a .`,
    "ttl"
  );

  const evalPP2 = await SPPEvaluator(
    {
      "@context": {
        p: "http://ex.com/"
      },
      "@graph": [
        {
          "@id": "p:a",
          "p:x": {
            "p:y": {
              "p:z": { "@id": "p:d" }
            }
          }
        }
      ]
    },
    "jsonld"
  );

  console.log(evalPP("http://ex.com/a", ":x|:z", { "": "http://ex.com/" }));
  console.log(evalPP2("http://ex.com/a", ":x|:z", { "": "http://ex.com/" }));
};

start();

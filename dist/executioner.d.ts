import { InputType } from "./rdfParse";
import { evalPath } from "./paths";
import { takeAll } from "./utils";
import { Graph } from "./graph";
import { NamedNode, BlankNode, Literal } from "./term";
export declare const toTerm: (str: string) => NamedNode | BlankNode;
export declare type SPPEval = (base: string, spp: string, prefix?: Record<string, string>) => string[];
export declare const SPPEvaluator: (doc: any, inputType: InputType) => Promise<[SPPEval, Graph]>;
export { evalPath, Literal, NamedNode, takeAll };

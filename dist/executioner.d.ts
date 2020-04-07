import { InputType } from "./rdfParse";
import { evalPath } from "./paths";
import { takeAll } from "./utils";
import { Graph } from "./graph";
import { NamedNode, Literal } from "./term";
declare type OutFn = (base: string, spp: string, prefix?: Record<string, string>) => string[];
export declare const SPPEvaluator: (doc: any, inputType: InputType) => Promise<[OutFn, Graph]>;
export { evalPath, Literal, NamedNode, takeAll };

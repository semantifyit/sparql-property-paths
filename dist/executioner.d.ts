import { Graph } from "./graph";
declare type InputType = "jsonld" | "turtle";
export declare const getGraph: (doc: any, type: InputType) => Promise<Graph>;
export declare const SPPEvaluator: (doc: any, inputType: InputType) => Promise<(base: string, spp: string, prefix?: Record<string, string>) => string[]>;
export {};

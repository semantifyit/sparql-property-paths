import { Graph } from "./graph";
export declare const fromJsonLD: (doc: import("jsonld/jsonld-spec").Frame) => Promise<Graph>;
export declare const fromTtl: (str: string) => Promise<Graph>;
export declare type InputType = "jsonld" | "turtle";
export declare const getGraph: (doc: any, type: InputType) => Promise<Graph>;

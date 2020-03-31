import { Graph } from "./graph";
export declare const fromJsonLD: (doc: object) => Promise<Graph>;
export declare const fromTtl: (str: string) => Promise<Graph>;

import { InputType } from "./rdfParse";
export declare const SPPEvaluator: (doc: any, inputType: InputType) => Promise<(base: string, spp: string, prefix?: Record<string, string>) => string[]>;

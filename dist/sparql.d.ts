import { Path } from "./paths";
import { NamedNode } from "./term";
export declare type PathObj = Path | NamedNode;
export declare const parseSPP: (str: string, prefix: Record<string, string>) => NamedNode | Path;

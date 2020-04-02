"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const term_1 = require("./term");
const u = __importStar(require("./utils"));
class Path {
}
exports.Path = Path;
class PathInv extends Path {
    constructor(arg) {
        super();
        this.arg = arg;
    }
    *eval(graph, subj, obj) {
        // finding path from obj to subj, inv in evalPath call and return inverse
        // data :a :x :b
        // path :b ^:x :a
        // call :a :x :b
        // return: found path from :b to :a
        for (const [s, o] of evalPath(graph, [obj, this.arg, subj])) {
            yield [o, s];
        }
    }
}
exports.PathInv = PathInv;
class PathAlt extends Path {
    constructor(args) {
        super();
        this.args = args;
    }
    *eval(graph, subj, obj) {
        // return all paths of each agr (inclusive or)
        for (const x of this.args) {
            for (const y of evalPath(graph, [subj, x, obj])) {
                yield y;
            }
        }
    }
}
exports.PathAlt = PathAlt;
class PathSeq extends Path {
    constructor(args) {
        super();
        this.args = args;
    }
    *eval(graph, subj, obj) {
        // could do with one recursive function, more optimal with two:
        // one starting from fixed subj the other starting from fixed obj
        function* evalSeq(paths, subj, obj) {
            if (paths.length > 1) {
                for (const [s, o] of evalPath(graph, [subj, paths[0], undefined])) {
                    for (const [, r] of evalSeq(u.allButFist(paths), o, obj)) {
                        yield [s, r];
                    }
                }
            }
            else {
                yield* evalPath(graph, [subj, paths[0], obj]);
            }
        }
        // backwards
        function* evalSeqBw(paths, subj, obj) {
            if (paths.length > 1) {
                for (const [s, o] of evalPath(graph, [undefined, u.last(paths), obj])) {
                    for (const [r] of evalSeqBw(u.allButLast(paths), subj, s)) {
                        yield [r, o];
                    }
                }
            }
            else {
                yield* evalPath(graph, [subj, paths[0], obj]);
            }
        }
        if (subj) {
            yield* evalSeq(this.args, subj, obj);
        }
        else if (obj) {
            yield* evalSeqBw(this.args, subj, obj);
        }
        else {
            // no fixed obj or subj, either fn is fine
            yield* evalSeq(this.args, subj, obj);
        }
    }
}
exports.PathSeq = PathSeq;
class PathNeg extends Path {
    constructor(arg) {
        super();
        if (arg instanceof PathInv && arg.arg instanceof term_1.NamedNode) {
            this.args = [arg.arg];
        }
        else if (arg instanceof PathAlt) {
            this.args = arg.args;
        }
        else {
            throw new Error(`Invalid negated path argument: ${arg.toString()}`);
        }
        // all args are be in alt (iri | iri2 | ^iri3...) ^?iri (| ^?iri)+
    }
    *eval(graph, subj, obj) {
        for (const [s, p, o] of graph.triples([subj, undefined, obj])) {
            let returnTripple = true;
            for (const arg of this.args) {
                if (arg instanceof term_1.NamedNode) {
                    if (arg.eq(p)) {
                        returnTripple = false;
                        break;
                    }
                }
                else if (arg instanceof PathInv && arg.arg instanceof term_1.NamedNode) {
                    // must be inv of path
                    if (graph.includes([obj, arg.arg, subj])) {
                        returnTripple = false;
                        break;
                    }
                }
                else {
                    throw new Error(`Invalid negated path argument: ${arg.toString()}`);
                }
            }
            if (returnTripple) {
                yield [s, o];
            }
        }
    }
}
exports.PathNeg = PathNeg;
function* evalPath(graph, t) {
    for (const [s, , o] of graph.triples(t)) {
        yield [s, o];
    }
}
exports.evalPath = evalPath;

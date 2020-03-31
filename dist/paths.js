"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Path {
}
exports.Path = Path;
class PathAlt extends Path {
    constructor(args) {
        super();
        this.args = args;
    }
    *eval(graph, subj, obj) {
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
        function* eval_seq(paths, subj, obj) {
            if (paths.length > 1) {
                for (const [s, o] of evalPath(graph, [subj, paths[0], undefined])) {
                    for (const r of eval_seq(paths.slice(1), o, obj)) {
                        yield [s, r[1]];
                    }
                }
            }
            else {
                for (const [s, o] of evalPath(graph, [subj, paths[0], obj])) {
                    yield [s, o];
                }
            }
        }
        if (subj) {
            yield* eval_seq(this.args, subj, obj);
        }
        else if (obj) {
            throw new Error("no obj seq");
        }
        else {
            yield* eval_seq(this.args, subj, obj);
        }
    }
}
exports.PathSeq = PathSeq;
function* evalPath(graph, t) {
    for (const [s, p, o] of graph.triples(t)) {
        yield [s, o];
    }
}
exports.evalPath = evalPath;

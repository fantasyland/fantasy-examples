var C = require('fantasy-combinators'),
    StateT = require('fantasy-states').StateT,
    IO = require('fantasy-io'),
    combinators = require('fantasy-combinators'),
    fs = require('fs'),

    compose = combinators.compose,
    constant = combinators.constant,

    // Monad which contains state and can do IO.
    M = StateT(IO),

    // Load 2 files, concatenate them to the start state and print the result.
    program =
        M.lift(readFile('package.json'))
        .chain(C.compose(M.modify)(prependTo))
        .chain(C.constant(M.lift(readFile('StateIO.js'))))
        .chain(C.compose(M.modify)(prependTo))
        .chain(C.constant(M.get))
        .chain(C.compose(M.lift)(println));

function prependTo(a) {
    return function(b) {
        return b + a;
    };
}

function readFile(f) {
    return IO(function() {
        return fs.readFileSync(f, 'utf8');
    });
}

function println(s) {
    return IO(function() {
        console.log(s);
    });
}

if(require.main === module)
    program.exec('').unsafePerform();

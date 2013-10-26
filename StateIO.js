var StateT = require('fantasy-states').StateT,
    IO = require('fantasy-io'),
    fs = require('fs'),

    // Monad which contains state and can do IO.
    M = StateT(IO),

    // Load 2 files, concatenate them to the start state and print the result.
    program =
        M.lift(readFile('package.json'))
        .chain(compose(M.modify, prependTo))
        .chain(constant(M.lift(readFile('StateIO.js'))))
        .chain(compose(M.modify, prependTo))
        .chain(constant(M.get))
        .chain(compose(M.lift, println));

function constant(a) {
    return function(b) {
        return a;
    };
}

function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

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

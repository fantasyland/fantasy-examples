var StateT = require('fantasy-states').StateT,
    Promise = require('fantasy-promises'),
    combinators = require('fantasy-combinators'),

    compose = combinators.compose,
    constant = combinators.constant,

    // Monad which contains state and can do Promise.
    M = StateT(Promise),

    // Ask Deep Thought for the ultimate question of Life, the Universe and Everything.
    program =
        M.lift(question())
        .chain(compose(M.modify)(prependTo))
        .chain(constant(M.lift(deepThought())))
        .chain(compose(M.modify)(prependTo))
        .chain(constant(M.get));

function question() {
    return Promise.of('What is the answer to Life, the Universe and Everything?');
}

function deepThought() {
    return new Promise(function(resolve) {
        var sevenAndAHalfMillionYears = 7500000;
        // I suggest we work in milliseconds, as I don't think waiting for
        // seven and a half million years is really just for such example. 
        setTimeout(resolve, sevenAndAHalfMillionYears / 10000, 42);
    });
}

function prependTo(a) {
    return function(b) {
        return b + ' ' + a;
    };
}

if(require.main === module)
    program.exec('>').fork(function(x) {
        console.log(x);
    });

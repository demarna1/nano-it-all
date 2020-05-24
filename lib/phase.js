const Phase = Object.freeze({
    pregame: 'pregame',
    starting: 'starting',
    warmup: 'warmup',
    speed: 'speed',
    ranking: 'ranking',
    postgame: 'postgame'
});

const Subphase = Object.freeze({
    round: 'round',
    prequestion: 'prequestion',
    question: 'question',
    postquestion: 'postquestion',
    answer: 'answer'
});

module.exports = {Phase, Subphase};

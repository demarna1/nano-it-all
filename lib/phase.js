const Phase = Object.freeze({
    pregame: 'pregame',
    starting: 'starting',
    running: 'running',
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

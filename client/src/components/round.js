import React from 'react';

export default function Round(props) {
    let roundTitle;
    let roundDescription;
    if (props.number === 1) {
        roundTitle = 'Warmup Round';
        roundDescription = 'Pick 2 answers!';
    } else if (props.number === 2) {
        roundTitle = 'Speed Round';
        roundDescription = 'Pick 1 answer, in half the time!'
    } else {
        roundTitle = 'Ranking Round';
        roundDescription = 'Rank the answers from first to last'
    }

    return (
        <div>
            <h2>Round {props.number}</h2>
            <div>{roundTitle}</div>
            <div>{roundDescription}</div>
        </div>
    );
}

import React from 'react';

const fields = (round) => {
    switch (round) {
        case 1:
            return {
                title: 'Warmup Round',
                description: 'Pick 2 answers'
            };
        case 2:
            return {
                title: 'Speed Round',
                description: 'Pick 1 answer, in half the time!'
            };
        case 3:
        default:
            return {
                title: 'Final Round',
                description: 'Pick 3 answers'
            };
    }
}

export default function Round(props) {
    const {title, description} = fields(props.round);

    return (
        <div>
            <h2>{title}</h2>
            <div>{description}</div>
        </div>
    );
}

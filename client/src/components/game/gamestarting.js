import React from 'react';

export default function GameStarting(props) {
    return (
        <div>
            <h2>Game is starting!</h2>
            <div className='description'>
                <div>There will be 3 rounds:</div>
                <div>Warmup Round</div>
                <div>Speed Round</div>
                <div>Final Round</div>
            </div>
        </div>
    );
}

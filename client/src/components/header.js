import React from 'react';
import Multitimer from 'components/multitimer';
import {Phase} from 'lib';

const renderTimerContent = (gameState) => {
    if (gameState.phase === Phase.pregame) {
        return (
            <div>
                <h3>Next game starts in:</h3>
                <Multitimer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
            </div>
        );
    } else {
        return <h3>Game in progress. Log in to play now!</h3>
    }
}

export default function Header(props) {
    return (
        <div>
            <h2>Nano-it-all</h2>
            <div>Users online: {props.gameState.online}</div>
            {renderTimerContent(props.gameState)}
        </div>
    );
}

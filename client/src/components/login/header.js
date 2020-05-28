import React from 'react';
import MainBar from 'components/mainbar';
import Multitimer from 'components/timer/multitimer';
import {Phase} from 'lib';

const renderTimerContent = (gameState) => {
    if (gameState.phase === Phase.pregame) {
        return <Multitimer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
    } else {
        return <h3>Game in progress. Log in to play now!</h3>
    }
}

export default function Header(props) {
    return (
        <div>
            <MainBar loggedIn={false} online={props.gameState.online}/>
            {renderTimerContent(props.gameState)}
        </div>
    );
}

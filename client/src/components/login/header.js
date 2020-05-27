import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
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
            <div className='count-wrapper'>
                <PeopleIcon/>
                <div className='count-text'>{props.gameState.online}</div>
            </div>
            <h2>Nano-it-all</h2>
            {renderTimerContent(props.gameState)}
        </div>
    );
}

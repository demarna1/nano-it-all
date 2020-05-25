import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
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
            <div className='online'>
                <PeopleIcon/>
                <div className='onlineCount'>{props.gameState.online}</div>
            </div>
            <h2>Nano-it-all</h2>
            {renderTimerContent(props.gameState)}
        </div>
    );
}

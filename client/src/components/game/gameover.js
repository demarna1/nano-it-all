import React from 'react';
import {List, ListItem, ListItemText} from '@material-ui/core';

const nth = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const getStats = (leaderboard, id) => {
    for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].id === id) {
            return {
                place: i+1,
                knano: leaderboard[i].knano
            }
        }
    }
    return {
        place: leaderboard.length,
        knano: 0
    };
}

const getTopWinners = (leaderboard) => {
    const topWinners = [];
    for (let i = 0; i < leaderboard.length; i++) {
        if (i == 3 || leaderboard[i].knano === 0) {
            break;
        }
        topWinners.push(leaderboard[i]);
    }
    return topWinners;
}

export default function GameOver(props) {
    const {leaderboard, playerState} = props;
    const stats = getStats(leaderboard, playerState.id);

    return (
        <div>
            <h2>Game Over</h2>
            <div className='description'>
                <div>You came in {nth(stats.place)} out of {leaderboard.length} players.</div>
                {stats.knano > 0 &&
                    <div className='lower-description'>
                        <div>Congratulations {props.playerState.name}, you won {stats.knano/1000} ⋰·⋰!</div>
                        <div>You will receive your Nano shortly.</div>
                    </div>
                }
                {stats.knano === 0 &&
                    <div className='lower-description'>
                        <div>Tough break.</div>
                        <div>You did not win any Nano this time.</div>
                    </div>
                }
            </div>
            <div className='top-winners'>
                <div>This week's top winners:</div>
                <ul style={{listStyle: 'none'}}>
                    {getTopWinners(leaderboard).map((winner) =>
                        <li>{winner.name} won {winner.knano/1000} ⋰·⋰</li>
                    )}
                </ul>
            </div>
            <div>Thank you for playing and see you next time!</div>
        </div>
    );
}

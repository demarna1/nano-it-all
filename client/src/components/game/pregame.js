import React from 'react';
import Multitimer from 'components/timer/multitimer';

export default function Pregame(props) {
    const soon = props.endDate.getTime() - new Date().getTime() < 3600000;
    return (
        <div>
            <Multitimer endDate={props.endDate}/>
            <h2>Welcome {props.name}</h2>
            {soon &&
                <div className='description'>
                    <div>Hang tight, the live trivia competition is starting very soon!</div>
                </div>
            }
            {!soon &&
                <div className='description'>
                    <div>The next live trivia competition has been scheduled.</div>
                    <div className='lower-description'>Check back here when it's ready.</div>
                </div>
            }
        </div>
    );
}

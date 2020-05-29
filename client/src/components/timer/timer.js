import React from 'react';
import {HourglassEmpty} from '@material-ui/icons';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <HourglassEmpty/>
    }

    return (
        <div>
            <div className='time'>{remainingTime}</div>
            <div>secs</div>
        </div>
    );
};

export default function Timer(props) {
    return (
        <div className='multitimer-wrapper'>
            <CountdownCircleTimer
                key={JSON.stringify(props)}
                {...props}
                size={80}
                strokeWidth={5}
                colors={[['#004777', 0.4], ['#F7B801', 0.4], ['#A30000']]}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
}

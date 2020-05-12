import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "styles/app.css";

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className="timer">Too late...</div>;
    }

    return (
        <div>
            <div className="time">{remainingTime}</div>
            <div className>secs</div>
        </div>
    );
};

export default function Timer(props) {
    const remainingTime = props.remainingTimeMs / 1000;

    return (
        <div className='timer-wrapper'>
            <CountdownCircleTimer
                isPlaying
                size={80}
                strokeWidth={5}
                duration={remainingTime}
                colors={[["#004777", 0.4], ["#F7B801", 0.4], ["#A30000"]]}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
}

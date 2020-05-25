import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 80,
  strokeWidth: 5
};

const renderTime = (dimension, time) => {
  return (
    <div>
      <div className='time'>{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = time => (minuteSeconds - time / 1000) | 0;
const getTimeMinutes = time => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = time => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = time => (time / daySeconds) | 0;

export default function Multitimer(props) {
  const remainingTime = props.remainingTimeMs / 1000;
  const daysDuration = 7 * daySeconds;

  return (
    <div className='timer-wrapper'>
      <CountdownCircleTimer
        {...timerProps}
        colors={[['#000000']]}
        key={daysDuration + remainingTime}
        duration={daysDuration}
        initialRemainingTime={remainingTime}
      >
        {({ elapsedTime }) =>
          renderTime('days', getTimeDays(daysDuration - elapsedTime / 1000))
        }
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors={[['#000000']]}
        key={daySeconds + remainingTime}
        duration={daySeconds}
        initialRemainingTime={remainingTime % daySeconds}
        onComplete={totalElapsedTime => [
          remainingTime - totalElapsedTime > hourSeconds
        ]}
      >
        {({ elapsedTime }) =>
          renderTime('hrs', getTimeHours(daySeconds - elapsedTime / 1000))
        }
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors={[['#000000']]}
        key={hourSeconds + remainingTime}
        duration={hourSeconds}
        initialRemainingTime={remainingTime % hourSeconds}
        onComplete={totalElapsedTime => [
          remainingTime - totalElapsedTime > minuteSeconds
        ]}
      >
        {({ elapsedTime }) =>
          renderTime(
            'min',
            getTimeMinutes(hourSeconds - elapsedTime / 1000)
          )
        }
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors={[['#000000']]}
        key={minuteSeconds + remainingTime}
        duration={minuteSeconds}
        initialRemainingTime={remainingTime % minuteSeconds}
        onComplete={totalElapsedTime => [remainingTime - totalElapsedTime > 0]}
      >
        {({ elapsedTime }) =>
          renderTime('sec', getTimeSeconds(elapsedTime))
        }
      </CountdownCircleTimer>
    </div>
  );
}

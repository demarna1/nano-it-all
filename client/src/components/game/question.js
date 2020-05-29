import React from 'react';
import {Container, LinearProgress} from '@material-ui/core';
import Choice from 'components/game/choice';
import Round from 'components/game/round';
import Timer from 'components/timer/timer';
import {Subphase} from 'lib';

export default class Question extends React.Component {

    constructor(props) {
        super(props);

        this.ChoiceState = Object.freeze({
            INITIAL: 'initial',
            SELECTED: 'selected',
            RIGHT: 'right',
            WRONG: 'wrong'
        });
    }

    getUpdatedChoiceStates() {
        const {gameState, playerState} = this.props;
        const choiceStates = {};

        for (let i = 0; i < gameState.data.choices.length; i++) {
            choiceStates[gameState.data.choices[i]] = this.ChoiceState.INITIAL;
        }

        for (let i = 0; i < playerState.answers.length; i++) {
            choiceStates[playerState.answers[i]] = this.ChoiceState.SELECTED;
        }

        return choiceStates;
    }

    isFinishedAnswering() {
        const {gameState, playerState} = this.props;
        switch (gameState.round) {
            case 1:
                return playerState.answers.length >= 2;
            case 2:
                return playerState.answers.length >= 1;
            case 3:
            default:
                return playerState.answers.length >= 3;
        }
    }

    choiceClicked = (choice) => {
        this.props.socket.submitAnswer(choice);
    }

    getChoiceProps(choice, choiceStates, finished) {
        return {
            value: choice,
            onClick: () => this.choiceClicked(choice),
            choiceState: choiceStates[choice],
            disabled: finished || choiceStates[choice] !== this.ChoiceState.INITIAL
        };
    }

    renderQuestionContent() {
        const {gameState} = this.props;

        if (gameState.subphase === Subphase.prequestion) {
            return (
                <div className='linear-progress'>
                    <LinearProgress />
                </div>
            );
        }

        const choiceStates = this.getUpdatedChoiceStates();
        const finished = this.isFinishedAnswering();

        return (
            <div>
                <div className='question-text'>{gameState.data.question}</div>
                <div className='choice-wrapper'>
                    {gameState.data.choices.map((choice, index) =>
                        <Choice
                            key={index}
                            {...this.getChoiceProps(choice, choiceStates, finished)}/>
                    )}
                </div>
            </div>
        );
    }

    getTimerProps(round, subphase, remainingTimeMs) {
        const isPlaying = subphase !== Subphase.prequestion;
        const duration = round === 1 ? 14 : (round === 2 ? 7 : 18);
        let initialRemainingTime;
        if (subphase === Subphase.prequestion) {
            initialRemainingTime = duration;
        } else if (subphase === Subphase.question) {
            initialRemainingTime = Math.round(remainingTimeMs / 1000);
        } else {
            initialRemainingTime = 0;
        }
        return { isPlaying, initialRemainingTime, duration };
    }

    render() {
        const {gameState} = this.props;

        if (gameState.subphase === Subphase.round) {
            return <Round round={gameState.round}/>
        }

        const timerProps = this.getTimerProps(
            gameState.round,
            gameState.subphase,
            gameState.phaseRemainingTimeMs
        );

        return (
            <Container maxWidth='xs'>
                <h2>Question {gameState.question}</h2>
                <Timer {...timerProps}/>
                {this.renderQuestionContent()}
            </Container>
        );
    }
}

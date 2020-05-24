import React from 'react';
import Round from 'components/round';
import Timer from 'components/timer';
import {Subphase} from 'lib';

export default class WarmupQuestion extends React.Component {

    constructor(props) {
        super(props);

        this.ChoiceState = Object.freeze({
            INITIAL: 'answer-initial',
            RIGHT: 'answer-right',
            WRONG: 'answer-wrong'
        });
    }

    getUpdatedChoiceStates() {
        const {gameState, playerState} = this.props;
        const choiceStates = {};

        for (let i = 0; i < gameState.data.choices.length; i++) {
            choiceStates[gameState.data.choices[i]] = this.ChoiceState.INITIAL;
        }
        for (let i = 0; i < playerState.rightAnswers.length; i++) {
            choiceStates[playerState.rightAnswers[i]] = this.ChoiceState.RIGHT;
        }
        for (let i = 0; i < playerState.wrongAnswers.length; i++) {
            choiceStates[playerState.wrongAnswers[i]] = this.ChoiceState.WRONG;
        }

        return choiceStates;
    }

    isFinishedAnswering(choiceStates) {
        let currentAnswers = 0;
        for (const choice in choiceStates) {
            if (choiceStates[choice] !== this.ChoiceState.INITIAL)
                currentAnswers++;
        }
        return currentAnswers >= 2;
    }

    choiceClicked = (choice) => {
        this.props.socket.submitAnswer(choice);
    }

    render() {
        const {gameState} = this.props;

        if (gameState.subphase === Subphase.round) {
            return <Round
                title='Ranking Round'
                description='Rank the answers from first to last'/>
        } else if (gameState.subphase === Subphase.prequestion) {
            return (
                <div>
                    <h2>Question {gameState.question}</h2>
                </div>
            );
        } else if (gameState.subphase === Subphase.postquestion) {
            return (
                <div>
                    <h2>Question {gameState.question}</h2>
                    <div>Times Up!</div>
                </div>
            );
        } else if (gameState.subphase === Subphase.answer) {
            return (
                <div>
                    <h2>Question {gameState.question}</h2>
                    <div>Answers:</div>
                    <div>TODO</div>
                </div>
            );
        }

        const choiceStates = this.getUpdatedChoiceStates();
        const isFinishedAnswering = this.isFinishedAnswering(choiceStates);

        return (
            <div>
                <h2>Question {gameState.question}</h2>
                <Timer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
                <div>{gameState.data.question}</div>
                {gameState.data.choices.map((choice, index) =>
                    <input
                        key={index}
                        type='button'
                        className={choiceStates[choice]}
                        value={choice}
                        onClick={() => this.choiceClicked(choice)}
                        disabled={isFinishedAnswering ||
                            choiceStates[choice] !== this.ChoiceState.INITIAL}/>
                )}
            </div>
        );
    }
}

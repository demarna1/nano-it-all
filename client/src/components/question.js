import React from 'react';
import Timer from 'components/timer';

export default class Question extends React.Component {

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
        const maxAnswers = this.props.gameState.round === 1 ? 2 : 1;
        let currentAnswers = 0;
        for (const choice in choiceStates) {
            if (choiceStates[choice] !== this.ChoiceState.INITIAL)
                currentAnswers++;
        }
        return currentAnswers >= maxAnswers;
    }

    choiceClicked = (choice) => {
        this.props.socket.submitAnswer(choice);
    }

    render() {
        const {question, phaseRemainingTimeMs, data} = this.props.gameState;

        const choiceStates = this.getUpdatedChoiceStates();
        const isFinishedAnswering = this.isFinishedAnswering(choiceStates);

        return (
            <div>
                <h2>Question {question}</h2>
                <Timer remainingTimeMs={phaseRemainingTimeMs}/>
                <div>{data.question}</div>
                {data.choices.map((choice, index) =>
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

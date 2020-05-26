import React from 'react';
import {Button, Container} from '@material-ui/core';
import Round from 'components/round';
import Timer from 'components/timer/timer';
import {Subphase} from 'lib';

export default class Ranking extends React.Component {

    constructor(props) {
        super(props);

        this.ChoiceState = Object.freeze({
            INITIAL: 'primary',
            RIGHT: 'success',
            WRONG: 'error'
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
            <Container maxWidth='xs'>
                <h2>Question {gameState.question}</h2>
                <Timer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
                <div className='question-text'>{gameState.data.question}</div>
                <div className='choice-wrapper'>
                    {gameState.data.choices.map((choice, index) =>
                        <Button
                            key={index}
                            variant='contained'
                            size='large'
                            color={choiceStates[choice]}
                            onClick={() => this.choiceClicked(choice)}
                            disabled={isFinishedAnswering ||
                                choiceStates[choice] !== this.ChoiceState.INITIAL}>
                            {choice}
                        </Button>
                    )}
                </div>
            </Container>
        );
    }
}

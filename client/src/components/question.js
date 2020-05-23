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

        const choiceStates = {};
        for (let i = 0; i < props.gameState.data.choices.length; i++) {
            choiceStates[props.gameState.data.choices[i]] = this.ChoiceState.INITIAL;
        }

        this.updateChoiceStates(choiceStates, props.playerState);

        this.state = {
            awaitingResponse: false,
            isFinishedAnswering: this.isFinishedAnswering(choiceStates),
            choiceStates
        };
    }

    updateChoiceStates(choiceStates, playerState) {
        for (let i = 0; i < playerState.rightAnswers.length; i++) {
            choiceStates[playerState.rightAnswers[i]] = this.ChoiceState.RIGHT;
        }
        for (let i = 0; i < playerState.wrongAnswers.length; i++) {
            choiceStates[playerState.wrongAnswers[i]] = this.ChoiceState.WRONG;
        }
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
        this.setState({awaitingResponse: true});
    }

    answerResponse = (playerState) => {
        const choiceStates = { ...this.state.choiceStates }; // make a copy
        this.updateChoiceStates(choiceStates, playerState);

        this.setState({
            awaitingResponse: false,
            isFinishedAnswering: this.isFinishedAnswering(choiceStates),
            choiceStates
        });
    }

    getDisabled(choice) {
        return this.state.awaitingResponse ||
            this.state.isFinishedAnswering ||
            this.state.choiceStates[choice] !== this.ChoiceState.INITIAL;
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.ANSWER_RESPONSE, this.answerResponse);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.ANSWER_RESPONSE, this.answerResponse);
    }

    render() {
        const {question, phaseRemainingTimeMs, data} = this.props.gameState;

        return (
            <div>
                <h2>Question {question}</h2>
                <Timer remainingTimeMs={phaseRemainingTimeMs}/>
                <div>{data.question}</div>
                {data.choices.map((choice, index) =>
                    <input
                        key={index}
                        type='button'
                        className={this.state.choiceStates[choice]}
                        value={choice}
                        onClick={() => this.choiceClicked(choice)}
                        disabled={this.getDisabled(choice)}/>
                )}
            </div>
        );
    }
}

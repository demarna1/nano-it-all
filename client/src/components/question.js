import React from 'react';
import Timer from 'components/timer';

export default class Question extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            awaitingResponse: false,
            rightAnswers: props.playerState.rightAnswers,
            wrongAnswers: props.playerState.wrongAnswers
        };
    }

    choiceClicked = (index) => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[index]);
        this.setState({awaitingResponse: true});
    }

    answerResponse = (playerState) => {
        this.setState({
            awaitingResponse: false,
            rightAnswers: playerState.rightAnswers,
            wrongAnswers: playerState.wrongAnswers
        });
    }

    getAnswerClassName(choice) {
        if (this.state.rightAnswers.indexOf(choice) > -1) {
            return 'answer-right';
        } else if (this.state.wrongAnswers.indexOf(choice) > -1) {
            return 'answer-wrong';
        } else {
            return 'answer-initial';
        }
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
        const {question, choices} = this.props.data;
        const {awaitingResponse, answerClassNames} = this.state;

        return (
            <div>
                <h2>Question {this.props.number}</h2>
                <Timer remainingTimeMs={this.props.remainingTimeMs}/>
                <div>{question}</div>
                {choices.map((choice, index) =>
                    <input
                        key={index}
                        type='button'
                        className={this.getAnswerClassName(choice)}
                        value={choice}
                        onClick={() => this.choiceClicked(index)}
                        disabled={awaitingResponse ||
                            this.getAnswerClassName(choice) !== 'answer-initial'}/>
                )}
            </div>
        );
    }
}

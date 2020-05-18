import React from 'react';
import Timer from 'components/timer';

export default class Question extends React.Component {

    constructor(props) {
        super(props);

        const answerClassNames = [];
        for (let i = 0; i < this.props.data.choices.length; i++) {
            answerClassNames.push('answer-initial');
        }

        this.state = {
            awaitingResponse: false,
            answerClassNames
        };
    }

    choiceClicked = (index) => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[index]);
        this.setState({awaitingResponse: true});
    }

    answerResponse = ({answer, right}) => {
        const {answerClassNames} = this.state;
        const index = this.props.data.choices.indexOf(answer);
        answerClassNames[index] = right ? 'answer-right' : 'answer-wrong';
        this.setState({awaitingResponse: false, answerClassNames});
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
                        className={answerClassNames[index]}
                        value={choice}
                        onClick={() => this.choiceClicked(index)}
                        disabled={awaitingResponse ||
                            answerClassNames[index] !== 'answer-initial'}/>
                )}
            </div>
        );
    }
}

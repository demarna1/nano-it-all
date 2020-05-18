import React from 'react';
import Timer from 'components/timer';

export default class Question extends React.Component {

    choice0Clicked = () => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[0]);
    }

    choice1Clicked = () => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[1]);
    }

    choice2Clicked = () => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[2]);
    }

    choice3Clicked = () => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[3]);
    }

    choice4Clicked = () => {
        const {socket, data} = this.props;
        socket.submitAnswer(data.choices[4]);
    }

    render() {
        const {question, choices} = this.props.data;

        return (
            <div>
                <h2>Question {this.props.number}</h2>
                <Timer remainingTimeMs={this.props.remainingTimeMs}/>
                <div>{question}</div>
                <input type='button' value={choices[0]} onClick={this.choice0Clicked}/>
                <input type='button' value={choices[1]} onClick={this.choice1Clicked}/>
                <input type='button' value={choices[2]} onClick={this.choice2Clicked}/>
                <input type='button' value={choices[3]} onClick={this.choice3Clicked}/>
                <input type='button' value={choices[4]} onClick={this.choice4Clicked}/>
            </div>
        );
    }
}

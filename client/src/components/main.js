import React from 'react';
import Chat from 'components/chat';
import Timer from 'components/timer';
import Multitimer from 'components/multitimer';
import {Phase} from 'lib';

export default class Main extends React.Component {

    leaveClicked = () => {
        this.props.socket.logout();
    }

    renderGameContent() {
        const {gameState} = this.props;

        switch (gameState.phase) {
            case Phase.starting:
                return (
                    <div>
                        <h2>Game is starting!</h2>
                        <div>There will be 3 rounds:</div>
                        <div>Match 2 Round</div>
                        <div>Speed Round</div>
                        <div>Match 3 Round</div>
                    </div>
                );
            case Phase.round:
                return (
                    <div>
                        <h2>Round {gameState.round}</h2>
                        <div>Pick 2 answers</div>
                    </div>
                );
            case Phase.question:
                const {question, choices} = gameState.data;
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                        <Timer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
                        <div>{question}</div>
                        <div>{choices[0]}</div>
                        <div>{choices[1]}</div>
                        <div>{choices[2]}</div>
                        <div>{choices[3]}</div>
                        <div>{choices[4]}</div>
                    </div>
                );
            case Phase.waitAnswer:
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                        <div>Times Up!</div>
                    </div>
                );
            case Phase.showAnswer:
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                        <div>Answers:</div>
                        <div>TODO</div>
                    </div>
                );
            case Phase.pregame:
            default:
                return (
                    <div>
                        <h3>Next game starts in:</h3>
                        <Multitimer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
                        <div>Hello {this.props.account.name}</div>
                    </div>
                );
        }
    }

    render() {
        return (
            <div>
                <input
                    className='logout-button'
                    type='button'
                    value='Leave'
                    onClick={this.leaveClicked}/>
                <div className='online'>Users online: {this.props.gameState.online}</div>
                {this.renderGameContent()}
                <Chat socket={this.props.socket} account={this.props.account}/>
            </div>
        );
    }
}

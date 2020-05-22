import React from 'react';
import Chat from 'components/chat';
import Multitimer from 'components/multitimer';
import Question from 'components/question';
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
                        <div>Pick 2 Round</div>
                        <div>Speed Round</div>
                        <div>Rankings Round</div>
                    </div>
                );
            case Phase.round:
                return (
                    <div>
                        <h2>Round {gameState.round}</h2>
                        <div>Pick 2 answers</div>
                    </div>
                );
            case Phase.prequestion:
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                    </div>
                );
            case Phase.question:
                return (
                    <Question
                        socket={this.props.socket}
                        remainingTimeMs={gameState.phaseRemainingTimeMs}
                        number={gameState.question}
                        data={gameState.data}/>
                );
            case Phase.postquestion:
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                        <div>Times Up!</div>
                    </div>
                );
            case Phase.answer:
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                        <div>Answers:</div>
                        <div>TODO</div>
                    </div>
                );
            case Phase.postgame:
                return (
                    <div>
                        <h2>Game Over!</h2>
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

import React from 'react';
import Chat from 'components/chat';
import Multitimer from 'components/multitimer';
import Question from 'components/question';
import Round from 'components/round';
import {Phase} from 'lib';

export default class Main extends React.Component {

    leaveClicked = () => {
        this.props.socket.logout();
    }

    renderGameContent() {
        const {gameState, playerState} = this.props;

        switch (gameState.phase) {
            case Phase.starting:
                return (
                    <div>
                        <h2>Game is starting!</h2>
                        <div>There will be 3 rounds:</div>
                        <div>Warmup Round</div>
                        <div>Speed Round</div>
                        <div>Ranking Round</div>
                    </div>
                );
            case Phase.round:
                return <Round number={gameState.round}/>
            case Phase.prequestion:
                return (
                    <div>
                        <h2>Question {gameState.question}</h2>
                    </div>
                );
            case Phase.question:
                return <Question
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
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
                        <div>Hello {playerState.name}</div>
                    </div>
                );
        }
    }

    render() {
        const {name, address} = this.props.playerState;

        return (
            <div>
                <input
                    className='logout-button'
                    type='button'
                    value='Leave'
                    onClick={this.leaveClicked}/>
                <div className='online'>Users online: {this.props.gameState.online}</div>
                {this.renderGameContent()}
                <Chat socket={this.props.socket} address={address} name={name}/>
            </div>
        );
    }
}

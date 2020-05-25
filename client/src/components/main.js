import React from 'react';
import Chat from 'components/chat';
import Multitimer from 'components/multitimer';
import RankingQuestion from 'components/rankingquestion';
import SpeedQuestion from 'components/speedquestion';
import WarmupQuestion from 'components/warmupquestion';
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
            case Phase.warmup:
                return <WarmupQuestion
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
            case Phase.speed:
                return <SpeedQuestion
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
            case Phase.ranking:
                return <RankingQuestion
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
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
                <div className='main-header'>
                    <input
                        type='button'
                        value='Leave'
                        onClick={this.leaveClicked}/>
                    <div>Users online: {this.props.gameState.online}</div>
                </div>
                {this.props.gameState.phase !== Phase.pregame &&
                    <div>Score: {this.props.playerState.score}</div>
                }
                {this.renderGameContent()}
                <Chat socket={this.props.socket} address={address} name={name}/>
            </div>
        );
    }
}

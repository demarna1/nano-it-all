import React from 'react';
import MainBar from 'components/mainbar';
import MainNav from 'components/mainnav';
import Multitimer from 'components/timer/multitimer';
import Question from 'components/game/question';
import {Phase} from 'lib';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 'game'
        }
    }

    handleNavigation = (e, value) => {
        this.setState({
            page: value
        });
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
            case Phase.running:
                return <Question
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
                        <Multitimer remainingTimeMs={gameState.phaseRemainingTimeMs}/>
                        <div>Welcome {playerState.name}</div>
                    </div>
                );
        }
    }

    renderMainContent() {
        switch (this.state.page) {
            case 'board':
                return <div>Leaderboard</div>
            case 'chat':
                return <div>Chat</div>
            case 'settings':
                return <div>Settings</div>
            case 'game':
            default:
                return this.renderGameContent();
        }
    }

    render() {
        return (
            <div>
                <MainBar
                    loggedIn={true}
                    socket={this.props.socket}
                    score={this.props.playerState.score}
                    online={this.props.gameState.online}/>
                {this.renderMainContent()}
                <MainNav
                    page={this.state.page}
                    onChange={this.handleNavigation}
                    position={1}
                    numPlayers={this.props.gameState.online}/>
            </div>
        );
    }
}

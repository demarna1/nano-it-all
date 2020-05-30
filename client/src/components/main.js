import React from 'react';
import Leaderboard from 'components/leaderboard/leaderboard';
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
                        <Multitimer endDate={gameState.phaseEndDate}/>
                        <div>Welcome {playerState.name}</div>
                    </div>
                );
        }
    }

    renderMainContent() {
        switch (this.state.page) {
            case 'board':
                return <Leaderboard
                    leaderboard={this.props.gameState.leaderboard}
                    playerState={this.props.playerState}/>
            case 'chat':
                return <div>Chat</div>
            case 'settings':
                return <div>Settings</div>
            case 'game':
            default:
                return this.renderGameContent();
        }
    }

    getNavLabelPosition() {
        const {leaderboard} = this.props.gameState;
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].id === this.props.playerState.id) {
                return i+1;
            }
        }
        return leaderboard.length;
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
                    position={this.getNavLabelPosition()}
                    numPlayers={this.props.gameState.leaderboard.length}/>
            </div>
        );
    }
}

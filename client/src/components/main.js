import React from 'react';
import {Button, BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {Chat, EmojiEvents, People, Settings} from '@material-ui/icons';
import {styled} from '@material-ui/core/styles';
import Multitimer from 'components/timer/multitimer';
import Ranking from 'components/question/ranking';
import Speed from 'components/question/speed';
import Warmup from 'components/question/warmup';
import {Phase} from 'lib';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 'game'
        }
    }

    leaveClicked = () => {
        this.props.socket.logout();
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
            case Phase.warmup:
                return <Warmup
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
            case Phase.speed:
                return <Speed
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
            case Phase.ranking:
                return <Ranking
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

    renderMainContent() {
        switch (this.state.page) {
            case 'game':
                return this.renderGameContent();
            case 'chat':
                return <div>Chat page</div>
            case 'settings':
                return <div>Settings</div>
        }
    }

    render() {
        const MainNavigation = styled(BottomNavigation)({
            width: '100%',
            position: 'fixed',
            bottom: 0,
        });

        return (
            <div>
                <div className='main-header'>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={this.leaveClicked}>
                        Leave
                    </Button>
                    <div className='online'>
                        <People/>
                        <div className='onlineCount'>{this.props.gameState.online}</div>
                    </div>
                </div>
                {this.props.gameState.phase !== Phase.pregame &&
                    <div>Score: {this.props.playerState.score}</div>
                }
                {this.renderMainContent()}
                <MainNavigation
                    value={this.state.page}
                    onChange={this.handleNavigation}>
                    <BottomNavigationAction label='Game' value='game' icon={<EmojiEvents/>}/>
                    <BottomNavigationAction label='Chat' value='chat' icon={<Chat/>}/>
                    <BottomNavigationAction label='Settings' value='settings' icon={<Settings/>}/>
                </MainNavigation>
            </div>
        );
    }
}

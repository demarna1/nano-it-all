import React from 'react';
import Chat from 'components/chat/chat';
import GameOver from 'components/game/gameover';
import GameStarting from 'components/game/gamestarting';
import Leaderboard from 'components/leaderboard/leaderboard';
import MainBar from 'components/mainbar';
import MainNav from 'components/mainnav';
import Pregame from 'components/game/pregame';
import Question from 'components/game/question';
import Settings from 'components/settings/settings';
import {Phase} from 'lib';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 'game',
            unreadChats: false,
            chatHistory: []
        }
    }

    handleNavigation = (e, value) => {
        if (this.state.unreadChats && value === 'chat') {
            this.setState({
                page: value,
                unreadChats: false
            });
        } else {
            this.setState({
                page: value
            });
        }
    }

    resetChatHistory = (chatHistory) => {
        const moreChats = chatHistory.length !== this.state.chatHistory.length;
        this.setState({
            chatHistory,
            unreadChats: moreChats && this.state.page !== 'chat'
        });
    }

    newChatMessage = (chat) => {
        this.setState({
            chatHistory: [...this.state.chatHistory, chat],
            unreadChats: this.state.page !== 'chat'
        });
    }

    renderGameContent() {
        const {gameState, playerState} = this.props;

        switch (gameState.phase) {
            case Phase.starting:
                return <GameStarting/>
            case Phase.running:
                return <Question
                    socket={this.props.socket}
                    gameState={gameState}
                    playerState={playerState}/>
            case Phase.postgame:
                return <GameOver
                    leaderboard={this.props.gameState.leaderboard}
                    playerState={this.props.playerState}/>
            case Phase.pregame:
            default:
                return <Pregame
                    endDate={gameState.phaseEndDate}
                    kraiPot={gameState.kraiPot}
                    name={playerState.name}/>
        }
    }

    renderMainContent() {
        switch (this.state.page) {
            case 'board':
                return <Leaderboard
                    leaderboard={this.props.gameState.leaderboard}
                    playerId={this.props.playerState.id}
                    phase={this.props.gameState.phase}/>
            case 'chat':
                return <Chat
                    socket={this.props.socket}
                    history={this.state.chatHistory}/>
            case 'settings':
                return <Settings
                    socket={this.props.socket}
                    playerState={this.props.playerState}/>
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

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.CHAT_HISTORY, this.resetChatHistory);
        socket.registerHandler(socket.Events.CHAT_MESSAGE, this.newChatMessage);
        socket.getChat();
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.CHAT_HISTORY, this.resetChatHistory);
        socket.unregisterHandler(socket.Events.CHAT_MESSAGE, this.newChatMessage);
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
                    numPlayers={this.props.gameState.leaderboard.length}
                    unreadChats={this.state.unreadChats}/>
            </div>
        );
    }
}

import React from 'react';
import Chat from 'components/chat';
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
                        <h2>Game is starting</h2>
                        <h3>Round 1</h3>
                        <div>Pick 3 answers</div>
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
                    type='button'
                    value='Leave'
                    onClick={this.leaveClicked}/>
                {this.renderGameContent()}
                <Chat socket={this.props.socket} account={this.props.account}/>
            </div>
        );
    }
}

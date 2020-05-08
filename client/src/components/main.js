import React from 'react';
import Chat from 'components/chat';

export default class Main extends React.Component {

    leaveClicked = () => {
        this.props.socket.logout();
    }

    render() {
        return (
            <div>
                <div>Hello {this.props.account.name}</div>
                <input
                    type='button'
                    value='Leave'
                    onClick={this.leaveClicked}/>
                <Chat socket={this.props.socket} account={this.props.account}/>
            </div>
        );
    }
}

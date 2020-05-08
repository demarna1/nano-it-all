import React from 'react';
import {Widget, addResponseMessage} from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

export default class Chat extends React.Component {

    handleUserMessage = (message) => {
        this.props.socket.newChat(this.props.account.address, message);
    }

    chatMessage = ({address, message}) => {
        if (address !== this.props.account.address) {
            addResponseMessage(message);
        }
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.CHAT_MESSAGE, this.chatMessage);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.CHAT_MESSAGE, this.chatMessage);
    }

    render() {
        return (
            <Widget
                handleNewUserMessage={this.handleUserMessage}
                title='Nano-it-all Chat'
                subtitle=''/>
        );
    }
}

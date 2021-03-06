import React from 'react';
import {Button, TextField} from '@material-ui/core';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            disabled: true
        }
    }

    messageChanged = (e) => {
        let message = e.target.value;
        message = message.length > 80 ? message.substr(0, 80) : message;
        this.setState({
            message,
            disabled: message.length === 0
        });
    }

    sendClicked = () => {
        if (this.state.message) {
            this.props.socket.newChat(this.state.message);
            this.setState({message: '', disabled: true})
        }
    }

    onKeyPress = (e) => {
        if (!this.state.disabled && e.key === 'Enter') {
            this.sendClicked();
        }
    }

    scrollToBottom = () => {
        this.chatList.scrollIntoView({behavior: 'smooth'});
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div>
                <h2>Chat</h2>
                <div className='chat-window'>
                    {this.props.history.map((chat, index) =>
                        <div className='chat-row' key={index}>
                            <div className='chat-name'><span>{chat.name}</span>:</div>
                            <div>{chat.message}</div>
                        </div>
                    )}
                    <div
                        style={{ float:'left', clear: 'both' }}
                        ref={(el) => { this.chatList = el; }}/>
                </div>
                <div className='name-wrapper'>
                    <TextField
                        placeholder='Message'
                        value={this.state.message}
                        onChange={this.messageChanged}
                        onKeyPress={this.onKeyPress}/>
                    <Button
                        variant='contained'
                        color='primary'
                        disabled={this.state.disabled}
                        onClick={this.sendClicked}>
                        Send
                    </Button>
                </div>
            </div>
        );
    }
}

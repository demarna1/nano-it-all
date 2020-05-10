import React from 'react';
import Multitimer from 'components/multitimer';

import 'styles/header.css'

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            online: 0,
            remainingTimeMs: -1
        }
    }

    gameStateChange = (gameState) => {
        this.setState({
            online: gameState.online,
            remainingTimeMs: gameState.phaseRemainingTimeMs
        });
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.STATE_CHANGE, this.gameStateChange);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.STATE_CHANGE, this.gameStateChange);
    }

    render() {
        const {online, remainingTimeMs} = this.state;

        return (
            <div className='wrapper'>
                <h2>{this.props.heading}</h2>
                <div>Users online: {online}</div>
                <h3>Next game starts in:</h3>
                {remainingTimeMs > 0 && <Multitimer remainingTimeMs={remainingTimeMs}/>}
            </div>
        );
    }
}

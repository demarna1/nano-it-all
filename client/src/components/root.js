import React from 'react';

import Layout from 'components/layout';
import Socket from 'socket';

export default class Root extends React.Component {

    constructor(props) {
        super(props);

        this.state = { socket: null };
    }

    componentDidMount() {
        this.setState({socket: Socket()});
    }

    render() {
        return (
            <Layout socket={this.state.socket}/>
        );
    }
}

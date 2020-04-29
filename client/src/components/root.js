import React from 'react';

import Login from 'components/login';
import Socket from 'socket';

export default class Root extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: null
        };
    }

    componentDidMount() {
        this.setState({socket: Socket()});
    }

    render() {
        return (
            <div>
                {this.state.socket &&
                    <Login socket={this.state.socket}/>
                }
            </div>
        );
    }
}

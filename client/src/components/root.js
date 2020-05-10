import React from 'react';
import Login from 'components/login';
import Socket from 'socket';
import 'styles/app.css'

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
            <div className='wrapper'>
                {this.state.socket &&
                    <Login socket={this.state.socket}/>
                }
            </div>
        );
    }
}

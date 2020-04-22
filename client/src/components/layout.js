import React from 'react';
import Login from 'components/login';

export default class Layout extends React.Component {

    render() {
        return (
            <div>
                <h2>Nano-it-all</h2>
                <Login socket={this.props.socket}/>
            </div>
        );
    }
}

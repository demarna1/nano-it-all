import React from 'react';
import Login from 'components/login';

export default class Layout extends React.Component {

    render() {
        return (
            <div>
                <div>Nano-it-all</div>
                <Login socket={this.props.socket}/>
            </div>
        );
    }
}

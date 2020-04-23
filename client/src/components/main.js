import React from 'react';

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
            </div>
        );
    }
}

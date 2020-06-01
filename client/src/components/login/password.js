import React from 'react';

export default class Password extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            error: ''
        }
    }

    passwordChanged = (e) => {
        this.setState({password: e.target.value});
    }

    passwordError = (error) => {
        this.setState({error});
    }

    loginClicked = () => {
        const {password} = this.state;
        if (password.length === 0) {
            this.setState({error: 'Please enter a password'});
        } else {
            this.props.socket.loginPassword(this.props.playerState.address, password);
        }
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.PASSWORD_ERROR, this.passwordError);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.PASSWORD_ERROR, this.passwordError);
    }

    render() {
        return (
            <div>
                <h2>Welcome back, {this.props.playerState.name}!</h2>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        value={this.state.password}
                        placeholder='password'
                        onChange={this.passwordChanged}/>
                </div>
                <input
                    type='button'
                    value='Login'
                    onClick={this.loginClicked}/>
                <div>{this.state.error}</div>
            </div>
        );
    }
}

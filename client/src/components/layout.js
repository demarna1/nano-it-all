import React from 'react';
import Login from 'components/login';
import Main from 'components/main';

export default class Layout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            loggedIn: false,
            account: {
                address: '',
                name: ''
            }
        };
    }

    loginSuccess = (account) => {
        console.log(`User logged in: ${JSON.stringify(account)}`);
        this.setState({
            initialized: true,
            loggedIn: true,
            account
        });
    }

    logoutSuccess = () => {
        console.log('User logged out');
        this.setState({
            initialized: true,
            loggedIn: false
        });
    }

    componentDidMount() {
        this.props.socket.registerLoginSuccessHandler(this.loginSuccess);
        this.props.socket.registerLogoutSuccessHandler(this.logoutSuccess);
    }

    componentWillUnmount() {
        this.props.socket.unregisterLoginSuccessHandler(this.loginSuccess);
        this.props.socket.unregisterLogoutSuccessHandler(this.logoutSuccess);
    }

    render() {
        const {initialized, loggedIn, account} = this.state;

        let content;
        if (initialized) {
            if (loggedIn) {
                content = <Main socket={this.props.socket} account={account}/>
            } else {
                content = <Login socket={this.props.socket} account={account}/>
            }
        } else {
            content = <div></div>;
        }

        return (
            <div>
                <h2>Nano-it-all</h2>
                {content}
            </div>
        );
    }
}

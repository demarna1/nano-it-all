import React from 'react';
import Login from 'components/login';
import Main from 'components/main';

export default class Layout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            duplicate: false,
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

    loginDuplicate = () => {
        console.log('Duplicate connection');
        this.setState({
            initialized: true,
            duplicate: true
        })
    }

    componentDidMount() {
        this.props.socket.registerLoginSuccessHandler(this.loginSuccess);
        this.props.socket.registerLogoutSuccessHandler(this.logoutSuccess);
        this.props.socket.registerLoginDuplicateHandler(this.loginDuplicate);
    }

    componentWillUnmount() {
        this.props.socket.unregisterLoginSuccessHandler(this.loginSuccess);
        this.props.socket.unregisterLogoutSuccessHandler(this.logoutSuccess);
        this.props.socket.unregisterLoginDuplicateHandler(this.loginDuplicate);
    }

    render() {
        const {initialized, duplicate, loggedIn, account} = this.state;

        let content;
        if (initialized) {
            if (duplicate) {
                content = <div>Session Duplicated</div>
            } else if (loggedIn) {
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

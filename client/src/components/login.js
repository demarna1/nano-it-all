import React from 'react';
import Address from 'components/address';
import Password from 'components/password';
import Main from 'components/main';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.LoginStatus = Object.freeze({
            PREINIT: 0,
            DUPLICATE: 1,
            LOGGEDOUT: 2,
            PREAUTH: 3,
            LOGGEDIN: 4
        });

        this.state = {
            loginStatus: this.LoginStatus.PREINIT,
            account: {
                address: '',
                name: ''
            }
        };
    }

    loginSuccess = (account) => {
        console.log(`User logged in: ${JSON.stringify(account)}`);
        this.setState({
            loginStatus: this.LoginStatus.LOGGEDIN,
            account
        });
    }

    loginVerify = (account) => {
        console.log(`User requires auth: ${JSON.stringify(account)}`);
        this.setState({
            loginStatus: this.LoginStatus.PREAUTH,
            account
        });
    }

    logoutSuccess = () => {
        console.log('User logged out');
        this.setState({
            loginStatus: this.LoginStatus.LOGGEDOUT
        });
    }

    loginDuplicate = () => {
        console.log('Duplicate connection');
        this.setState({
            loginStatus: this.LoginStatus.DUPLICATE
        });
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.LOGIN_SUCCESS, this.loginSuccess);
        socket.registerHandler(socket.Events.LOGIN_VERIFY, this.loginVerify);
        socket.registerHandler(socket.Events.LOGOUT_SUCCESS, this.logoutSuccess);
        socket.registerHandler(socket.Events.LOGIN_DUPLICATE, this.loginDuplicate);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.LOGIN_SUCCESS, this.loginSuccess);
        socket.unregisterHandler(socket.Events.LOGIN_VERIFY, this.loginVerify);
        socket.unregisterHandler(socket.Events.LOGOUT_SUCCESS, this.logoutSuccess);
        socket.unregisterHandler(socket.Events.LOGIN_DUPLICATE, this.loginDuplicate);
    }

    render() {
        const {loginStatus, account} = this.state;

        let content;
        switch (loginStatus) {
            case this.LoginStatus.PREINIT:
                content = <div></div>;
                break;
            case this.LoginStatus.DUPLICATE:
                content = <div>Session Duplicated</div>
                break;
            case this.LoginStatus.LOGGEDOUT:
                content = <Address socket={this.props.socket} account={account}/>
                break;
            case this.LoginStatus.PREAUTH:
                content = <Password socket={this.props.socket} account={account}/>
                break;
            case this.LoginStatus.LOGGEDIN:
                content = <Main socket={this.props.socket} account={account}/>
                break;
        }

        return (
            <div>
                <h2>Nano-it-all</h2>
                {content}
            </div>
        );
    }
}

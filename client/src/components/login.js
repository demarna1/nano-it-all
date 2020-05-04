import React from 'react';
import { Phase } from 'lib';

import Address from 'components/address';
import Name from 'components/name';
import Main from 'components/main';
import Password from 'components/password';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.LoginStatus = Object.freeze({
            PREINIT: 0,
            DUPLICATE: 1,
            LOGGEDOUT: 2,
            PRENAME: 3,
            PREAUTH: 4,
            LOGGEDIN: 5
        });

        this.state = {
            online: 0,
            loginStatus: this.LoginStatus.PREINIT,
            account: {
                address: '',
                name: ''
            }
        };
    }

    gameStateChange = (state) => {
        console.log(`Phase: ${state.phase}`);
        console.log(`Test: ${Phase.pregame}`);
        this.setState({online: state.online});
    }

    loginSuccess = (account) => {
        const loginStatus = account.name
            ? this.LoginStatus.LOGGEDIN
            : this.LoginStatus.PRENAME
        this.setState({
            loginStatus,
            account
        });
    }

    loginVerify = (account) => {
        this.setState({
            loginStatus: this.LoginStatus.PREAUTH,
            account
        });
    }

    logoutSuccess = () => {
        this.setState({
            loginStatus: this.LoginStatus.LOGGEDOUT
        });
    }

    loginDuplicate = () => {
        this.setState({
            loginStatus: this.LoginStatus.DUPLICATE
        });
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.STATE_CHANGE, this.gameStateChange);
        socket.registerHandler(socket.Events.LOGIN_SUCCESS, this.loginSuccess);
        socket.registerHandler(socket.Events.LOGIN_VERIFY, this.loginVerify);
        socket.registerHandler(socket.Events.LOGOUT_SUCCESS, this.logoutSuccess);
        socket.registerHandler(socket.Events.LOGIN_DUPLICATE, this.loginDuplicate);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.STATE_CHANGE, this.gameStateChange);
        socket.unregisterHandler(socket.Events.LOGIN_SUCCESS, this.loginSuccess);
        socket.unregisterHandler(socket.Events.LOGIN_VERIFY, this.loginVerify);
        socket.unregisterHandler(socket.Events.LOGOUT_SUCCESS, this.logoutSuccess);
        socket.unregisterHandler(socket.Events.LOGIN_DUPLICATE, this.loginDuplicate);
    }

    render() {
        const {loginStatus, account} = this.state;

        let content;
        switch (loginStatus) {
            case this.LoginStatus.DUPLICATE:
                content = <div>Session Duplicated</div>
                break;
            case this.LoginStatus.LOGGEDOUT:
                content = <Address socket={this.props.socket} account={account}/>
                break;
            case this.LoginStatus.PRENAME:
                content = <Name socket={this.props.socket} account={account}/>
                break;
            case this.LoginStatus.PREAUTH:
                content = <Password socket={this.props.socket} account={account}/>
                break;
            case this.LoginStatus.LOGGEDIN:
                content = <Main socket={this.props.socket} account={account}/>
                break;
            case this.LoginStatus.PREINIT:
            default:
                content = <div></div>;
                break;
        }

        return (
            <div>
                <h2>Nano-it-all</h2>
                <div># Online: {this.state.online}</div>
                {content}
            </div>
        );
    }
}

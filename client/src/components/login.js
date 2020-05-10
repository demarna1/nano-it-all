import React from 'react';
import Address from 'components/address';
import Header from 'components/header';
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
            loginStatus: this.LoginStatus.PREINIT,
            account: {
                address: '',
                name: ''
            },
            gameState: null
        };
    }

    loginSuccess = ({gameState, account}) => {
        const loginStatus = account.name
            ? this.LoginStatus.LOGGEDIN
            : this.LoginStatus.PRENAME
        this.setState({
            loginStatus,
            account,
            gameState
        });
    }

    loginVerify = ({gameState, account}) => {
        this.setState({
            loginStatus: this.LoginStatus.PREAUTH,
            account,
            gameState
        });
    }

    logoutSuccess = (gameState) => {
        this.setState({
            loginStatus: this.LoginStatus.LOGGEDOUT,
            gameState
        });
    }

    loginDuplicate = (gameState) => {
        this.setState({
            loginStatus: this.LoginStatus.DUPLICATE,
            gameState
        });
    }

    gameStateChange = (gameState) => {
        this.setState({gameState});
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.LOGIN_SUCCESS, this.loginSuccess);
        socket.registerHandler(socket.Events.LOGIN_VERIFY, this.loginVerify);
        socket.registerHandler(socket.Events.LOGOUT_SUCCESS, this.logoutSuccess);
        socket.registerHandler(socket.Events.LOGIN_DUPLICATE, this.loginDuplicate);
        socket.registerHandler(socket.Events.STATE_CHANGE, this.gameStateChange);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.LOGIN_SUCCESS, this.loginSuccess);
        socket.unregisterHandler(socket.Events.LOGIN_VERIFY, this.loginVerify);
        socket.unregisterHandler(socket.Events.LOGOUT_SUCCESS, this.logoutSuccess);
        socket.unregisterHandler(socket.Events.LOGIN_DUPLICATE, this.loginDuplicate);
        socket.unregisterHandler(socket.Events.STATE_CHANGE, this.gameStateChange);
    }

    render() {
        const {loginStatus, account, gameState} = this.state;

        switch (loginStatus) {
            case this.LoginStatus.DUPLICATE:
                return (
                    <div>
                        <Header gameState={gameState}/>
                        <div>Account in use</div>
                        <div>Please close other open tabs or log out of other devices.</div>
                    </div>
                );
            case this.LoginStatus.LOGGEDOUT:
                return (
                    <div>
                        <Header gameState={gameState}/>
                        <Address socket={this.props.socket} account={account}/>
                    </div>
                );
            case this.LoginStatus.PRENAME:
                return (
                    <div>
                        <Header gameState={gameState}/>
                        <Name socket={this.props.socket} account={account}/>
                    </div>
                );
            case this.LoginStatus.PREAUTH:
                return (
                    <div>
                        <Header gameState={gameState}/>
                        <Password socket={this.props.socket} account={account}/>
                    </div>
                );
            case this.LoginStatus.LOGGEDIN:
                return <Main socket={this.props.socket} gameState={gameState} account={account}/>
            case this.LoginStatus.PREINIT:
            default:
                return <div>Loading...</div>;
        }
    }
}

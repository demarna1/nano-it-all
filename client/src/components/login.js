import React from 'react';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: this.props.account.address,
            name: this.props.account.name,
            error: ''
        };
    }

    addressChanged = (e) => {
        this.setState({address: e.target.value});
    }

    nameChanged = (e) => {
        this.setState({name: e.target.value});
    }

    loginError = (error) => {
        this.setState({error});
    }

    joinClicked = () => {
        const {address, name} = this.state;
        if (address.length !== 65) {
            this.setState({error: 'Nano address must be 65 characters'});
        } else if (name.length === 0) {
            this.setState({error: 'Please enter a display name'});
        } else {
            this.props.socket.login(address, name);
        }
    }

    componentDidMount() {
        this.props.socket.registerLoginErrorHandler(this.loginError);
    }

    componentWillUnmount() {
        this.props.socket.unregisterLoginErrorHandler(this.loginError);
    }

    render() {
        return (
            <div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <input
                        type='text'
                        id='address'
                        value={this.state.address}
                        placeholder='sample address'
                        onChange={this.addressChanged}/>
                </div>
                <div>
                    <label htmlFor='username'>Name</label>
                    <input
                        type='text'
                        id='username'
                        value={this.state.name}
                        placeholder='sample username'
                        onChange={this.nameChanged}/>
                </div>
                <input
                    type='button'
                    value='Join'
                    onClick={this.joinClicked}/>
                <div>{this.state.error}</div>
            </div>
        )
    }
}

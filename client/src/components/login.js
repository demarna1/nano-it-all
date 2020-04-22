import React from 'react';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            name: '',
            error: ''
        };
    }

    addressChanged = (e) => {
        this.setState({address: e.target.value});
    }

    nameChanged = (e) => {
        this.setState({name: e.target.value});
    }

    joinClicked = () => {
        const {address, name} = this.state;
        if (address.length !== 65) {
            this.setState({error: 'Nano address must be 65 characters'});
        } else if (name.length === 0) {
            this.setState({error: 'Please enter a display name'});
        } else {
            this.props.socket.login(address, name, (err) => {
                this.setState({error: err ? err : ''});
            });
        }
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
                        value={this.state.username}
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

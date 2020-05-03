import React from 'react';

export default class Address extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: this.props.account.address,
            error: ''
        };
    }

    addressChanged = (e) => {
        this.setState({address: e.target.value});
    }

    addressError = (error) => {
        this.setState({error});
    }

    joinClicked = () => {
        const {address} = this.state;
        const nanoRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
        if (!nanoRegex.test(address)) {
            this.setState({error: 'Invalid Nano address format'});
        } else {
            this.props.socket.loginAddress(address);
        }
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.registerHandler(socket.Events.ADDRESS_ERROR, this.addressError);
    }

    componentWillUnmount() {
        const {socket} = this.props;
        socket.unregisterHandler(socket.Events.ADDRESS_ERROR, this.addressError);
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
                        placeholder='nano address'
                        onChange={this.addressChanged}/>
                </div>
                <input
                    type='button'
                    value='Join'
                    onClick={this.joinClicked}/>
                <div>{this.state.error}</div>
            </div>
        );
    }
}

import React from 'react';
import {Button, TextField} from '@material-ui/core';

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
                <div className='address-input'>
                    <TextField
                        label='Nano Address'
                        placeholder='Nano Address'
                        variant='outlined'
                        value={this.state.address}
                        onChange={this.addressChanged}
                        helperText={this.state.error}
                        multiline
                        rows={3}
                        cols={22}
                        inputProps={{
                            style: {fontFamily: 'Courier New'}
                        }}/>
                </div>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={this.joinClicked}>
                    Join
                </Button>
            </div>
        );
    }
}

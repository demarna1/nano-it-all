import React from 'react';
import {Button, Container, TextField} from '@material-ui/core';

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

    loginClicked = () => {
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
            <Container maxWidth='xs'>
                <div className='description'>
                    Win small amounts of Nano in this free-to-play live trivia
                    competition. Simply log in with your Nano address below to play.
                </div>
                <div>
                    Don't have a Nano address yet? <a href='https://natrium.io'
                    target='_blank'>Download a wallet</a>
                </div>
                <div className='address-input'>
                    <TextField
                        label='Nano Address'
                        placeholder='Nano Address'
                        variant='outlined'
                        value={this.state.address}
                        onChange={this.addressChanged}
                        helperText={this.state.error}
                        style={{ width: '350px' }}/>
                </div>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={this.loginClicked}>
                    Login
                </Button>
            </Container>
        );
    }
}

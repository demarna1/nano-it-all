import React from 'react';
import {Button, TextField} from '@material-ui/core';

export default class Name extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            error: ''
        };
    }

    nameChanged = (e) => {
        this.setState({name: e.target.value});
    }

    okClicked = () => {
        const {name} = this.state;
        if (name.length === 0) {
            this.setState({error: 'Name must be non-empty.'});
        } else {
            this.props.socket.loginName(this.props.account.address, name);
        }
    }

    render() {
        return (
            <div className='name-wrapper'>
                <TextField
                    label='Display Name'
                    placeholder='Display Name'
                    value={this.state.name}
                    onChange={this.nameChanged}
                    helperText={this.state.error}/>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={this.okClicked}>
                    OK
                </Button>
            </div>
        );
    }
}

import React from 'react';
import {Button, TextField} from '@material-ui/core';

export default class Name extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.playerState.name,
            disabled: true
        };
    }

    nameChanged = (e) => {
        let name = e.target.value;
        name = name.length > 16 ? name.substr(0, 16) : name;
        this.setState({
            name,
            disabled: name.length === 0
        });
    }

    saveClicked = () => {
        if (this.state.name) {
            this.props.socket.loginName(this.props.playerState.address, this.state.name);
            this.setState({disabled: true});
        }
    }

    render() {
        return (
            <div className='name-wrapper'>
                <TextField
                    label='Display Name'
                    placeholder='Display Name'
                    value={this.state.name}
                    onChange={this.nameChanged}/>
                <Button
                    variant='contained'
                    color='primary'
                    disabled={this.state.disabled}
                    onClick={this.saveClicked}>
                    Save
                </Button>
            </div>
        );
    }
}

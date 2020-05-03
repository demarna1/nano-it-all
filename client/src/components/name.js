import React from 'react';

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
            this.setState({error: 'Please enter a name'});
        } else {
            this.props.socket.loginName(this.props.account.address, name);
        }
    }

    render() {
        return (
            <div>
                <div>
                    <label htmlFor='name'>Display Name</label>
                    <input
                        type='text'
                        id='name'
                        value={this.state.name}
                        placeholder='name'
                        onChange={this.nameChanged}/>
                </div>
                <input
                    type='button'
                    value='OK'
                    onClick={this.okClicked}/>
                <div>{this.state.error}</div>
            </div>
        );
    }
}

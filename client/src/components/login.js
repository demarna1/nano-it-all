import React from 'react';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            error: ''
        };
    }

    handleChange = (e) => {
        this.setState({ username: e.target.value });
    }

    handleClick = () => {
        console.log(`logging in user ${this.state.username}`);
        this.props.socket.login(this.state.username, (err) => {
            console.log('got callback');
            this.setState({error: err ? err : ''});
        });
    }

    render() {
        return (
            <div>
                <label htmlFor='username'>
                    <h2>Username</h2>
                </label>
                <input
                    type='text'
                    id='username'
                    value={this.state.username}
                    placeholder='sample username'
                    onChange={this.handleChange}/>
                <input
                    type='button'
                    value='Login'
                    onClick={this.handleClick}/>
                <div>{this.state.error}</div>
            </div>
        )
    }
}

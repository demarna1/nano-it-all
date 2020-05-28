import React from 'react';
import Login from 'components/login/login';
import Socket from 'socket';
import 'styles/app.css'

export default class Root extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: null
        };
    }

    componentDidMount() {
        if (process.env.NODE_ENV === 'production') {
            var OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
                OneSignal.init({
                    appId: '89a807ba-62e0-43e2-8fb2-086cf012b5b7',
                });
            });
        } else {
            console.log('OneSignal not available in development');
        }

        this.setState({socket: Socket()});
    }

    render() {
        return (
            <div className='wrapper'>
                {this.state.socket &&
                    <Login socket={this.state.socket}/>
                }
            </div>
        );
    }
}

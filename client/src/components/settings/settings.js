import React from 'react';
import {Container} from '@material-ui/core';
import Name from 'components/login/name';

export default function Settings(props) {

    return (
        <Container maxWidth='xs'>
            <h2>Settings</h2>
            <Name socket={props.socket} playerState={props.playerState}/>
        </Container>
    );
}

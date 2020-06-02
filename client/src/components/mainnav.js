import React from 'react';
import {Badge, BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {Chat, EmojiEvents, School, Settings} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0
    }
});

const getChatIcon = (unreadChats) => {
    return (
        <Badge color='secondary' variant='dot' invisible={!unreadChats}>
            <Chat/>
        </Badge>
    );
};

const nth = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function MainNav(props) {
    const {classes} = props;
    const boardLabel = `${nth(props.position)} of ${props.numPlayers}`;

    return (
        <BottomNavigation
            value={props.page}
            onChange={props.onChange}
            className={classes.root}
            showLabels>
            <BottomNavigationAction label='Game' value='game' icon={<School/>}/>
            <BottomNavigationAction label={boardLabel} value='board' icon={<EmojiEvents/>}/>
            <BottomNavigationAction label='Chat' value='chat' icon={getChatIcon(props.unreadChats)}/>
            <BottomNavigationAction label='Settings' value='settings' icon={<Settings/>}/>
        </BottomNavigation>
    );
}

export default withStyles(styles)(MainNav);

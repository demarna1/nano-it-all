import React from 'react';
import clsx from 'clsx';
import {AppBar, Button, Toolbar} from '@material-ui/core';
import {EmojiEvents, People} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        marginBottom: '30px'
    },
    flex: {
        flex: 1,
        display: 'inline-flex',
        justifyContent: 'center'
    },
    left: {
        marginRight: 'auto'
    },
    right: {
        marginLeft: 'auto'
    },
    countWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    countText: {
        margin: '7px',
        fontSize: '18px'
    },
    titleText: {
        fontSize: 'x-large',
        fontWeight: 'bold'
    }
});

function MainBar(props) {
    const {classes} = props;

    return (
        <AppBar position='static' className={classes.root}>
            <Toolbar>
                <div className={classes.flex}>
                    {props.loggedIn &&
                        <Button
                            color='inherit'
                            className={classes.left}
                            onClick={() => props.socket.logout()}>
                            Leave
                        </Button>
                    }
                    {!props.loggedIn && <div className={classes.left}/>}
                </div>
                <div className={classes.flex}>
                    {props.loggedIn &&
                        <div className={classes.countWrapper}>
                            <EmojiEvents/>
                            <div className={classes.countText}>{props.score}</div>
                        </div>
                    }
                    {!props.loggedIn &&
                        <div className={classes.titleText}>Nano-it-all</div>
                    }
                </div>
                <div className={classes.flex}>
                    <div className={clsx(classes.right, classes.countWrapper)}>
                        <People/>
                        <div className={classes.countText}>{props.online}</div>
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(MainBar);

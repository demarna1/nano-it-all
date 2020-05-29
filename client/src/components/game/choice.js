import React from 'react';
import {Button} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    initial: {
        margin: '15px',
        '&$disabled': {
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        }
    },
    selected: {
        margin: '15px',
        backgroundColor: 'white',
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        '&$disabled': {
            backgroundColor: 'white',
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main
        }
    },
    disabled: {}
});

function Choice(props) {
    const {classes} = props;

    return (
        <Button
            variant='contained'
            color='primary'
            onClick={props.onClick}
            disabled={props.disabled}
            className={classes[props.choiceState]}
            classes={{ disabled: classes.disabled }}
            size='large'>
            {props.value}
        </Button>
    );
}

export default withStyles(styles)(Choice);

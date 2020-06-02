import React from 'react';
import {Button} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    unselected: {
        margin: '15px',
    },
    unselectedRight: {
        margin: '15px',
        '&$disabled': {
            border: '1px solid green',
            color: 'green'
        }
    },
    selected: {
        margin: '15px',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        '&$disabled': {
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        },
        '&:hover.Mui-disabled': {
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        }
    },
    selectedRight: {
        margin: '15px',
        '&$disabled': {
            backgroundColor: theme.palette.success.main,
            color: 'white'
        },
        '&:hover.Mui-disabled': {
            backgroundColor: theme.palette.success.main,
            color: 'white'
        }
    },
    selectedWrong: {
        margin: '15px',
        '&$disabled': {
            backgroundColor: theme.palette.error.main,
            color: 'white'
        },
        '&:hover.Mui-disabled': {
            backgroundColor: theme.palette.error.main,
            color: 'white'
        }
    },
    disabled: {}
});

function Choice(props) {
    const {classes} = props;

    return (
        <Button
            variant='outlined'
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

import React from 'react';
import {Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const SpecialTableCell = withStyles((theme) => ({
    body: {
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    }
}))(TableCell);

const renderTableRow = (player, place, playerState) => {
    if (player.id === playerState.id) {
        return (
            <TableRow key={place}>
                <SpecialTableCell>{place+1}</SpecialTableCell>
                <SpecialTableCell component='th' scope='row'>{player.name}</SpecialTableCell>
                <SpecialTableCell align='right'>{player.score}</SpecialTableCell>
            </TableRow>
        );
    } else {
        return (
            <TableRow key={place}>
                <TableCell>{place+1}</TableCell>
                <TableCell component='th' scope='row'>{player.name}</TableCell>
                <TableCell align='right'>{player.score}</TableCell>
            </TableRow>
        );
    }
}

export default function Leaderboard(props) {
    const {classes} = props;

    return (
        <Container maxWidth='xs'>
            <h2>Leaderboard</h2>
            <TableContainer component={Paper}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Place</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align='right'>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.leaderboard.map((player, place) =>
                            renderTableRow(player, place, props.playerState)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

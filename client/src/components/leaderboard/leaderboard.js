import React from 'react';
import {Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {Phase} from 'lib';

const SpecialTableCell = withStyles((theme) => ({
    body: {
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    }
}))(TableCell);

const renderTableRow = (player, place, playerId, showNano) => {
    if (player.id === playerId) {
        return (
            <TableRow key={place}>
                <SpecialTableCell>{place+1}</SpecialTableCell>
                <SpecialTableCell component='th' scope='row'>{player.name}</SpecialTableCell>
                <SpecialTableCell align='right'>{player.score}</SpecialTableCell>
                {showNano &&
                    <SpecialTableCell align='right'>{`${player.krai/1000} ⋰·⋰`}</SpecialTableCell>
                }
            </TableRow>
        );
    } else {
        return (
            <TableRow key={place}>
                <TableCell>{place+1}</TableCell>
                <TableCell component='th' scope='row'>{player.name}</TableCell>
                <TableCell align='right'>{player.score}</TableCell>
                {showNano &&
                    <TableCell align='right'>{`${player.krai/1000} ⋰·⋰`}</TableCell>
                }
            </TableRow>
        );
    }
};

export default function Leaderboard(props) {
    const showNano = props.phase === Phase.pregame || props.phase === Phase.postgame;

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
                            {showNano &&
                                <TableCell align='right'>Winnings</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.leaderboard.map((player, place) =>
                            renderTableRow(player, place, props.playerId, showNano)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

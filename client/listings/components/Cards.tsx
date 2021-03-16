import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { PropertyCard } from './PropertyCard';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    cardsContainer: {
        justifyContent: "center"
    }
}));

//@ts-ignore
export const Cards = ({ properties }) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <main>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={2} className={classes.cardsContainer}>
                        {properties.map((property: any) => (
                            <PropertyCard key={property.shortId} title={property.title} address={property.address} thumbnail={property.thumbnail} />
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    )
}

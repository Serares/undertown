import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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
                            <PropertyCard
                                key={property.shortId}
                                propertyValues={property}
                            />
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    )
}

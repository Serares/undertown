import * as React from 'react';
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => (
    {
        features: {
            display: "flex",
            alignItems: "center",
            "& li": {
                paddingLeft: "5px"
            }
        }
    }
))

type FeaturesProps = {
    features: {
        rooms?: number;
        surface: number;
        price: number;
    }
}

export const Features: React.FunctionComponent<FeaturesProps> = ({ features }) => {
    const classes = useStyles();
    return (
        <ul className={classes.features}>
            <Typography>
                <li>Suprafata: {features.surface} m<sup>2</sup></li>
            </Typography>
            <Typography>
                <li>Pret: {features.price} EUR</li>
            </Typography>
            <Typography>
                {features.rooms && <li>Camere: {features.rooms}</li>}
            </Typography>
        </ul>
    )

}
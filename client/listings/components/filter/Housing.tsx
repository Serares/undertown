import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core';
import { ETransactionType } from '../../../../src/interfaces/ETransactionType';
import { EPropertyTypes } from '../../../../src/interfaces/EPropertyTypes';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    filterGrid: {
        display: "flex",
        flexDirection: "column"
    }
}));

type HousingProps = {
    transactionType: ETransactionType,
    propertyType: EPropertyTypes,
    filterProperties: (filterType: string, data: string | [string, string]) => void
}

const Housing: React.FunctionComponent<HousingProps> = ({ propertyType, transactionType, filterProperties }) => {
    let generateSurfaceFilters = () => {
        let maxValue;
        let interval;
        if (propertyType === EPropertyTypes.APARTMENT) {
            maxValue = 500;
            interval = 30;
        } else {
            maxValue = 900;
            interval = 50;
        }

        let options = [<option key={"surfaceNone"} aria-label="None" value="" />];
        for (let i = interval; i <= maxValue; i += interval) {
            let option = <option key={i + "_s"} value={i}>{i} mp</option>
            options.push(option)
        }
        return options;
    };

    let generatePriceFilters = () => {
        let maxValue;
        let interval;
        if (transactionType === ETransactionType.RENT) {
            maxValue = 4000;
            interval = 100;
        } else {
            maxValue = 400000;
            interval = 10000
        }

        let options = [<option key={"priceNone"} aria-label="None" value="" />];
        for (let i = 0; i <= maxValue; i += interval) {
            let option = <option key={i + "_price"} value={i}>{i.toLocaleString("ro-RO")} €</option>
            options.push(option)
        }

        return options;
    }

    const classes = useStyles();

    const updateState = (e: any, ...args: string[]) => {

        if (args.length > 1) {
            //@ts-ignore
            filterProperties(args[0], [args[1], e.target.value]);
        } else {
            filterProperties(args[0], e.target.value);
        }
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.filterGrid}>
                <Grid item>
                    <Typography>
                        Suprafata:
                    </Typography>
                    <FormControl variant="outlined" color="primary" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">min</InputLabel>
                        <Select
                            native
                            label="Suprafata"
                            onChange={(e) => { updateState(e, "surface", "min") }}
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            {generateSurfaceFilters()}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" color="primary" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">max</InputLabel>
                        <Select
                            native
                            label="Suprafata"
                            onChange={(e) => { updateState(e, "surface", "max") }}
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            {generateSurfaceFilters()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Typography>
                        Camere:
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Camere</InputLabel>
                        <Select
                            native
                            label="Camere"
                            onChange={(e) => { updateState(e, "rooms") }}
                            inputProps={{
                                name: 'camere',
                                id: "outlined-age-native-simple"
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4+</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Typography>
                        Preț:
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Pret min</InputLabel>
                        <Select
                            native
                            label="Pret min"
                            onChange={(e) => { updateState(e, "price", "min") }}
                            inputProps={{
                                name: 'pret',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            {generatePriceFilters()}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Pret max</InputLabel>
                        <Select
                            native
                            label="Pret max"
                            onChange={(e) => { updateState(e, "price", "max") }}
                            inputProps={{
                                name: 'pret',
                                id: 'outlined-age-native-simple'
                            }}
                        >
                            {generatePriceFilters()}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Housing;

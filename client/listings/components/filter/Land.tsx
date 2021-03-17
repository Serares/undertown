import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core';

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

const Land = () => {
    const classes = useStyles();
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
                            value={state.age}
                            onChange={handleChange}
                            label="Suprafata"
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" color="primary" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">max</InputLabel>
                        <Select
                            native
                            value={state.age}
                            onChange={handleChange}
                            label="Suprafata"
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option>
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
                            value={0}
                            onChange={handleChange}
                            label="Suprafata"
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Typography>
                        Pret:
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Pret min</InputLabel>
                        <Select
                            native
                            value={0}
                            onChange={handleChange}
                            label="Suprafata"
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Pret max</InputLabel>
                        <Select
                            native
                            value={0}
                            onChange={handleChange}
                            label="Suprafata"
                            inputProps={{
                                name: 'suprafata',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Land;
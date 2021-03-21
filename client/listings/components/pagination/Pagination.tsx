import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginTop: theme.spacing(2),
        },
    },
}));


//@ts-ignore
const PaginationComponent = ({ pagesNumber, handleChange }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Pagination count={pagesNumber} color="primary" onChange={handleChange} />
        </div>
    );
};

export default PaginationComponent;
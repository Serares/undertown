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

const PaginationComponent = ({ pagesNumber }) => {
    const classes = useStyles();

    const handleCHange = (e: any, value: any) => {
        console.log(value);
    }

    return (
        <div className={classes.root}>
            <Pagination count={pagesNumber} color="primary" onChange={handleCHange} />
        </div>
    );
};

export default PaginationComponent;
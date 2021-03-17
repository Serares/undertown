import * as React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { EPropertyTypes } from "../../../../src/interfaces/properties/EPropertyTypes";
import Housing from './Housing';
import Land from './Land';

export const FilterForm = ({ propertyType }) => {
    const [state, setState] = React.useState({
        age: '',
        name: 'hai',
    });

    const handleChange = (event: any) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const formTypeRender = (): React.ReactElement => {
        let renderedComponent;

        switch (propertyType) {
            case (EPropertyTypes.APARTMENT):
            case (EPropertyTypes.HOUSE):
                renderedComponent = <Housing />
                break;
            case (EPropertyTypes.LANDANDCOMMERCIAL):
                renderedComponent = <Land />
                break;
            default:
                renderedComponent = <div>No property type found</div>;
        }

        return renderedComponent;
    }

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Filtre:
            </Typography>
            {formTypeRender()}
        </React.Fragment>
    );
}

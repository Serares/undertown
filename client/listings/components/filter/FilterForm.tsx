import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { EPropertyTypes } from "../../../../src/interfaces/EPropertyTypes";
import { ETransactionType } from '../../../../src/interfaces/ETransactionType';
import Housing from './Housing';
import Land from './Land';

type FilterFormProps = {
    propertyType: EPropertyTypes,
    transactionType: ETransactionType
}

export const FilterForm: React.FunctionComponent<FilterFormProps> = ({ propertyType, transactionType }) => {
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
    //TODO create a schema from where to render select inputs
    const formTypeRender = (): React.ReactElement => {
        let renderedComponent;

        switch (propertyType) {
            case (EPropertyTypes.APARTMENT):
            case (EPropertyTypes.HOUSE):
                renderedComponent = <Housing transactionType={transactionType} />
                break;
            case (EPropertyTypes.LANDANDCOMMERCIAL):
                renderedComponent = <Land transactionType={transactionType} />
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

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { EPropertyTypes } from "../../../../src/interfaces/EPropertyTypes";
import { ETransactionType } from '../../../../src/interfaces/ETransactionType';
import Housing from './Housing';
import Land from './Land';

type FilterFormProps = {
    propertyType: EPropertyTypes,
    transactionType: ETransactionType,
    filterProperties: (filterType: string, data: any) => any
}

export const FilterForm: React.FunctionComponent<FilterFormProps> = ({ filterProperties, propertyType, transactionType }) => {
    //TODO create a schema from where to render select inputs
    const formTypeRender = (): React.ReactElement => {
        let renderedComponent;

        switch (propertyType) {
            case (EPropertyTypes.APARTMENT):
            case (EPropertyTypes.HOUSE):
                renderedComponent = <Housing propertyType={propertyType} transactionType={transactionType} filterProperties={filterProperties} />
                break;
            case (EPropertyTypes.LANDANDCOMMERCIAL):
                renderedComponent = <Land filterProperties={filterProperties} transactionType={transactionType} />
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

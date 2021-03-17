import * as React from "react";
import * as ReactDOM from "react-dom";
import { Cards } from './components/cards/Cards';
import { FilterForm } from './components/filter/FilterForm';
import Pagination from './components/pagination/Pagination';

import axios from "axios";

const App = () => {
    let state = {
        properties: [],
        propertyType: 0,

    }
    //TODO add useReducer
    const [listingsState, setListingsState] = React.useState(state);
    const [isLoading, setIsLoading] = React.useState(true);
    const baseGetUrl = "/listings";
    const propertiesPerPage = 1;

    React.useEffect(() => {
        // pathname can only be /transactionType/propertyType
        // e.g. /vanzari/case
        if (window.location.pathname !== "") {
            const url = `${baseGetUrl}/${window.location.pathname.split("/")[1]}/${window.location.pathname.split("/")[2]}`;
            axios.get(url)
                .then((data) => {
                    //@ts-ignore
                    updateState(JSON.parse(data.data));
                })
                .catch(err => {
                    console.log(err);
                })
        };

    }, []);

    function updateState(data: any) {
        setListingsState({
            ...listingsState,
            properties: data.properties || [],
            propertyType: data.propertyType || 0
        })
    }

    function paginationChange(e: any, value: any) {

    }

    function paginationNumber() {

    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-4">
                    <FilterForm propertyType={listingsState.propertyType} />
                </div>
                <div className="col-lg-8">
                    <Cards properties={listingsState.properties} />
                    <div className="row">
                        <Pagination pagesNumber={5} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

document.querySelector("#listings-page")!.innerHTML = "";
ReactDOM.render(<App />, document.querySelector("#listings-page"));

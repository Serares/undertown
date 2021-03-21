import * as React from "react";
import * as ReactDOM from "react-dom";
import { Cards } from './components/cards/Cards';
import { FilterForm } from './components/filter/FilterForm';
import Pagination from './components/pagination/Pagination';
import axios from "axios";

type AppProps = {
    fetchUrl: string
}

const App: React.FunctionComponent<AppProps> = ({ fetchUrl }) => {
    const propertiesPerPage = 5;

    let onRenderState = {
        properties: [],
        propertyType: 0,
        transactionType: 0,
        isLoading: true
    };

    let paginationData = {
        currentPage: 1,
        indexOfLastProp: 1 * propertiesPerPage,
        indexOfFirstProp: 0
    };

    //TODO refactor using -> useReducer
    const [listingsState, setListingsState] = React.useState(onRenderState);
    const [paginationState, setPaginationState] = React.useState(paginationData);


    React.useEffect(() => {
        // pathname can only be /transactionType-propertyType
        // e.g. /1-1
        if (window.location.pathname !== "") {
            axios.get(fetchUrl)
                .then((data) => {
                    console.log(data);
                    updateState(data.data);
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
            propertyType: data.propertyType || 0,
            transactionType: data.transactionType || 0,
            isLoading: false
        })
    }

    function handlePageChange(e: Event, value: number) {
        let lastIndex = value * propertiesPerPage;
        let firstIndex = lastIndex - propertiesPerPage;

        setPaginationState({
            ...paginationState,
            currentPage: value,
            indexOfLastProp: lastIndex,
            indexOfFirstProp: firstIndex
        })
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-4">
                    <FilterForm propertyType={listingsState.propertyType} transactionType={listingsState.transactionType} />
                </div>
                {listingsState.isLoading ?
                    "Loading"
                    :
                    <div className="col-lg-8">
                        <Cards properties={listingsState.properties.slice(paginationState.indexOfFirstProp, paginationState.indexOfLastProp)} />
                        <div className="row">
                            <Pagination pagesNumber={Math.ceil(listingsState.properties.length / propertiesPerPage)} handleChange={handlePageChange} />
                        </div>
                    </div>
                }
            </div>
        </React.Fragment>
    );
};

function renderListings(fetchUrl: string) {
    document.querySelector("#listings-page")!.innerHTML = "";
    ReactDOM.render(<App fetchUrl={fetchUrl} />, document.querySelector("#listings-page"));
}

//@ts-ignore
window["renderListings"] = renderListings;

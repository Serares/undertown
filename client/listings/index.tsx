import * as React from "react";
import * as ReactDOM from "react-dom";
import { Cards } from './components/cards/Cards';
import { FilterForm } from './components/filter/FilterForm';
import Pagination from './components/pagination/Pagination';
import axios from "axios";
import { ICardProperty } from '../../src/interfaces/ICardProperty';
import { EPropertyTypes } from "../../src/interfaces/EPropertyTypes";
import { ETransactionType } from "../../src/interfaces/ETransactionType";

type AppProps = {
    fetchUrl: string
}

type AppState = {
    properties: ICardProperty[];
    propertyType: EPropertyTypes;
    transactionType: ETransactionType;
    isLoading: boolean;
    filteredProperties: ICardProperty[];
    pagination: {
        currentPage: number;
        indexOfLastProp: number;
        indexOfFirstProp: number;
    },
    filters: {
        price: {
            min: number | null,
            max: number | null
        },
        rooms: number | null,
        surface: {
            min: number | null,
            max: number | null
        }
    }
}

const App: React.FunctionComponent<AppProps> = ({ fetchUrl }) => {
    const propertiesPerPage = 5;

    let state = {
        properties: [],
        propertyType: 0,
        transactionType: 0,
        isLoading: true,
        filteredProperties: [],
        pagination: {
            currentPage: 1,
            indexOfLastProp: 1 * propertiesPerPage,
            indexOfFirstProp: 0
        },
        filters: {
            price: {
                min: null,
                max: null
            },
            rooms: null,
            surface: {
                min: null,
                max: null
            }
        }
    };

    const [listingsState, setListingsState] = React.useState<AppState>(state);

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
            isLoading: false,
            filteredProperties: data.properties || []
        })
    };

    function handlePageChange(e: Event, value: number) {
        let lastIndex = value * propertiesPerPage;
        let firstIndex = lastIndex - propertiesPerPage;

        setListingsState({
            ...listingsState,
            pagination: {
                ...listingsState.pagination,
                currentPage: value,
                indexOfLastProp: lastIndex,
                indexOfFirstProp: firstIndex
            }
        })
    };

    /**
     * Reset Filters
     */

    const resetFilters = () => {
        
    }

    /**
     * @param data -> name of filter
     */
    const filterByRooms = (data: string) => {
        let properties = [...listingsState.properties];
        let roomFilters = listingsState.filters.rooms;
        //@ts-ignore
        roomFilters = Number(data);

        function filterCb(value: ICardProperty) {
            if (!Number(roomFilters)) return true;

            if(roomFilters! > 3) {
                return value.features.rooms! >= roomFilters!;
            };

            return value.features.rooms === roomFilters;
        }

        let newProperties = properties.filter(filterCb);

        setListingsState({
            ...listingsState,
            filteredProperties: newProperties,
            filters: {
                ...listingsState.filters,
                rooms: roomFilters
            }
        });
    }
    /**
     * @param data[0] -> min or max
     * @param data[1] -> value of filter
     */
    const filterByPrice = (data: [string, string]) => {
        let properties = [...listingsState.properties];
        let priceFilters = {
            ...listingsState.filters.price
        };
        //@ts-ignore
        priceFilters[data[0]] = Number(data[1]);

        function filterCb(value: ICardProperty) {
            if (priceFilters.min !== null && priceFilters.max !== null) {
                return Number(value.price) >= priceFilters.min && value.price <= priceFilters.max;
            }

            if (priceFilters.min !== null) {
                return Number(value.price) >= priceFilters.min;
            }

            if (priceFilters.max !== null && priceFilters.max > Number(priceFilters.min)) {
                return Number(value.price) <= priceFilters.max;
            }

            return true;
        }

        let newProperties = properties.filter(filterCb);

        setListingsState({
            ...listingsState,
            filteredProperties: newProperties,
            filters: {
                ...listingsState.filters,
                price: {
                    ...priceFilters
                }
            }
        });
    }

    /**
     * @param data[0] -> min or max
     * @param data[1] -> value of filter
     */
    const filterBySurface = (data: [string, string]) => {

        let properties = [...listingsState.properties];
        let surfaceFilters = {
            ...listingsState.filters.surface
        };
        //@ts-ignore
        surfaceFilters[data[0]] = Number(data[1]);

        function filterCb(value: ICardProperty) {
            if (surfaceFilters.min !== null && surfaceFilters.max !== null) {
                return Number(value.features.usableArea) >= surfaceFilters.min && value.features.usableArea <= surfaceFilters.max;
            }

            if (surfaceFilters.min !== null) {
                return Number(value.features.usableArea) >= surfaceFilters.min;
            }

            if (surfaceFilters.max !== null && surfaceFilters.max > Number(surfaceFilters.min)) {
                return Number(value.features.usableArea) <= surfaceFilters.max;
            }

            return true;
        }

        let newProperties = properties.filter(filterCb);

        setListingsState({
            ...listingsState,
            filteredProperties: newProperties,
            filters: {
                ...listingsState.filters,
                surface: {
                    ...surfaceFilters
                }
            }
        });
    }

    const filterProperties = (type: string, data: string | [string, string]) => {
        switch (type) {
            case ("rooms"):
                if (typeof data === "string") {
                    filterByRooms(data)
                }
                break;
            case ("price"):
                if (typeof data !== "string") {
                    filterByPrice(data);
                }
                break;
            case ("surface"):
                if (typeof data !== "string") {
                    filterBySurface(data);
                }
                break;
            default:
                return;
        }
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-4">
                    <FilterForm
                        propertyType={listingsState.propertyType}
                        transactionType={listingsState.transactionType}
                        filterProperties={filterProperties}
                    />
                </div>
                {listingsState.isLoading ?
                    "Loading"
                    :
                    <div className="col-lg-8">
                        <Cards properties={listingsState.filteredProperties.slice(listingsState.pagination.indexOfFirstProp, listingsState.pagination.indexOfLastProp)} />
                        <div className="row">
                            <Pagination pagesNumber={Math.ceil(listingsState.filteredProperties.length / propertiesPerPage)} handleChange={handlePageChange} />
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

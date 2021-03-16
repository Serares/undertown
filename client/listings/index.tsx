import * as React from "react";
import * as ReactDOM from "react-dom";
import { Cards } from './components/Cards';
import Filter from './components/Form';
import axios from "axios";

const App = () => {
    //TODO add useReducer
    const [propertyList, setPropertyList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const baseGetUrl = "/listings";

    React.useEffect(() => {
        // pathname can only be /transactionType/propertyType
        // e.g. /vanzari/case
        if (window.location.pathname !== "") {
            const url = `${baseGetUrl}/${window.location.pathname.split("/")[1]}/${window.location.pathname.split("/")[2]}`;
            axios.get(url)
                .then((data) => {
                    //@ts-ignore
                    setPropertyList(JSON.parse(data.data.properties))
                })
                .catch(err => {
                    console.log(err);
                })
        };

    }, []);

    return (
        <React.Fragment>
            {isLoading && "Loading"}
            <div className="row">
                <div className="col-lg-4">
                    <Filter />
                </div>
                <div className="col-lg-8">
                    <Cards properties={propertyList} />
                </div>
            </div>
        </React.Fragment>
    )
};

document.querySelector("#listings-page")!.innerHTML = "";
ReactDOM.render(<App />, document.querySelector("#listings-page"));

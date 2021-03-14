import axios from 'axios';

(function () {
    function QueryProperties(sortFormElement: HTMLElement, filterFormElement: HTMLElement, propertiesRowElement: HTMLElement) {
        this.xmlRequest = new XMLHttpRequest();
        this.sortFormElement = sortFormElement;
        this.filterFormElement = filterFormElement;
        this.propertiesRowElement = propertiesRowElement;
        this.loadingSpinner = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
        this.formData;
        this.queryUrl = "/filter";
        this.paginationContainer = document.querySelector(".pagination_style1");
    }

    QueryProperties.prototype.handleError = function (err) {
        var error = new Error("Initialize properties failed");
        error.errors = err;
        console.log(error);
    }

    QueryProperties.prototype.sendRequestForData = function (e, pageNumber) {
        try {
            e.preventDefault();
        } catch (err) {
            console.log("Initiated from constructor sendRequestForData");
        }
        // SET LOADING TRUE
        this.propertiesRowElement.innerHTML = this.loadingSpinner;
        var filterFormFields;
        var sortFormFields;
        try {
            filterFormFields = new FormData(this.filterFormElement);
            sortFormFields = new FormData(this.sortFormElement);
            this.formData = new FormData();
            filterFormFields.forEach((value, key) => {
                this.formData.append(key, value);
            })
            sortFormFields.forEach((value, key) => {
                this.formData.append(key, value);
            })
        } catch (err) {
            this.formData = new FormData();
        }

        this.formData.append("SEARCH_STATUS", document.querySelector("#search_status").value);
        //if prop type comes from the form don't add the one from the hidden input that comes from HP
        if (e.type == "DOMContentLoaded") {
            this.formData.append("PROPERTY_TYPE_HP", document.querySelector("#property_type").value);
        }
        // append the page number
        if (pageNumber) {
            this.formData.append('pageNumber', pageNumber);
        }
        var object = {};
        this.formData.forEach((value, key) => {
            object[key] = value;
        });
        // get the property type in here sell/rent

        var jsonObject = JSON.stringify(object);

        this.xmlRequest.open('POST', this.queryUrl);

        this.xmlRequest.setRequestHeader('Content-Type', 'application/json');
        this.xmlRequest.send(jsonObject);
    }

    QueryProperties.prototype.drawProperties = function (properties) {
        function addCaracteristici(prop) {
            var features = `
            <li>
                <span> ${prop.rooms} </span> Camere
            </li>`
            return features;
        }

        function createPropertyPath(status) {
            var pagePath = "";

            switch (status) {
                case (1):
                    pagePath = "vanzare";
                    break;
                case (2):
                    pagePath = "inchiriere";
                    break;
                default:
                    pageTitle = "";
                    break;
            }
            return pagePath;
        }
        console.log("Drawing properties");
        var propertiesElements = "";
        if (properties.length > 0) {
            for (var property of properties) {
                var propertyElement = `
            <div class="col-md-12">
                <div class="property_list_1 property_item bg-white mb_30">
                    <div class="zoom_effect_1">
                     <a href="/${createPropertyPath(property.transactionStatus)}/${property.shortId}">
                        <img src="${property.thumbnail}" alt="Image Found">
                     </a>
                     <div class="upper_2">
                                                <i class="far fa-images"></i>
                                                <span>${property.imagesNumber}</span>
                                            </div>
                    </div>
                        <div class="float-right property_list_details p-3">
                            <div class="property_text">
                                <h5 class="title">
                                    <a href="/${createPropertyPath(property.transactionStatus)}/${property.shortId}">${property.title}</a>
                                </h5>
                                <span class="my-3 d-block"><i class="fas fa-map-marker-alt"></i>
                                ${property.address} </span>
                                <!-- caracteristici prev -->
                        <div class="quantity">
                                    <ul>
                                        ${addCaracteristici(property)}
                                    </ul>
                                </div>
                            </div>
                            <div class="bed_area d-table w-100">
                                <ul>
                                    <li>${property.displayPrice}</li>
                                    <li><a href="/${createPropertyPath(property.transactionStatus)}/${property.shortId}">
                                                            <button type="button"
                                                                class="mx-5 btn btn-primary">Detalii</button>
                                                        </a>
                                                    </li>
                                    <li class="icon_medium">
                                    <a href="#">
                                        <i class="flaticon-like"></i>
                                    </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                propertiesElements += propertyElement;
            }

        } else {
            propertiesElements += ('<h2>Nu s-au gasit proprietăți</h2>');
        }

        this.propertiesRowElement.innerHTML = "";
        this.propertiesRowElement.innerHTML = propertiesElements;
        //loading false
    }

    QueryProperties.prototype.onLoad = function () {

        var response = this.xmlRequest.response;
        var serverResponse;
        var properties;
        var paginationData;
        try {
            serverResponse = JSON.parse(response);
            properties = JSON.parse(serverResponse["properties"]);
            paginationData = JSON.parse(serverResponse["paginationData"]);
            if (this.xmlRequest.status == 200) {
                console.log("Got properties");
            }

        } catch (err) {

            if (this.xmlRequest.status == 404) {
                // no properties found
                properties = [];
                console.log("Response 404");
            }

            if (this.xmlRequest.status == 500) {
                alert("Eroare de retea, incearca din nou");
            }
        }

        this.drawProperties(properties);
        this.renderPagination(paginationData || null);
        this.updatePropertiesCount(paginationData["count_properties"]);

    }

    QueryProperties.prototype.updatePropertiesCount = function (propertiesCount) {
        var properties_count_element = document.querySelector(".p_count");
        var countText = "";
        if (propertiesCount < 2) {
            countText = propertiesCount + " proprietate găsită"
        } else {
            countText = propertiesCount + " proprietăți"
        }
        properties_count_element.innerHTML = countText;
    }

    QueryProperties.prototype.paginationOnClick = function (pageNumber) {

        console.log("Page numer", pageNumber);
        this.sendRequestForData({}, pageNumber);

    }

    QueryProperties.prototype.renderPagination = function (paginationData) {
        if (!paginationData) {
            this.paginationContainer.innerHTML = "";
            return;
        }
        var paginationList = document.createElement("ul");
        var paginationNav = document.createElement("nav");

        paginationList.className = "pagination";
        paginationNav.setAttribute('aria-label', 'page navigation');

        var self = this;

        var prevPage = document.createElement('li');
        prevPage.onclick = function () {
            self.paginationOnClick(paginationData["previousPage"]);
        }
        var nextPage = document.createElement('li');
        nextPage.onclick = function () {
            self.paginationOnClick(paginationData["nextPage"]);
        }
        var chevronRight = document.createElement('i');
        chevronRight.className = 'fas fa-chevron-right';
        var chevronLeft = document.createElement('i');
        chevronLeft.className = 'fas fa-chevron-left';

        prevPage.appendChild(chevronLeft);
        nextPage.appendChild(chevronRight);

        function generatePages() {
            var currentPage = paginationData["pageNumber"];
            var lastPage = paginationData["lastPage"];
            function creteEvent(i) {
                return function () {
                    self.paginationOnClick(i)
                };
            }
            var i = (Number(currentPage) > 5 ? Number(currentPage) - 4 : 1);
            if (i !== 1) {
                var firstPage = document.createElement('li');
                var anchorElementDots = document.createElement('li');

                firstPage.onclick = function () {
                    self.paginationOnClick(1);
                }

                anchorElementDots.innerHTML = "<a>...</a>";
                anchorElementDots.className = "disabled";
                firstPage.innerHTML = `<a>${1}</a>`;

                paginationList.appendChild(firstPage);
                paginationList.appendChild(anchorElementDots);
            };
            for (; i <= (Number(currentPage) + 4) && i <= lastPage; i++) {
                if (i == currentPage) {
                    var currentLi = document.createElement('li');
                    currentLi.className = "active";
                    currentLi.innerHTML = `<a>${i}</a>`;
                    paginationList.appendChild(currentLi);
                } else {
                    var listItem = document.createElement('li');
                    listItem.innerHTML = `<a>${i}</a>`;
                    listItem.onclick = creteEvent(i);
                    paginationList.appendChild(listItem);
                }
            }

            if (i == Number(currentPage) + 5 && i < lastPage) {
                var lastPageElement = document.createElement('li');
                var lastDots = document.createElement('li');

                lastPageElement.onclick = function () {
                    self.paginationOnClick(lastPage);
                }

                lastDots.innerHTML = "<a>...</a>";
                lastDots.className = "disabled";

                lastPageElement.innerHTML = `<a>${lastPage}</a>`;

                paginationList.appendChild(lastDots);
                paginationList.appendChild(lastPageElement);
            }
        }

        paginationData["hasPreviousPage"] ? paginationList.appendChild(prevPage) : null;
        generatePages();
        paginationData["hasNextPage"] ? paginationList.appendChild(nextPage) : null;
        paginationNav.appendChild(paginationList);
        console.log("Pagination List", paginationList);
        this.paginationContainer.innerHTML = "";
        this.paginationContainer.appendChild(paginationNav);
    };

    function SortAndFilterProperties(sortFormElement, filterFormElement, propertiesRowElement) {
        QueryProperties.call(this, sortFormElement, filterFormElement, propertiesRowElement);
        console.log("Sort properties initiated");
        //assigning event listeners
        this.sortFormElement.onchange = this.sendRequestForData.bind(this);
        this.filterFormElement.onsubmit = this.sendRequestForData.bind(this);
        this.xmlRequest.onload = this.onLoad.bind(this);
        this.xmlRequest.onerror = function () { console.log("Got an error" + this.xmlRequest.response) };
    }

    function PaginationRender(sortFormElement, filterFormElement, propertiesRowElement) {
        QueryProperties.call(this, sortFormElement, filterFormElement, propertiesRowElement);
        console.log("rendered pagination");
        var self = this;
        document.addEventListener('DOMContentLoaded', function (e) {
            console.log("Loaded content");
            self.sendRequestForData(e, null);
        })
        this.xmlRequest.onload = this.onLoad.bind(this);
    }

    SortAndFilterProperties.prototype = Object.create(QueryProperties.prototype);
    Object.defineProperty(SortAndFilterProperties.prototype, 'constructor', {
        value: SortAndFilterProperties,
        enumerable: false,
        writable: true
    });

    PaginationRender.prototype = Object.create(QueryProperties.prototype);
    Object.defineProperty(PaginationRender.prototype, 'constructor', {
        value: PaginationRender,
        enumerable: false,
        writable: true
    });


    try {
        // properties js
        var filterFormElement = document.querySelector('#filter_form');
        var propertiesRowElement = document.querySelector("#properties-row");
        var sortFormElement = document.querySelector("#sort_form");

        var filterPropertiesInstance = new SortAndFilterProperties(sortFormElement, filterFormElement, propertiesRowElement);
        var paginationRenderer = new PaginationRender(sortFormElement, filterFormElement, propertiesRowElement);
    } catch (err) {
        console.log(err);
    }

})()

function HandleContactPage(contactForm, errorElem, successElem) {
    this.contactForm = contactForm;
    this.errorElem = errorElem;
    this.successElem = successElem;
    this.contactForm.onsubmit = this.submit.bind(this);
    this.xmlObject = new XMLHttpRequest();
    this.queryUrl = '/send_email';
    this.xmlObject.onload = this.response.bind(this);
}

HandleContactPage.prototype.submit = function (e) {
    e.preventDefault();
    var formData = new FormData(this.contactForm);
    this.xmlObject.open('POST', this.queryUrl);
    var sentObject = {};
    formData.forEach((value, key) => {
        sentObject[key] = value;
    })
    this.xmlObject.setRequestHeader('Content-Type', 'application/json');
    this.xmlObject.send(JSON.stringify(sentObject));
}

HandleContactPage.prototype.response = function (e) {

    var response = this.xmlObject.response;
    if (this.xmlObject.status == 200) {
        this.clearErrors(JSON.parse(response));
        return;
    }

    if (this.xmlObject.status == 422) {
        this.showError(JSON.parse(response));
        return;
    }

    if (this.xmlObject.status == 500) {
        alert("Eroare de retea, incearca din nou");
        return;
    }
}

HandleContactPage.prototype.clearErrors = function (resp) {

    var inputs = this.contactForm.elements;
    var response = resp['message'];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains("errors-display")) {
            inputs[i].classList.remove("errors-display");
        }
    };
    this.successElem.innerHTML = response;
    this.successElem.style.display = "block";
    this.errorElem.style.display = "none";
}

HandleContactPage.prototype.showError = function (errors) {

    console.log("Errori", errors);
    var errorsArray = null;
    if (errors) {
        errorsArray = errors['error']['errors'];
    }
    if (errorsArray) {
        errorsArray.forEach((value, index) => {
            var element;
            if (value["param"] == "message") {
                element = document.querySelector('textarea[name="' + value["param"] + '"]');
            } else {
                element = document.querySelector('input[name="' + value["param"] + '"]');
            }
            if (element) {
                element.classList.add("errors-display");
            }
        })

        this.errorElem.style.display = "block";
        this.errorElem.innerHTML = errorsArray[0]["msg"];
        this.successElem.style.display = "none";

    }
}

var contactForm = document.querySelector("#contact-form");
var errorMsgElement = document.querySelector("#error")
var successMsgElement = document.querySelector("#success");

var handleContact = new HandleContactPage(contactForm, errorMsgElement, successMsgElement);

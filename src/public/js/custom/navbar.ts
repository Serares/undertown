(function () {
    var logoutElement = document.querySelector("#basic_logout");
    var xml = new XMLHttpRequest();
    xml.onload = function () {
        var response = xml.response;
        var serverResponse = JSON.parse(response);
        if (xml.status == 200) {
            console.log("Logged out");
            window.location.reload();
        }
    }

    if (logoutElement) {
        logoutElement.addEventListener('click', function (event) {
            event.preventDefault();

            xml.open('DELETE', "/logout");

            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send();
        })
    }
})()


const addPropertyHost = window.location.hostname.indexOf("localhost") > -1 ? "http://localhost:5300" : "https://databaseapi-312806.oa.r.appspot.com/";

export const URLS = {
    HOME: "/",
    FORGOT_PASSWORD: "/forgotPassword",
    ADD_PROPERTY: `${addPropertyHost}/user/submitProperty`
}

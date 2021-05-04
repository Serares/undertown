const addPropertyHost = window.location.hostname === "localhost" ? "http://localhost:5300" : "TODO";

export const URLS = {
    HOME: "/",
    FORGOT_PASSWORD: "/forgotPassword",
    ADD_PROPERTY: `${addPropertyHost}/user/submiteProperty`
}

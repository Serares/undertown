import Vue from 'vue';

export const navbarController = () => {
    /**
     * this controller has to check if token exists so it can render apropriate text on navbar
     * has to guard add property and redirect to login page
     */

    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                addPropertyUrl: "/adauga-proprietate",
                redirectUrl: "/autentificare",
                isLoggedIn: false
            };
        },
        el: "#navbarApp",
        methods: {
            logOut: function (e: Event) {
                e.preventDefault();
                window.localStorage.removeItem("token");
                this.isLoggedIn = false;
            },
            getAddProperty: function (e: Event) {
                if (!this.isLoggedIn) {
                    window.location.pathname = this.redirectUrl;
                } else {
                    // send request for get add property
                    // add query parameters to validate on server if it's logged in
                    // also validation happens on FE
                    window.location.pathname = `${this.addPropertyUrl}?logged=${this.isLoggedIn ? 1 : 0}`;
                }
            },
            isTokenValid: function (): Promise<boolean> {
                // TODO externalize this method
                return new Promise((resolve) => {
                    let token = window.localStorage.getItem("token");
                    if (token) {
                        let payload = JSON.parse(window.atob(token.split(".")[1]));
                        let isTokenValid = payload.exp > Date.now() / 1000;
                        return resolve(isTokenValid);
                    } else {
                        resolve(false);
                    }
                })
            }
        },
        mounted() {
            this.isTokenValid()
                .then((bool) => {
                    this.isLoggedIn = bool;
                })
        }
    });
}

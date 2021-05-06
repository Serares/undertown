import Vue from 'vue';
import { getTokenPayload } from './utils/methods';

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
                isLoggedIn: false,
                userEmail: ""
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
                    let redirectUrl = new URL(window.location.origin);
                    redirectUrl.pathname = this.addPropertyUrl;
                    redirectUrl.searchParams.append("logged", this.isLoggedIn ? "1" : "0");
                    window.location.href = redirectUrl.href;
                }
            },

        },
        mounted() {
            getTokenPayload()
                .then((payload) => {
                    if (!payload) {
                        return;
                    }
                    this.isLoggedIn = true;
                    this.userEmail = payload.email;
                })
        }
    });
}

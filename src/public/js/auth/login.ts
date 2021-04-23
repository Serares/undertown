import { userRoute } from '../../../services/clientRequests';
import Vue from 'vue';

export const loginController = () => {
    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                errors: [],
                password: null,
                email: null,
                accessURL: "/login"
            };
        },
        el: "#loginApp",
        methods: {
            formSubmit: function (e: Event) {
                this.checkForm(e)
                    .then(this.getAccessToken)
                    .then(this.saveToken)
                    .then(this.redirectToHomepage)
                    .catch((err) => {
                        //@ts-ignore
                        this.errors.push(...err);
                    })
            },
            redirectToHomepage: function () {
                return new Promise(resolve => {
                    window.location.pathname = "/";
                    resolve("Redirect success");
                })
            },
            saveToken: function (token: any) {
                return new Promise((resolve) => {
                    window.localStorage.setItem("token", token);
                    resolve("Token saved");
                })
            },
            checkForm: function (e: Event) {
                e.preventDefault();
                return new Promise((resolve, reject) => {
                    if (this.password && this.email) {
                        resolve("Validaiton ok")
                    }

                    this.errors = [];
                    let newErrors = [];

                    if (!this.password) {
                        //@ts-ignore
                        newErrors.push('Este necesara parola');
                    }
                    if (!this.email) {
                        //@ts-ignore
                        newErrors.push('Nu ai completat emailul');
                    }
                    reject(newErrors)
                })
            },
            getAccessToken: function () {
                return new Promise(async (resolve, reject) => {
                    try {
                        let response = await userRoute.post(this.accessURL, { email: this.email, password: this.password });
                        console.log(response);
                        resolve(response.data.token);
                    } catch (err) {
                        if (Number(err.response.status) === 404) {
                            reject(["Email sau parola gresite"]);
                        }
                        reject(err);
                    }
                })
            }
        }
    });
}
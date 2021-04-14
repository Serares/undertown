import { userRoute } from '../../../services/clientRequests';
import Vue from 'vue';

export const signUpController = () => {
    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                errors: [],
                password: null,
                confirmPassword: null,
                email: null,
                name: null,
                phoneNumber: null,
                accessURL: "/signup"
            };
        },
        el: "#signUpApp",
        methods: {
            formSubmit: function (e: Event) {
                this.checkForm(e)
                    .then(this.sendUserData)
                    .then(() => { window.location.pathname = "/autentificare"; })
                    .catch((err) => {
                        //@ts-ignore
                        this.errors.push(err);
                    })
            },
            checkForm: function (e: Event) {
                e.preventDefault();
                return new Promise((resolve, reject) => {
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

                    if (newErrors.length < 1) {
                        let formData = {
                            email: this.email,
                            password: this.password,
                            name: this.name,
                            phoneNumber: this.phoneNumber
                        }
                        resolve(formData)
                    }

                    reject(newErrors)
                })
            },
            sendUserData: function (data: any) {
                console.log(data);
                return new Promise(async (resolve, reject) => {
                    try {
                        await userRoute.post(this.accessURL, data);
                        resolve("Success");
                    } catch (err) {
                        console.log(err);
                        reject("Erroare la trimiterea datelor, mai incearca");
                    }
                })
            }
        }
    });
}
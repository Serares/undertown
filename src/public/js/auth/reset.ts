import { userRoute } from '../../../services/axios';
import Vue from 'vue';

export const resetController = () => {
    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                errors: [],
                success: null,
                password: null,
                confirmPassword: null,
                restToken: null,
                userId: null,
                accessURL: "/resetPassword"
            };
        },
        el: "#resetApp",
        methods: {
            formSubmit: function (e: Event) {
                this.checkForm(e)
                    .then(this.getHiddenInputsData)
                    .then(this.sendDataToBackend)
                    .then(this.showSuccessMessage)
                    .catch((err) => {
                        console.log(err);
                        //@ts-ignore
                        this.errors.push(...err);
                    })
            },
            checkForm: function (e: Event) {
                e.preventDefault();
                return new Promise((resolve, reject) => {
                    //@ts-ignore
                    if (this.password.length >= 5 && this.confirmPassword === this.password) {
                        resolve("Validaiton ok")
                    }

                    this.errors = [];
                    let newErrors = [];
                    if (!this.password) {
                        //@ts-ignore
                        newErrors.push('Nu ai completat parola');
                    }
                    //@ts-ignore
                    if (this.password.length < 5) {
                        //@ts-ignore
                        newErrors.push('Parola trebuie sa aibe minim 5 caractere');
                    }

                    //@ts-ignore
                    if (this.password !== this.confirmPassword) {
                        //@ts-ignore
                        newErrors.push('Parolele nu se potrivesc');
                    }

                    reject(newErrors)
                })
            },
            sendDataToBackend: function () {
                return new Promise(async (resolve, reject) => {
                    try {
                        //TODO find a better way to get data from hidden inputs
                        let requestBody = {
                            userId: this.userId,
                            resetToken: this.restToken,
                            password: this.password
                        }
                        let response = await userRoute.post(this.accessURL, requestBody);
                        resolve("Succes parola a fost schimbata");
                    } catch (err) {
                        console.log(err);
                        reject(["A aparut o eroare"])
                    }
                })
            },
            showSuccessMessage: function (successMessage: any) {
                return new Promise(resolve => {
                    this.success = successMessage;
                    resolve("")
                })
            },
            getHiddenInputsData: function () {
                return new Promise((resolve, reject) => {
                    let resetToken = document.querySelector("input[name='resetToken']");
                    let userId = document.querySelector("input[name='userId']");
                    if (resetToken !== null && userId !== null) {
                        //@ts-ignore
                        this.userId = userId.value;
                        //@ts-ignore
                        this.restToken = resetToken.value;
                        resolve("Datele extrase cu succes")
                    }else{
                        reject(["A aparut o problema"])
                    }
                })

            }
        },
        mounted() {
            console.log(this.restToken);
        }
    });
}

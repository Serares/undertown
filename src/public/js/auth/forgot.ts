import { userRoute } from '../../../services/clientRequests';
import Vue from 'vue';

export const forgotController = () => {
    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                errors: [],
                success: null,
                email: null,
                accessURL: "/forgotPassword"
            };
        },
        el: "#forgotApp",
        methods: {
            formSubmit: function (e: Event) {
                this.checkForm(e)
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
                    if (this.email) {
                        resolve("Validaiton ok")
                    }

                    this.errors = [];
                    let newErrors = [];
                    if (!this.email) {
                        //@ts-ignore
                        newErrors.push('Nu ai completat emailul');
                    }
                    reject(newErrors)
                })
            },
            sendDataToBackend: function () {
                return new Promise(async (resolve, reject) => {
                    try {
                        let response = await userRoute.post(this.accessURL, { email: this.email });
                        resolve("Succes, verifica emailul");
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
            }
        }
    });
}
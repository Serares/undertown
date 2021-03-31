import axios from 'axios';
import Vue from 'vue';

export const loginController = () => {
    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                errors: [],
                name: null,
                email: null
            };
        },
        el: "#loginApp",
        methods: {
            checkForm: function (e: Event) {
                if (this.name && this.email) {
                    return true;
                }

                this.errors = [];

                if (!this.name) {
                    //@ts-ignore
                    this.errors.push('Este necesar numele');
                }
                if (!this.email) {
                    //@ts-ignore
                    this.errors.push('Nu ai completat emailul');
                }

                e.preventDefault();
            }
        },
        mounted() {

        }
    });
}
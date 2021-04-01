import { loginController } from './login';
import { signUpController } from './signup';
import { forgotController } from './forgot';
import { resetController } from './reset';

if (typeof document.querySelector("#loginForm") !== "undefined" && document.querySelector("#loginForm") !== null) {
    loginController();
}

if (typeof document.querySelector("#signUpForm") !== "undefined" && document.querySelector("#signUpForm") !== null) {
    signUpController();
}

if (typeof document.querySelector("#forgotForm") !== "undefined" && document.querySelector("#forgotForm") !== null) {
    forgotController();
}

if (typeof document.querySelector("#resetForm") !== "undefined" && document.querySelector("#resetForm") !== null) {
    resetController();
}
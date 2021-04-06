import { loginController } from './login';
import { signUpController } from './signup';
import { forgotController } from './forgot';
import { resetController } from './reset';
import { navbarController } from './navbar';
import { addPropertyController } from './addProperty';

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

if (typeof document.querySelector("#navigation_component") !== "undefined" && document.querySelector("#navigation_component") !== null) {
    navbarController();
}

if (typeof document.querySelector("#submitPropertyApp") !== "undefined" && document.querySelector("#submitPropertyApp") !== null) {
    addPropertyController();
}

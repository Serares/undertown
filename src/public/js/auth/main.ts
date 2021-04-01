import { loginController } from './login';
import { signUpController } from './signup';

if (typeof document.querySelector("#loginForm") !== "undefined" && document.querySelector("#loginForm") !== null) {
    loginController();
}

if (typeof document.querySelector("#signUpForm") !== "undefined" && document.querySelector("#signUpForm") !== null) {
    signUpController();
}
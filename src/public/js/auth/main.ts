import { loginController } from './login';

if (typeof document.querySelector("#loginForm") !== "undefined" && document.querySelector("#loginForm") !== null) {
    loginController();
}

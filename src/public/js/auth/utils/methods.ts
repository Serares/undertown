export const isTokenValid = function (): Promise<boolean> {
    return new Promise((resolve) => {
        let token = window.localStorage.getItem("token");
        if (token) {
            let payload = JSON.parse(window.atob(token.split(".")[1]));
            let isTokenValid = payload.exp > Date.now() / 1000;
            return resolve(isTokenValid);
        } else {
            resolve(false);
        }
    })
}

export const getTokenPayload = function (): Promise<boolean | string> {
    return new Promise((resolve) => {
        let token = window.localStorage.getItem("token");
        if (token) {
            let payload = JSON.parse(window.atob(token.split(".")[1]));
            return resolve(payload);
        } else {
            resolve(false);
        }
    })
}

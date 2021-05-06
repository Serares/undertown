
export const getTokenPayload = function (): Promise<boolean | any> {
    return new Promise((resolve) => {
        let token = window.localStorage.getItem("token");
        if (token) {
            let payload = JSON.parse(window.atob(token.split(".")[1]));
            let isTokenValid = payload.exp > Date.now() / 1000;
            if (isTokenValid) {
                return resolve(payload);
            } else {
                window.localStorage.removeItem("token");
                return resolve(isTokenValid);
            }
        } else {
            resolve(false);
        }
    })
}

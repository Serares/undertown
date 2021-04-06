import axios from 'axios';

const tokenHeader = () => {
    const headersData: { [key: string]: string } = { "Content-Type": "application/json" };
    const token = window.localStorage.getItem('token');
    if (token) {
        headersData.Authorization = `Bearer ${token}`;
    }
    return headersData;
}

/**
 * db_api request
 */
export const dbApi = axios.create({
    //TODO
    baseURL: "",
})

export const userRoute = axios.create({
    baseURL: "/user"
});

/**
 * used on frontend
 */
export const secureRoute = axios.create({
    baseURL: window.location.origin,
    headers: tokenHeader()
})

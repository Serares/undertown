import axios from 'axios';

let tokenHeader;
if (typeof window !== "undefined") {
    tokenHeader = () => {
        const headersData: { [key: string]: string } = { "Content-Type": "application/json" };
        const token = window.localStorage.getItem('token');
        if (token) {
            headersData.Authorization = `Bearer ${token}`;
        }
        return headersData;
    }
}

/**
 * used on frontend
 */
export const userRoute = axios.create({
    baseURL: "/user"
});

export const tokenHeaderRequest = axios.create({
    headers: tokenHeader()
});

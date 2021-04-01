import axios from 'axios';

/**
 * db_api request
 */
export const dbApi = axios.create({
    //TODO
    baseURL: "",
})

export const userRoute = axios.create({
    baseURL: "/user"
})
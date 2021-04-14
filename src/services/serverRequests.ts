import axios from 'axios';
import { DB_API_URL } from '../utils/secrets';

/**
 * db_api request
 */
export const dbApiRequest = axios.create({
    baseURL: DB_API_URL
});
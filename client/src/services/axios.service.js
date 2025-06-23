import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials:true,
})

export const axiosService = {
    get: async (url, config = {}) => {
        try {
            const response = await axiosInstance.get(url, config);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    post: async (url, data, config = {}) => {
        try {
            const response = await axiosInstance.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    put: async (url, data, config = {}) => {
        try {
            const response = await axiosInstance.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    delete: async (url, config = {}) => {
        try {
            const response = await axiosInstance.delete(url, config);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};
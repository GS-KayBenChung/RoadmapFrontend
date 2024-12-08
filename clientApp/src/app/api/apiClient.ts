import axios, { AxiosResponse } from 'axios';
import { Roadmap } from '../models/roadmap';
import API_URL from '../../config/apiConfig';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = API_URL.base;
// 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

// axios.interceptors.response.use(
//     async (response) => {
//         console.log('API Response:', response.data); 
//         return response;
//     },
//     async (error) => {
//         console.error('API Error:', error.response?.data); 
//         return Promise.reject(error);
//     }
// );

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Roadmaps = {
    list: () => requests.get<Roadmap[]>('/roadmaps'),
    details:(id: string) => requests.get<Roadmap>(`/roadmaps/${id}`),
    create: (roadmap: Roadmap) => requests.post<void>('/roadmaps', roadmap),
    update: (roadmap: Roadmap) => requests.put<void>(`/roadmaps/${roadmap.roadmapId}`, roadmap),
    delete: (id: string) => requests.delete<void>(`/roadmaps/${id}`)
}

const apiClient = {
    Roadmaps
}

export default apiClient;
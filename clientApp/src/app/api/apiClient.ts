import axios, { AxiosResponse } from 'axios';
import { Roadmap } from '../models/roadmap';
import { AuditLogs } from '../models/auditLogs';
import API_URL from '../../config/apiConfig';
import { PaginatedAudit } from '../models/paginatedAudit';
import { PaginatedRoadmap } from '../models/paginatedRoadmap';
import { DashboardStats } from '../models/dashboardStats';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

axios.defaults.baseURL = API_URL.base;

axios.interceptors.response.use(async response => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    return await Promise.reject(error);
  }
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Roadmaps = {
  googleGet: (token: any) => requests.post<void>('/googlelogin', { token }),
  getDashboard: () => requests.get<DashboardStats>(`/roadmaps/dashboard`),  
  list: async (queryString: string) => requests.get<PaginatedRoadmap<Roadmap>>(`/roadmaps?${queryString}`),  
  details: (id: string) => requests.get<Roadmap>(`/roadmaps/details/${id}`),
  create: (roadmap: Roadmap) => requests.post<void>('/roadmaps', roadmap),
  update: (roadmap: Roadmap) => requests.put<void>(`/roadmaps/${roadmap.roadmapId}`, roadmap),
  delete: (id: string) => requests.delete<void>(`/roadmaps/${id}`),
  updateCheck: (body: { id: string, type: 'roadmap' | 'milestone' | 'section' | 'task', isChecked: boolean, index?: number, parentIndex?: number }) => 
    requests.put<void>(`/roadmaps/checkboxes/${body.id}`, body),
  getLogs: async (query: string) => requests.get<PaginatedAudit<AuditLogs>>(`/roadmaps/logs?${query}`),

}

const apiClient = {
  Roadmaps
}

export default apiClient;
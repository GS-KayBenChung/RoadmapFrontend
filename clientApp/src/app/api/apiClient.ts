import axios, { AxiosResponse } from 'axios';
import { Roadmap } from '../models/roadmap';
import { AuditLogs } from '../models/auditLogs';
import { PaginatedAudit } from '../models/paginatedAudit';
import { PaginatedRoadmap } from '../models/paginatedRoadmap';
import { DashboardStats } from '../models/dashboardStats';
import { toast } from 'react-toastify';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;

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
  patch: <T>(url: string, body: {}) => axios.patch<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Roadmaps = {
  updateRoadmap: async (roadmapId: string, roadmapData: Partial<Roadmap>) => {
    try {
      console.log("Testing updateRoadmap", roadmapId, roadmapData);
      
      const response = await requests.patch<void>(`/roadmaps/${roadmapId}`, roadmapData);
      return response;
    } catch (error) {
      toast.error("Error editing roadmap:");
      throw error;
    }
  },
  getDashboard: () => requests.get<DashboardStats>(`/roadmaps/dashboard`),  
  list: async (queryString: string) => requests.get<PaginatedRoadmap<Roadmap>>(`/roadmaps?${queryString}`),  
  details: (id: string) => requests.get<Roadmap>(`/roadmaps/details/${id}`),
  create: (roadmap: Roadmap) => requests.post<void>('/roadmaps', roadmap),
  update: (roadmap: any) => requests.put<void>(`/roadmaps/${roadmap.roadmapId}`, roadmap),
  delete: (id: string) => requests.delete<void>(`/roadmaps/${id}`),
  // updateCheck: (body: { id: string, type: 'roadmap' | 'milestone' | 'section' | 'task', isChecked: boolean, index?: string, parentIndex?: string }) => 
  //   requests.put<void>(`/roadmaps/checkboxes/${body.id}`, body),
  updateCheck: (body: { id: string, type: 'roadmap' | 'milestone' | 'section' | 'task', isChecked: boolean }) =>
    requests.put<void>(`/roadmaps/checkboxes/${body.id}`, body),
  getLogs: async (query: string) => requests.get<PaginatedAudit<AuditLogs>>(`/roadmaps/logs?${query}`),
  googleLogin: (token: string) => requests.post<{ id: string; username: string; email: string; token: string; createdAt: string }>(
    `/authentication/googleresponse`,
    { credential: token }
  ),
}

const apiClient = {
  Roadmaps
}

export default apiClient;
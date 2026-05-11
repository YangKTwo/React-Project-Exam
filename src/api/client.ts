import axios, { type AxiosResponse } from "axios";
import {isAuthWhitelistUrl} from "../constants/auth";
import { type ApiResult, isApiSuccess } from '../types/result'
import { clearAccessToken, getAccessToken } from '../utils/token'

function resolveBaseUrl(): string {
    const v = import.meta.env.VITE_API_BASE_URL;
    if (v == null || v == '') return '';
    return String(v).replace(/\/$/, '');
}

export const http = axios.create({
    baseURL: resolveBaseUrl(),
    timeout: 30_000,
})

http.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

http.interceptors.response.use(
    (response: AxiosResponse) => {
        const body = response.data as ApiResult<unknown>
        if (body && typeof body === 'object' && 'code' in body) {
            if (!isApiSuccess(body)) {
                return Promise.reject(new Error(body.msg || '请求失败'))
            }
        }
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            const url = String(error.config?.url ?? '')
            if (!isAuthWhitelistUrl(url)) {
                clearAccessToken()
                const next = `${window.location.pathname}${window.location.search}${window.location.hash}`
                const login = `/login?redirect=${encodeURIComponent(next)}`
                if (window.location.pathname !== '/login') {
                    window.location.assign(login)
                }
            }
    }
    return Promise.reject(error)
},
)

export function takeData<T>(res: AxiosResponse<ApiResult<T>>):T {
    return res.data.data;
}
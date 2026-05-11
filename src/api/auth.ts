import type { ApiResult } from "../types/result";
import type { UserInfo, LoginPayload } from "../types/user";
import { http, takeData } from "./client";

export function login(payload: LoginPayload) {
    return http.post<ApiResult<UserInfo>>('/api/user/login',payload)
    .then((res)=> takeData(res))
}
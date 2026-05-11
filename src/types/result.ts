export const API_SUCCESS_CODE = 200;

export type ApiResult<T> = {
    code: number;
    msg: string;
    data: T;
    success: boolean;
}

export function isApiSuccess<T>(r:ApiResult<T>):boolean {
    return r.code == API_SUCCESS_CODE;
}
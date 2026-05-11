import { AUTH_TOKEN_KEY } from "../constants/auth";

export function getAccessToken():string|null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAccessToken(token:string):void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}
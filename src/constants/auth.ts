export const AUTH_TOKEN_KEY = 'exam_auth_token';
/** 401 时不要整页跳登录（避免登录失败死循环） */
export function isAuthWhitelistUrl(url:string):boolean {
    const path = url.replace(/^https?:\/\/[^/]+/, '')
    return (
        path.includes('/api/user/login') ||
        path.includes('/api/user/register')
    )
}
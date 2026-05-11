export type LoginPayload = {
    loginType: 'username' | 'student_no'
    loginValue: string
    password: string
    roleType: 'student' | 'teacher' | 'admin'
}

export type UserInfo = {
    userId: number
    username?: string
    token?: string
    roleType?: string
}
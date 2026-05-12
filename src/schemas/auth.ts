import { z } from "zod";

export const loginSchema = z.object({
    loginType: z.enum(['username', 'student_no']),
    loginValue: z.string()
    .min(2, { message: '账号长度不能小于2个字符' })
    .max(20, { message: '账号长度不能超过20个字符' }),
    password: z.string()
    .min(6, { message: '密码长度不能小于6个字符' })
    .max(20, { message: '密码长度不能超过20个字符' }),
    roleType: z.enum(['student', 'teacher', 'admin']),
})

export  type LoginSchema = z.infer<typeof loginSchema>
import { Button, Card, Form, Input, Select, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../api/auth'
import type { LoginPayload } from '../types/user'
import { setAccessToken } from '../utils/token'

const defaultValues: LoginPayload = {
  loginType: 'username',
  loginValue: '',
  password: '',
  roleType: 'student',
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { control, handleSubmit } = useForm<LoginPayload>({ defaultValues })

  const onSubmit = handleSubmit(async (values) => {
    const user = await login(values)
    if (user.token) setAccessToken(user.token)
    const redirect = searchParams.get('redirect')
    navigate(redirect || '/', { replace: true })
  })

  return (
    <div style={{ minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          登录
        </Typography.Title>
        <Form layout="vertical" onFinish={() => void onSubmit()}>
          <Form.Item label="登录方式">
            <Controller
              name="loginType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: '用户名', value: 'username' },
                    { label: '学号', value: 'student_no' },
                  ]}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="账号">
            
            <Controller
              name="loginValue"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  status={fieldState.error ? 'error' : undefined}
                />
              )}
            />
          </Form.Item>
          <Form.Item label="密码">
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>
          <Form.Item label="角色">
            <Controller
              name="roleType"
              control={control}
              rules={{required: true}}
              render={({field}) => (
                <Select
                  {...field}
                  placeholder="请选择角色"
                  options={[
                    {label: '学生', value: 'student'},
                    {label: '教师', value: 'teacher'},
                    {label: '管理员', value: 'admin'},
                  ]}
                />
              )}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}

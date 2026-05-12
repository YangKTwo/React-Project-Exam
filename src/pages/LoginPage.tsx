import { Button, Card, Form, Input, message, Select, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../api/auth";
import type { LoginPayload } from "../types/user";
import { setAccessToken } from "../utils/token";
import { loginSchema, type LoginSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const defaultValues: LoginPayload = {
  loginType: "username",
  loginValue: "",
  password: "",
  roleType: "student",
};

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }, // 获取错误和提交状态
  } = useForm<LoginSchema>({
    defaultValues,
    resolver: zodResolver(loginSchema), // 关键：Zod 验证
    mode: "onBlur", // 失去焦点时验证，可选 'onChange' | 'onSubmit'
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await login(values);
      if (user.token) {
        setAccessToken(user.token);
        message.success("登录成功");
        const redirect = searchParams.get("redirect");
        navigate(redirect || "/", { replace: true });
      }
    } catch (error) {
      message.error("登录失败，请检查账号密码");
    }
  });

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Card style={{ width: "100%", maxWidth: 400 }}>
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
                    { label: "用户名", value: "username" },
                    { label: "学号", value: "student_no" },
                  ]}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="账号"
            validateStatus={errors.loginValue ? "error" : ""}
            help={errors.loginValue?.message}
          >
            <Controller
              name="loginValue"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入账号"
                  status={errors.loginValue ? "error" : undefined}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="密码"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="请输入密码（6-20位）"
                  status={errors.password ? "error" : undefined}
                />
              )}
            />
          </Form.Item>
          <Form.Item label="角色">
            <Controller
              name="roleType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="请选择角色"
                  options={[
                    { label: "学生", value: "student" },
                    { label: "教师", value: "teacher" },
                    { label: "管理员", value: "admin" },
                  ]}
                />
              )}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}

# React 前端项目开发流程（对接现有后端）

本文档面向：**已有 Spring Cloud Gateway（默认 `http://localhost:8080`）+ JWT 鉴权** 的后端，从零搭建 **Vite + React + TypeScript** 前端，并列出推荐依赖与分阶段开发任务。

### 技术选型（已定）

| 层级 | 选择 | 说明 |
|------|------|------|
| 框架 | **React**（Vite + TypeScript） | 与现有文档一致 |
| UI 组件库 | **[Ant Design](https://ant.design)**（`antd`） | 与 Vue 侧 Element Plus 同属「全家桶型」后台组件，表格/表单/布局上手快 |
| 样式补充 | **Tailwind CSS**（按需） | 初期可仅用 antd；遇到布局微调、营销页、自定义区块时再接入，与 antd 并存时用 `className` 补间距与排版即可 |
| 表单 | **先 [React Hook Form](https://react-hook-form.com)**，**后续再引入 [Zod](https://zod.dev)** | 第一阶段用 RHF + antd `Controller` 熟练表单；第二阶段再加 Zod + `@hookform/resolvers` 做规则统一与运行时校验 |

---

## 一、环境与前置条件

| 项 | 说明 |
|----|------|
| Node.js | 建议 **LTS（如 20.x）**，与包管理器 `npm` / `pnpm` / `yarn` 任选其一 |
| 后端 | 网关可用（本仓库 `online-exam-sys2.0` 启动后通常访问 **8080**） |
| 浏览器 | 现代 Chromium / Firefox / Edge（开发阶段即可） |

开发前确认：`POST /api/user/login` 能返回 token，且带 `Authorization: Bearer <token>` 的请求能访问需登录接口。

---

## 二、项目创建步骤

### 1. 使用 Vite 创建 React + TypeScript 项目

在项目根目录（例如 `d:\ReactLearning`）执行：

```bash
npm create vite@latest exam-web -- --template react-ts
cd exam-web
npm install
```

> 目录名 `exam-web` 可替换；`react-ts` 模板自带 TS 与基础 ESLint。

### 2. 首次启动验证

```bash
npm run dev
```

浏览器打开终端提示的本地地址，确认默认页面可访问。

### 3. 建议的目录约定（可在搭建过程中逐步落地）

```
exam-web/
├── public/
├── src/
│   ├── api/           # 封装 HTTP：axios 实例、各模块 API
│   ├── components/    # 通用 UI 组件
│   ├── hooks/         # 自定义 Hooks
│   ├── layouts/       # 布局（带导航、侧边栏等）
│   ├── pages/         # 路由页面
│   ├── router/        # 路由表与守卫（可选单独文件）
│   ├── stores/        # 全局客户端状态（如 Zustand）
│   ├── types/         # TypeScript 类型（与后端 DTO 对齐）
│   ├── utils/         # 工具函数（token、日期等）
│   ├── App.tsx
│   └── main.tsx
├── .env.development   # 本地环境变量（勿提交密钥）
├── .env.production
└── vite.config.ts
```

---

## 三、推荐安装的核心依赖

在 `exam-web` 目录下执行（以下为 **npm** 示例；若用 `pnpm`，把 `npm install` 换成 `pnpm add` 即可）。

### 1. 路由

```bash
npm install react-router-dom
```

### 2. UI 组件库 — Ant Design

```bash
npm install antd
```

入口或根组件外用 **`ConfigProvider`** 统一主题/语言（中文界面示例：`import zhCN from 'antd/locale/zh_CN'` 传入 `locale={zhCN}`）。样式由 antd 5 内置方案处理，无需再引入全局 Less（除非你刻意自定义主题变量）。

### 3. HTTP 客户端

```bash
npm install axios
```

### 4. 服务端状态（列表、详情、缓存、重试）

```bash
npm install @tanstack/react-query
```

### 5. 客户端全局状态（对标 Pinia：登录态、UI 偏好等）

```bash
npm install zustand
```

### 6. 表单 — 第一阶段：仅 React Hook Form

先安装并练习 **与 antd 表单控件的结合**（官方推荐用 **`Controller`** 包裹 `Input`、`Select`、`DatePicker` 等）。

```bash
npm install react-hook-form
```

参考：在 [Ant Design 文档](https://ant.design) 中检索 **React Hook Form** / **Form**，查看与 `Controller` 结合的示例（路径随版本可能调整，以官网为准）。

### 7. 表单校验 — 第二阶段：再引入 Zod（后续）

需要「一套规则多处复用」、或与 TS 类型强绑定时再安装：

```bash
npm install zod @hookform/resolvers
```

通过 `zodResolver` 与 RHF 对接；**第一阶段不必安装**，避免一开始就叠栈。

### 8. Tailwind CSS（按需再加）

antd 已能满足大部分页面；当你需要快速写布局、间距、响应式栅格外的微调时，再初始化 Tailwind（版本以官网为准），例如在项目根目录：

```bash
npm install -D tailwindcss @tailwindcss/vite
```

并在 `vite.config.ts` 中接入 Tailwind 官方文档对应的 **Vite 插件**配置。**注意**：与 antd 同时使用时，优先用 antd 组件表达交互；Tailwind 适合补充外层布局与细粒度样式，减少两套体系「抢同一个控件样式」的情况。

### 9. 开发体验（可选）

```bash
npm install -D prettier
```

团队统一代码风格时，可再加 ESLint 与 Prettier 集成（Vite 模板已含 ESLint 时可只补 Prettier）。

---

## 四、环境与跨域（对接网关）

### 1. 环境变量

在项目根目录新建 `.env.development`（勿把真实密钥写入仓库）：

```env
VITE_API_BASE_URL=http://localhost:8080
```

在代码中通过 `import.meta.env.VITE_API_BASE_URL` 读取。

### 2. Vite 开发代理（推荐）

在 `vite.config.ts` 中配置 `server.proxy`，把 `/api` 代理到网关，减少浏览器端 CORS 麻烦：

```ts
// 示例片段，按实际端口调整
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```

开发阶段 axios 的 `baseURL` 可设为 `''` 或 `'/'`，请求路径以 `/api/...` 开头即可走代理。

---

## 五、VS Code 推荐插件

| 插件 | 作用 |
|------|------|
| **ES7+ React/Redux/React-Native snippets** | 快速生成组件、Hooks 片段 |
| **ESLint** | 与项目 ESLint 配置一致时提示问题 |
| **Prettier**（若启用） | 保存时格式化 |
| **Tailwind CSS IntelliSense**（接入 Tailwind 后） | 类名提示 |

可选：**Ant Design Snippets** 类插件（若习惯片段生成），非必须。

---

## 六、与后端契约要点（实现时对照）

1. **鉴权头**：`Authorization: Bearer <access_token>`（网关要求 Bearer 前缀）。
2. **统一响应**：后端多为 `Result<T>`：`{ code, msg, data, success }`，成功常见 `code === 200`。
3. **白名单接口**（无 token）：如 `/api/user/login`、`/api/user/register` 等；其余业务接口需带 token。
4. **学生端接口示例**（需学生角色）：`/api/exam/student/list`、`/api/exam-attempt/start` 等，具体以网关路由与 Swagger 为准。

axios 响应拦截器里可统一：HTTP 401 → 清理 token → 跳转登录页。

---

## 七、后续开发任务（分阶段）

按依赖顺序推进，每阶段完成后可演示一条完整路径。

### 阶段 A：工程骨架

- [ ] 引入 **Ant Design**：根组件使用 `ConfigProvider`（按需中文 `locale`）。
- [ ] 配置 `axios` 实例：`baseURL`、请求拦截器（附加 Bearer）、响应拦截器（解析 `Result`、处理 401）。
- [ ] 配置 **React Query** 的 `QueryClientProvider`（在 `main.tsx` 包裹应用）。
- [ ] 配置 **React Router**：`BrowserRouter`、顶层 `Routes`。
- [ ] 定义 **类型**：登录响应、`Result<T>` 泛型包装、用户简要信息。
- [ ] （按需）接入 **Tailwind**：安装依赖并按官方文档配置 Vite 插件后再写工具类。

### 阶段 B：认证与路由守卫

- [ ] **登录页**：使用 **React Hook Form + antd 控件（Controller）** 提交 `POST /api/user/login`，保存 token（建议 `memory` + `localStorage` 策略二选一，注意安全边界）。
- [ ] **受保护路由**：未登录访问业务页时重定向到 `/login`；已登录访问登录页可重定向到首页。
- [ ] （可选）**注册页**、退出登录。

### 阶段 C：学生端核心链路（MVP）

- [ ] **考试列表**：`GET /api/exam/student/list`（TanStack Query）。
- [ ] **考试详情**：`GET /api/exam/student/detail/:examId`。
- [ ] **权限检查**：`GET /api/exam/student/check/:examId`（若后端要求）。
- [ ] **开始考试**：`POST /api/exam-attempt/start?examId=`，保存返回的 `attemptId`、题目结构等到页面状态或 store。
- [ ] **答题页**：根据题型渲染组件（单选/多选/判断/主观等）；主观题注意换行与草稿。
- [ ] **保存答案**：按后端约定调用 `/api/exam/answers/save` 等（注意 `userId`、`attemptId`、`questionId` 与当前登录用户一致）。
- [ ] **交卷**：`POST /api/exam-attempt/{attemptId}/submit`；处理禁用重复提交、加载态。
- [ ] **结果页**：对接 `/api/exam-attempt/...` 或报告相关接口（以 Swagger 为准）。

### 阶段 D：体验与健壮性

- [ ] 全局 **Loading / Toast**（请求中、成功、失败提示）。
- [ ] 错误边界：接口失败时的空状态与重试。
- [ ] 考试倒计时、切屏/超时策略（若后端有自动交卷，与前端的 `auto-submit` 约定对齐）。
- [ ] （可选）**React Query** 的 `staleTime`、`retry`、列表分页参数与后端一致。

### 阶段 E：扩展（按需）

- [ ] 教师端：试卷、班级、阅卷等（权限与路由分区 `/teacher/...`）。
- [ ] 管理端或题目库浏览（注意网关白名单与鉴权差异）。
- [ ] **AI 助手** `/api/assistant/**`、`/api/ai/**` 对话 UI 与流式响应（若后端为 SSE/WebSocket，再单独选型）。
- [ ] 构建与部署：`npm run build`，静态资源部署到 Nginx；生产环境 `VITE_API_BASE_URL` 指向正式网关域名。

---

## 八、常用命令备忘

| 命令 | 作用 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 生产构建 |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` | 代码检查（若 package.json 已配置） |

---

## 九、学习与实践原则（与本仓库 LEARNING_PLAN 一致）

1. **先打通一条业务闭环**（登录 → 列表 → 开考 → 答题 → 交卷），再堆功能。
2. **延伸能力**：防抖搜索、自定义 Hook、**Zod + zodResolver**、乐观更新等放在闭环之后。
3. **权威参考**：[React 官方文档](https://react.dev)；接口以网关 + Swagger 为准。

---

*文档版本：与当前仓库后端 `online-exam-sys2.0` 网关路径约定一致；若后端路由变更，请同步修改「环境与契约」章节。* **UI：React + Ant Design；样式补充按需 Tailwind；表单先 RHF，后 Zod。**

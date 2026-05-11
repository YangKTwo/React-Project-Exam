import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { getSidebarMenuTokens } from './layouts/them/layoutSidebar'
import { LoginPage } from './pages/LoginPage'
import { MainLayout } from './layouts/MainLayout'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Menu: getSidebarMenuTokens(),
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
           {/* 父路由：鉴权 + 外壳；子路由在 MainLayout 的 <Outlet /> 里渲染 */}
  <Route
    element={
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    }
  >
    {/* 对应地址 / */}
    <Route index element={<div>首页</div>} />
    {/* 对应地址 /exam */}
    <Route path="exam" element={<div>考试页</div>} />
  </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

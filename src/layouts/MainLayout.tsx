import {
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Typography } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logoUrl from "../assets/icons/logo.svg";
import { layoutSidebar } from "./them/layoutSidebar";
import { clearAccessToken } from "../utils/token";
import { useUIStore } from "../stores";

const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "首页" },
  { key: "/exam", icon: <FileTextOutlined />, label: "考试" },
  { key: "/question", icon: <ProfileOutlined />, label: "题目列表" },
];

export function MainLayout() {
  const navigate = useNavigate(); // 菜单点击时做路由跳转
  const { pathname } = useLocation(); // 当前路径，用来算「哪个菜单该高亮」
  // antd 主题变量：背景色、圆角等，和 ConfigProvider 一致
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // 选中菜单：首页精确匹配 '/'；其它项用 startsWith，便于以后 /exam/123 仍高亮「考试」
  const selectedKeys = [
    menuItems.find((item) =>
      item.key === "/" ? pathname === "/" : pathname.startsWith(item.key),
    )?.key ?? "/",
  ];

  // const [collapsed, setCollapsed] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    clearAccessToken();
    navigate("/login", { replace: true });
  };
  return (
    // 整页固定高度，不滚动，内部区域自行处理滚动
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        breakpoint="lg"
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        collapsedWidth={0}
        trigger={null}
        theme={layoutSidebar.theme}
        style={{
          height: "100vh",
          overflow: "hidden",
          background: layoutSidebar.background,
        }}
        width={230}
      >
        <Link
          to="/"
          title="首页"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 16px 12px",
            lineHeight: 0,
          }}
        >
          <img
            src={logoUrl}
            alt="Assessment System"
            style={{
              display: "block",
              maxWidth: "100%",
              height: "auto",
              maxHeight: 56,
            }}
          />
        </Link>

        <Menu
          theme={layoutSidebar.theme}
          mode="inline"
          style={{ background: layoutSidebar.background }}
          selectedKeys={selectedKeys} // 受控选中，随 URL 变
          items={menuItems}
          onClick={({ key }) => navigate(key)} // 与 React Router 联动
        />
      </Sider>

      <Layout style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Header
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            minHeight: 64,
            background: layoutSidebar.headerBackground,
          }}
        >
          <Button
            type="text"
            aria-label={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
            icon={
              sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={toggleSidebar}
            style={{ zIndex: 1 }}
          />
          <Typography.Title
            level={4}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              margin: 0,
              pointerEvents: "none",
            }}
          >
            Assessment System
          </Typography.Title>
          <div style={{ marginLeft: "auto", zIndex: 1 }}>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: layoutSidebar.contentBackground,
          }}
        >
          <div
            style={{
              padding: 24,
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              background: layoutSidebar.contentInnerBackground,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 子路由页面渲染位置，需在 App.tsx 里配嵌套路由 */}
            <Outlet />
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center', minHeight: 64 }}>
          ©{new Date().getFullYear()} 在线考试
        </Footer> */}
      </Layout>
    </Layout>
  );
}

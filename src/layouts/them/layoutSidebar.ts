/**
 * 后台布局外壳配色（侧栏、顶栏、主内容区、菜单高亮等）。
 * 修改此处即可集中替换，无需在组件内散落魔法字符串。
 */
export const layoutSidebar = {
  /** antd `Layout.Sider` / `Menu` 的 theme，两处须一致 */
  theme: "light" as "light" | "dark",
  /**
   * 同时作用于 Sider 与 Menu，避免两块区域默认 token 不一致产生色差。
   * 深色示例：theme 改为 `'dark'`，background 可设为 `'#001529'`（可按设计微调）。
   */
  background: "#FFFAF0",

  /** 右侧区域顶部 `Header` 背景色（与侧栏、内容区可统一或区分） */
  headerBackground: "rgba(149, 36, 194, 0.13)",

  /** 主内容区外层 `<Content>` 背景（滚动区域底色） */
  contentBackground: "#f5f5f5",
  /** `<Outlet>` 外层卡片背景（带 padding / 圆角的内层块） */
  contentInnerBackground: "rgba(90, 112, 39, 0.1)",

  /**
   * 浅色菜单（theme="light"）选中 / 悬停，对应 antd Menu 组件 Design Token。
   * 文档：https://ant.design/components/menu-cn#design-token
   */
  menuLight: {
    itemSelectedBg: "rgba(12, 91, 156, 0.14)",
    itemSelectedColor: "#1677ff",
    itemHoverBg: "#f5f5f5",
    itemActiveBg: "#d4c4b0",
  },

  /**
   * 深色菜单（theme="dark"）选中 / 悬停；仅在 layoutSidebar.theme === 'dark' 时通过 getSidebarMenuTokens 生效。
   */
  menuDark: {
    darkItemSelectedBg: "#1677ff",
    darkItemSelectedColor: "#ffffff",
    darkItemHoverBg: "rgba(255,255,255,0.08)",
  },
};

/** 供 App.tsx `ConfigProvider` → `theme.components.Menu` 使用 */
export function getSidebarMenuTokens() {
  return layoutSidebar.theme === "dark"
    ? layoutSidebar.menuDark
    : layoutSidebar.menuLight;
}

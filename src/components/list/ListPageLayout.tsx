import type { ReactNode } from "react";

export type ListPageLayoutProps = {
  /** 顶部筛选区（一般为 QueryArea） */
  filters: ReactNode;
  /** 表格区域 */
  table: ReactNode;
};

/**
 * 列表页统一外壳：上筛选、下表格占满剩余高度，与试题/考试列表一致。
 */
export function ListPageLayout({ filters, table }: ListPageLayoutProps) {
  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flexShrink: 0 }}>{filters}</div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>{table}</div>
    </div>
  );
}

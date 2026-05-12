import { Typography } from "antd";

export function ExamPage() {
  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        AppTable 使用演示
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        import AppTable，写法与 antd 的 Table
        相同；本组件只统一套了表体横向滚动条的样式，其它
        pagination、loading、onChange 等照常传入。
      </Typography.Paragraph>
    </>
  );
}

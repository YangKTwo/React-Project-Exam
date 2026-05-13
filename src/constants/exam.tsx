import { Tag, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import type { QueryField } from "../components/filterForm/QueryArea";
import type { StudentExamListItem } from "../types/exam";

export const examQueryFields: QueryField[] = [
  {
    name: "keyword",
    label: "关键词",
    type: "input",
    placeholder: "考试标题（依后端是否支持 keyword）",
    width: 220,
  },
];

export const examColumns: TableColumnsType<StudentExamListItem> = [
  { title: "考试 ID", dataIndex: "examId", width: 88 },
  {
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
    width: 200,
  },
  {
    title: "学科",
    dataIndex: "subjectName",
    width: 96,
  },
  {
    title: "时间",
    dataIndex: "timeRangeText",
    ellipsis: true,
    width: 260,
  },
  {
    title: "时长",
    dataIndex: "durationText",
    width: 120,
  },
  {
    title: "状态",
    dataIndex: "statusText",
    width: 100,
    render: (text: string, row) => (
      <Tag color={row.status === "ENDED" ? "default" : "processing"}>
        {text}
      </Tag>
    ),
  },
  {
    title: "最高分",
    dataIndex: "bestScore",
    width: 80,
  },
  {
    title: "及格",
    dataIndex: "isPassed",
    width: 72,
    render: (v: boolean) => (
      <Tag color={v ? "success" : "default"}>{v ? "是" : "否"}</Tag>
    ),
  },
  {
    title: "最近作答",
    dataIndex: "latestAttemptStatusText",
    width: 100,
    render: (t: string | null) => t ?? "—",
  },
  {
    title: "可否参加",
    dataIndex: "canTake",
    width: 88,
    render: (v: boolean, row) =>
      v ? (
        <Tag color="green">可参加</Tag>
      ) : (
        <Tooltip title={row.cannotTakeReason ?? ""}>
          <Tag>不可</Tag>
        </Tooltip>
      ),
  },
  {
    title: "操作",
    key: "action",
    width: 100,
    fixed: "right",
    render: (_, row) =>
      row.canTake ? (
        <a onClick={() => console.log("开考/详情", row.examId)}>进入</a>
      ) : (
        <span style={{ color: "var(--ant-color-text-tertiary)" }}>—</span>
      ),
  },
];

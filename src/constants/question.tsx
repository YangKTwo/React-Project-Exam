import { Tag } from "antd";
import type { TableColumnsType } from "antd";
import type { QueryField } from "../components/filterForm/QueryArea";
import type { Question } from "../types/question";

export const typeMap: Record<string, string> = {
  SINGLE_CHOICE: "单选题",
  MULTIPLE_CHOICE: "多选题",
  TRUE_FALSE: "判断题",
  FILL_IN_BLANK: "填空题",
  SHORT_ANSWER: "简答题",
  PROGRAMMING: "编程题",
};

export const difficultyMap: Record<string, { color: string; text: string }> = {
  EASY: { color: "green", text: "简单" },
  MEDIUM: { color: "orange", text: "中等" },
  HARD: { color: "red", text: "困难" },
};

export const queryFields: QueryField[] = [
  {
    name: "keyword",
    label: "关键词",
    type: "input",
    placeholder: "题目内容",
    width: 250,
  },
  {
    name: "type",
    label: "题型",
    type: "select",
    options: [
      { label: "单选题", value: "SINGLE_CHOICE" },
      { label: "多选题", value: "MULTIPLE_CHOICE" },
      { label: "判断题", value: "TRUE_FALSE" },
      { label: "填空题", value: "FILL_IN_BLANK" },
      { label: "简答题", value: "SHORT_ANSWER" },
      { label: "编程题", value: "PROGRAMMING" },
    ],
    width: 150,
  },
  {
    name: "difficulty",
    label: "难度",
    type: "select",
    options: [
      { label: "简单", value: "EASY" },
      { label: "中等", value: "MEDIUM" },
      { label: "困难", value: "HARD" },
    ],
    width: 120,
  },
];

export const questionColumns: TableColumnsType<Question> = [
  { title: "ID", dataIndex: "id", width: 60 },
  {
    title: "题型",
    dataIndex: "type",
    width: 100,
    render: (type) => typeMap[type] || type,
  },
  {
    title: "难度",
    dataIndex: "difficulty",
    width: 80,
    render: (d) => {
      const { color, text } = difficultyMap[d] || { color: "default", text: d };
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "题目内容",
    dataIndex: "content",
    ellipsis: true,
  },
  {
    title: "选项数",
    width: 80,
    render: (_, record) => record.options?.length || 0,
  },
  {
    title: "标签",
    dataIndex: "tags",
    width: 150,
    render: (tags: string[]) => (
      <>
        {tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </>
    ),
  },
  {
    title: "创建人",
    dataIndex: "creatorName",
    width: 100,
  },
  {
    title: "使用次数",
    dataIndex: "usageCount",
    width: 90,
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    width: 170,
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    fixed: "right",
    render: (_, record) => (
      <a onClick={() => console.log("查看", record.id)}>查看</a>
    ),
  },
];

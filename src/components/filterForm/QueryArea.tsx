import { Button, DatePicker, Input, Select, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";

export type QueryFieldType = "input" | "select" | "date" | "dateRange";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface QueryField {
  name: string;
  label: string;
  type: QueryFieldType;
  placeholder?: string;
  options?: SelectOption[];
  width?: number | string;
  allowClear?: boolean;
}

interface QueryAreaProps<T extends Record<string, unknown>> {
  fields: QueryField[];
  value: T;
  onChange: (value: T) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}

export function QueryArea<T extends Record<string, unknown>>({
  fields,
  value,
  onChange,
  onSearch,
  onReset,
  loading,
}: QueryAreaProps<T>) {
  const renderField = (field: QueryField) => {
    const val = value[field.name];
    const width = field.width || 200;

    switch (field.type) {
      case "input":
        return (
          <Input
            key={field.name}
            placeholder={field.placeholder || `请输入${field.label}`}
            value={val as string}
            onChange={(e) =>
              onChange({ ...value, [field.name]: e.target.value })
            }
            onPressEnter={onSearch}
            style={{ width }}
            allowClear={field.allowClear !== false}
          />
        );
      case "select":
        return (
          <Select
            key={field.name}
            placeholder={field.placeholder || `请选择${field.label}`}
            value={val as string | number}
            onChange={(v) => onChange({ ...value, [field.name]: v })}
            options={field.options || []}
            style={{ width }}
            allowClear={field.allowClear !== false}
          />
        );
      case "date":
        return (
          <DatePicker
            key={field.name}
            placeholder={field.placeholder || `选择${field.label}`}
            value={val as Dayjs}
            onChange={(d) => onChange({ ...value, [field.name]: d })}
            style={{ width }}
            allowClear={field.allowClear !== false}
          />
        );
      case "dateRange":
        return (
          <DatePicker.RangePicker
            key={field.name}
            placeholder={
              field.placeholder
                ? (field.placeholder.split(",") as [string, string])
                : ["开始日期", "结束日期"]
            }
            value={val as [Dayjs, Dayjs]}
            onChange={(d) => onChange({ ...value, [field.name]: d })}
            style={{ width }}
            allowClear={field.allowClear !== false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: 16,
      }}
    >
      <Space align="start" wrap>
        {fields.map(renderField)}
        <Button
          type="primary"
          icon={<SearchOutlined />}
          loading={loading}
          onClick={onSearch}
        >
          查询
        </Button>
        <Button icon={<ReloadOutlined />} onClick={onReset}>
          重置
        </Button>
      </Space>
    </div>
  );
}

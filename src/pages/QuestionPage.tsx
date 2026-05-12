import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { AppTable } from "../components/table/AppTable.tsx";
import { QueryArea } from "../components/filterForm/QueryArea.tsx";
import { getQuestionList } from "../api/question";
import type { Question } from "../types/question";
import type { PageResult } from "../types/common";
import { queryFields, questionColumns } from "../constants/question.tsx";

interface QuestionQuery {
  keyword?: string;
  type?: string;
  difficulty?: string;
  [key: string]: unknown;
}

export function QuestionPage() {
  const [query, setQuery] = useState<QuestionQuery>({});
  const [data, setData] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);

  /** 始终指向最新 query，分页回调里用，避免 pagination.onChange 依赖 query 导致每打字都换引用 */
  const queryRef = useRef(query);
  queryRef.current = query;

  /** useCallback：loadData 引用稳定，子组件/ useMemo 可安全依赖 */
  const loadData = useCallback(async (page: number, pageSize: number, q: QuestionQuery) => {
    setLoading(true);
    try {
      const res = await getQuestionList({
        current: page,
        size: pageSize,
        keyword: q.keyword,
        type: q.type,
        difficulty: q.difficulty,
      });
      setData((res as PageResult<Question>).records);
      setTotal((res as PageResult<Question>).total);
    } catch (error) {
      console.error(error);
      message.error("获取题目列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    setCurrent(1);
    void loadData(1, size, query);
  }, [loadData, size, query]);

  const handleReset = useCallback(() => {
    setQuery({});
    setCurrent(1);
    void loadData(1, size, {});
  }, [loadData, size]);

  /** 分页变化：用 ref 读最新 query，本函数可不依赖 query → 引用稳定 → 配合 memo 表格在「只改关键词」时不重渲染 */
  const handleTableChange = useCallback(
    (page: number, pageSize: number) => {
      setCurrent(page);
      setSize(pageSize);
      void loadData(page, pageSize, queryRef.current);
    },
    [loadData],
  );

  /** useMemo：scroll 配置对象只创建一次，避免每次父渲染都是新对象 */
  const tableScroll = useMemo(
    () => ({ x: "max-content" as const, y: 56 * 10 }),
    [],
  );

  /** useMemo：只有 current/size/total/分页回调变了才换新 pagination 对象 */
  const tablePagination = useMemo(
    () => ({
      current,
      pageSize: size,
      total,
      showSizeChanger: true as const,
      onChange: handleTableChange,
    }),
    [current, size, total, handleTableChange],
  );

  useEffect(() => {
    void loadData(1, 10, {});
  }, [loadData]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <QueryArea
        fields={queryFields}
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <AppTable<Question>
          rowKey="id"
          columns={questionColumns}
          dataSource={data}
          loading={loading}
          scroll={tableScroll}
          pagination={tablePagination}
        />
      </div>
    </div>
  );
}

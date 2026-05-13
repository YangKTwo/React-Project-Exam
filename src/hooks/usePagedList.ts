import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";

const ROW_HEIGHT_PX = 56;

export type PagedFetchResult<T> = {
  records: T[];
  total: number;
};

export type UsePagedListOptions<T, Q extends Record<string, unknown>> = {
  /** 拉一页数据；服务端分页、整表+本地 slice 都在此函数内完成 */
  fetchPage: (
    page: number,
    pageSize: number,
    query: Q,
  ) => Promise<PagedFetchResult<T>>;
  /** 首次进入与「重置」时恢复的查询条件（引用建议稳定，一般用空对象即可） */
  initialQuery?: Q;
  /** 首屏与重置后第一次请求的 pageSize，需与表格默认 pageSize 一致 */
  initialPageSize?: number;
  /** 表格 body 可视行数，scroll.y = 56 * 行数，与试题列表默认一致 */
  bodyVisibleRows?: number;
  /** 请求失败时的 message 文案 */
  errorMessage?: string;
  /** 为 true 时不自动首拉（需自行调 loadData） */
  skipInitialLoad?: boolean;
};

export function usePagedList<T, Q extends Record<string, unknown>>(
  options: UsePagedListOptions<T, Q>,
) {
  const {
    fetchPage,
    initialQuery,
    initialPageSize = 10,
    bodyVisibleRows = 10,
    errorMessage = "加载失败",
    skipInitialLoad = false,
  } = options;

  const defaultQueryRef = useRef<Q>(
    (initialQuery !== undefined ? initialQuery : ({} as Q)) as Q,
  );

  const [query, setQuery] = useState<Q>(() => defaultQueryRef.current);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(false);

  const queryRef = useRef(query);
  queryRef.current = query;

  const loadData = useCallback(
    async (page: number, pageSize: number, q: Q) => {
      setLoading(true);
      try {
        const { records, total: t } = await fetchPage(page, pageSize, q);
        setData(records);
        setTotal(t);
      } catch (error) {
        console.error(error);
        message.error(errorMessage);
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, errorMessage],
  );

  const handleSearch = useCallback(() => {
    setCurrent(1);
    void loadData(1, size, query);
  }, [loadData, size, query]);

  const handleReset = useCallback(() => {
    const q = defaultQueryRef.current;
    setQuery(q);
    setCurrent(1);
    void loadData(1, size, q);
  }, [loadData, size]);

  const handleTableChange = useCallback(
    (page: number, pageSize: number) => {
      setCurrent(page);
      setSize(pageSize);
      void loadData(page, pageSize, queryRef.current);
    },
    [loadData],
  );

  const tableScroll = useMemo(
    () => ({
      x: "max-content" as const,
      y: ROW_HEIGHT_PX * bodyVisibleRows,
    }),
    [bodyVisibleRows],
  );

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
    if (skipInitialLoad) return;
    void loadData(1, initialPageSize, defaultQueryRef.current);
  }, [loadData, initialPageSize, skipInitialLoad]);

  return {
    query,
    setQuery,
    data,
    total,
    current,
    size,
    loading,
    loadData,
    handleSearch,
    handleReset,
    handleTableChange,
    tableScroll,
    tablePagination,
  };
}

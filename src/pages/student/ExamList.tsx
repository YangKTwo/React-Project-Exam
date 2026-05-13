import { useCallback, useRef } from "react";
import { AppTable } from "../../components/table/AppTable.tsx";
import { QueryArea } from "../../components/filterForm/QueryArea.tsx";
import { ListPageLayout } from "../../components/list/ListPageLayout.tsx";
import { usePagedList } from "../../hooks/usePagedList.ts";
import { getStudentExamList } from "../../api/exam";
import type { StudentExamListItem } from "../../types/exam";
import { examColumns, examQueryFields } from "../../constants/exam.tsx";

interface ExamQuery extends Record<string, unknown> {
  keyword?: string;
}

function examQueryKey(q: ExamQuery): string {
  return JSON.stringify({ keyword: q.keyword ?? "" });
}

export function ExamList() {
  const listCacheRef = useRef<{ key: string; list: StudentExamListItem[] }>({
    key: "",
    list: [],
  });

  const fetchPage = useCallback(
    async (page: number, pageSize: number, q: ExamQuery) => {
      const key = examQueryKey(q);
      let list =
        listCacheRef.current.key === key ? listCacheRef.current.list : null;
      if (list == null) {
        const res = await getStudentExamList({
          keyword: q.keyword,
          current: page,
          size: pageSize,
        });
        list = Array.isArray(res) ? res : [];
        listCacheRef.current = { key, list };
      }
      const start = (page - 1) * pageSize;
      return {
        records: list.slice(start, start + pageSize),
        total: list.length,
      };
    },
    [],
  );

  const {
    query,
    setQuery,
    data,
    loading,
    handleSearch,
    handleReset,
    tableScroll,
    tablePagination,
  } = usePagedList<StudentExamListItem, ExamQuery>({
    fetchPage,
    errorMessage: "获取考试列表失败",
  });

  return (
    <ListPageLayout
      filters={
        <QueryArea<ExamQuery>
          fields={examQueryFields}
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
      }
      table={
        <AppTable<StudentExamListItem>
          rowKey="examId"
          columns={examColumns}
          dataSource={data}
          loading={loading}
          scroll={tableScroll}
          pagination={tablePagination}
        />
      }
    />
  );
}

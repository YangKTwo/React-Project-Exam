import { useCallback } from "react";
import { AppTable } from "../components/table/AppTable.tsx";
import { QueryArea } from "../components/filterForm/QueryArea.tsx";
import { ListPageLayout } from "../components/list/ListPageLayout.tsx";
import { usePagedList } from "../hooks/usePagedList.ts";
import { getQuestionList } from "../api/question";
import type { Question } from "../types/question";
import type { PageResult } from "../types/common";
import { queryFields, questionColumns } from "../constants/question.tsx";

interface QuestionQuery extends Record<string, unknown> {
  keyword?: string;
  type?: string;
  difficulty?: string;
}

export function QuestionPage() {
  const fetchPage = useCallback(
    async (page: number, pageSize: number, q: QuestionQuery) => {
      const res = await getQuestionList({
        current: page,
        size: pageSize,
        keyword: q.keyword,
        type: q.type,
        difficulty: q.difficulty,
      });
      const pr = res as PageResult<Question>;
      return { records: pr.records, total: pr.total };
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
  } = usePagedList<Question, QuestionQuery>({
    fetchPage,
    errorMessage: "获取题目列表失败",
  });

  return (
    <ListPageLayout
      filters={
        <QueryArea<QuestionQuery>
          fields={queryFields}
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
      }
      table={
        <AppTable<Question>
          rowKey="id"
          columns={questionColumns}
          dataSource={data}
          loading={loading}
          scroll={tableScroll}
          pagination={tablePagination}
        />
      }
    />
  );
}

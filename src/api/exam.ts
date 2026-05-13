import type { PageParams } from "../types/common";
import type { StudentExamListItem } from "../types/exam";
import { http, takeData } from "./client";

/** 后端 data 为数组；分页由前端 slice（若日后改为 PageResult，再调整此处与列表页） */
export async function getStudentExamList(params?: PageParams) {
  const res = await http.get("/api/exam/student/list", { params });
  return takeData<StudentExamListItem[]>(res);
}

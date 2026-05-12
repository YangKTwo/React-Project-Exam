import type { PageParams, PageResult } from "../types/common";
import type { Question } from "../types/question";
import { http, takeData } from "./client";

export async function getQuestionList(params: PageParams) {
    const res= await http.get('/api/questions/page', { params })
    return takeData<PageResult<Question>>(res)
}
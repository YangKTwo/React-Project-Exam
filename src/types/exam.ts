/** 学生端 GET /api/exam/student/list 返回的 data 数组元素 */
export interface StudentExamListItem {
  examId: number;
  title: string;
  description: string;
  paperId: number;
  paperName: string | null;
  paperDetailVO: unknown | null;
  subjectName: string;
  maxAttempts: number;
  startTime: string;
  endTime: string;
  duration: number;
  totalScore: number;
  passScore: number;
  status: string;
  statusText: string;
  currentAttempts: number;
  hasAttempted: boolean;
  latestAttemptStatus: string | null;
  latestAttemptStatusText: string | null;
  bestScore: number;
  isPassed: boolean;
  remainingTime: number;
  canTake: boolean;
  cannotTakeReason: string | null;
  timeRangeText: string;
  durationText: string;
  createdTime: string;
}

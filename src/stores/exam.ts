import { create } from "zustand"

// 考试进行中的全局状态
interface ExamState {
  currentExamId: number | null
  attemptId: number | null
  timeRemaining: number  // 剩余时间（秒）
  answers: Record<number, string>  // 题目ID -> 答案
  
  setCurrentExam: (examId: number, attemptId: number) => void
  setTimeRemaining: (seconds: number) => void
  saveAnswer: (questionId: number, answer: string) => void
  clearExam: () => void
}

export const useExamStore = create<ExamState>((set) => ({
  currentExamId: null,
  attemptId: null,
  timeRemaining: 0,
  answers: {},
  
  setCurrentExam: (examId, attemptId) =>
    set({ currentExamId: examId, attemptId }),
  setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),
  saveAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  clearExam: () =>
    set({
      currentExamId: null,
      attemptId: null,
      timeRemaining: 0,
      answers: {},
    }),
}))

export type QuestionType = 
  | 'SINGLE_CHOICE'    // 单选
  | 'MULTIPLE_CHOICE'  // 多选
  | 'TRUE_FALSE'       // 判断
  | 'FILL_IN_BLANK'    // 填空
  | 'SHORT_ANSWER'     // 简答
  | 'PROGRAMMING'      // 编程
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export interface Option {
  id: number
  questionId: number
  content: string
  isCorrect: boolean
}
export interface Question {
  id: number
  content: string           // 题目内容
  type: QuestionType        // 题型
  subjectId: number         // 学科ID
  difficulty: Difficulty    // 难度
  correctAnswer: string     // 正确答案（索引或true/false）
  correctAnswerDisplay: string  // 正确答案显示文本
  explanation: string | null    // 解析
  creator: number          // 创建人ID
  creatorName: string      // 创建人姓名
  creatorAvatar: string     // 创建人头像
  createdTime: string      // 创建时间
  updatedTime: string       // 更新时间
  usageCount: number       // 使用次数
  options: Option[]         // 选项（单选/多选有，其他为空）
  tags: string[]            // 标签
}
export type QuestionLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export type QuestionStatus = 'draft' | 'pending_review' | 'approved' | 'needs_revision' | 'archived';

// Exactly 9 Question Types as specified in Section 4
export type QuestionType =
  | 'single_choice'    // (1) Một đáp án
  | 'multiple_choice'  // (2) Nhiều đáp án
  | 'true_false'       // (3) Đúng/sai theo từng ý
  | 'matching'         // (4) Ghép đôi
  | 'ordering'         // (5) Sắp xếp
  | 'fill_blank'       // (6) Điền khuyết
  | 'short_answer'     // (7) Trả lời ngắn / điền số
  | 'essay'            // (8) Tự luận kèm Rubric
  | 'passage_based';   // (9) Theo đoạn văn / tình huống

// Standard Choice Option
export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D', ...
  content: string;
  isCorrect: boolean;
}

// (3) True/False Proposition Item
export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation?: string;
}

// (4) Matching Pair Item
export interface MatchingPair {
  id: string;
  leftPrompt: string; // Vế trái (1, 2, 3...)
  rightTarget: string; // Vế phải (A, B, C...)
  correctMatchId: string; // e.g. "A" matches with leftPrompt 1
}

// (5) Ordering Item
export interface OrderingItem {
  id: string;
  text: string;
  correctOrder: number; // 1, 2, 3, 4
}

// (6) Fill-in-the-blank Blank Item
export interface FillBlankItem {
  blankIndex: number; // [1], [2], ...
  acceptableAnswers: string[]; // ["3x", "3 * x"]
  caseSensitive?: boolean;
}

// (7) Short Answer Configuration
export interface ShortAnswerConfig {
  correctAnswers: string[]; // Chấp nhận "6 cm", "6cm", "6"
  tolerance?: number; // Dung sai số học nếu là bài toán số (ví dụ ±0.1)
  unit?: string; // "cm", "m/s", ...
}

// (8) Essay Rubric Criterion
export interface RubricCriterion {
  id: string;
  name: string; // e.g. "Kỹ năng lập luận", "Độ chính xác công thức"
  maxPoints: number;
  description: string;
}

// Sub-question for (9) Passage Based Question
export interface SubQuestion {
  id: string;
  order: number;
  type: QuestionType;
  content: string;
  points: number;
  options?: QuestionOption[];
  trueFalseItems?: TrueFalseStatement[];
  matchingPairs?: MatchingPair[];
  shortAnswerConfig?: ShortAnswerConfig;
  explanation: string;
}

// Master Unified Question Model
export interface QuestionItem {
  id: string;
  code: string; // e.g. "TOAN9-001"
  type: QuestionType;
  typeLabel: string;
  status: QuestionStatus;
  level: QuestionLevel;
  subject: string;
  grade: string;
  chapter?: string;
  lesson?: string;
  topic: string;
  tags?: string[];
  points: number;
  content: string; // Rich text / LaTeX formulas

  // Type-specific payloads (Validated based on type)
  options?: QuestionOption[];
  trueFalseItems?: TrueFalseStatement[];
  matchingPairs?: MatchingPair[];
  orderingItems?: OrderingItem[];
  fillBlanks?: FillBlankItem[];
  shortAnswerConfig?: ShortAnswerConfig;
  rubric?: RubricCriterion[];

  // Passage/Stimulus data for type (9)
  passageText?: string;
  passageMediaUrl?: string;
  subQuestions?: SubQuestion[];

  explanation: string;
  sampleAnswer?: string; // Cho tự luận
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  aiGenerated?: boolean;
  usageCount: number; // Số lần xuất hiện trong bài kiểm tra
  reviewNote?: string;
}

// KPI Statistics
export interface QuestionBankKPIs {
  total: number;
  approved: number;
  pendingReview: number;
  draft: number;
  needsRevision: number;
  duplicateOrFlagged: number;
}

// Filter State
export interface QuestionFilterState {
  searchQuery: string;
  statusTab: 'all' | QuestionStatus;
  grade: string;
  subject: string;
  topic: string;
  type: string;
  level: string;
  sortBy: 'createdAt' | 'points' | 'level' | 'code';
  sortOrder: 'asc' | 'desc';
}

// AI Wizard Config (Section 5)
export interface AiGenerationConfig {
  subject: string;
  grade: string;
  topic: string;
  chapterLesson?: string;
  sourceText?: string;
  questionCount: number;
  selectedTypes: QuestionType[];
  levelRatios: {
    nhan_biet: number;
    thong_hieu: number;
    van_dung: number;
    van_dung_cao: number;
  };
  strictCurriculum: boolean; // Bám sát chương trình GDPT 2018
}

// Exam/Quiz Creation from Selected Questions (Section 9)
export interface QuizFromQuestionsConfig {
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  selectedQuestionIds: string[];
}

export type TeachingTab =
  | 'question_bank'    // Vị trí 1: Ngân hàng câu hỏi
  | 'homework'         // Vị trí 2: Giao bài tập
  | 'auto_grading'     // Vị trí 3: Chấm bài tự động
  | 'digital_docs'     // Vị trí 4: Tài liệu số
  | 'ai_assistant';    // Vị trí 5: AI HỖ TRỢ

export type MainNavSection = 'teaching' | 'timetable';

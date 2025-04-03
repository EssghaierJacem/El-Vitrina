
import { QuestionType } from "./question-type";

export interface Question {
  id: number;
  question: string;
  questionType: QuestionType;
  quizId: number;
}

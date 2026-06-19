export interface OptionDto {
  text?: string;
  label?: string;
}

export interface QuestionDto {
  question: string;
  options?: OptionDto[];
  value1?: string;
  value2?: string;
  text?: string;
  keyAnswer?: string;
  left?: string;
  right?: string;
}

export interface QuestionSectionDto {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  questions: QuestionDto[];
  primaryColumn?: string[];
  shuffledColumns?: string[];
}

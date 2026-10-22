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
  // Links this question to a ChoiceGroupDto.groupId when it is part of a
  // teacher-authored alternate-choice group (e.g. "Q3 or Q4").
  choiceGroupId?: string;
}

export interface ChoiceGroupDto {
  groupId: string;
  // How many of the questions sharing this groupId the student must answer. Default 1.
  answerCount: number;
}

export interface QuestionSectionDto {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  // "N" of "answer any N of M" internal choice for this section.
  // Equal to numberOfQuestions = no choice (answer all). Always present:
  // the backend backfills it on legacy papers and validation requires it.
  answerCount: number;
  // Teacher-authored pairwise/multi-way alternate groups within this section.
  choiceGroups?: ChoiceGroupDto[];
  questions: QuestionDto[];
  primaryColumn?: string[];
  shuffledColumns?: string[];
}

export interface MatchPair {
    left: string;
    right: string;
    keyAnswer?: string;
}

export interface QuestionSummary {
    topic: string;
    questionType: string;
    objective: string;
    marks: number;
    source: string;
}

export interface UniversalQuestion {
    _id?: string;
    heading?: string;
    type?: string;
    answerType?: string;
    unit_name?: string;
    marksPerQuestion?: number;
    marks?: number;
    objective?: string;
    pairs?: MatchPair[];
    text?: string;
    question_text?: string;
    question?: string;
    keyAnswer?: string;
    answer?: string;
    options?: (string | QuestionOption)[];
    items?: any[];
    source?: string;
    difficulty?: string;
}

export interface LBAQuestion extends Omit<UniversalQuestion, 'source'> { }

export interface QuestionOption {
    text?: string;
}

export interface QuestionBankItem {
    question: string;
    options?: (string | QuestionOption)[];
    pairs?: MatchPair[];
}

export interface QuestionBankSection {
    type: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
    questions: QuestionBankItem[];
    primaryColumn?: string[];
    shuffledColumns?: string[];
}

export interface QuestionBank {
    _id: string;
    questions: QuestionBankSection[];
    feedback?: {
        feedback: string;
        overallFeedback: string;
    };
    metadata: {
        schoolName: string;
    };
}

export interface QuestionDistributionEntry {
    unitName: string;
    objective: string;
}

export interface BluePrintTemplateSection {
    type: string;
    marksPerQuestion: number;
    questionDistribution: QuestionDistributionEntry[];
}

export interface QuestionBankDetails {
    questionBank: QuestionBank;
    bluePrintTemplate: BluePrintTemplateSection[];
    examinationName: string;
    subject: string;
    grade: string;
    totalMarks: number;
    medium: string;
}

export interface UserClass {
    board: string;
    class: string | number;
    medium: string;
    subject: string;
    name: string;
}

export interface UserDetail {
    _id: string;
    name: string;
    email: string;
    role: string[];
    state: string;
    zone?: string;
    district?: string;
    zones?: string[];
    districts?: string[];
    classes: UserClass[];
}

export interface BoardOption {
    board: string;
    [key: string]: unknown;
}

export interface ClassOption {
    class: string;
    [key: string]: unknown;
}

export interface MediumOption {
    medium: string;
    [key: string]: unknown;
}

export interface SubjectOption {
    name: string;
    value: string;
    [key: string]: unknown;
}

export interface LanguageOption {
    name: string;
    value: string;
    [key: string]: unknown;
}

export interface ChapterHeading {
    name: string;
    count?: number;
}

export interface ChapterOption {
    _id: string | null;
    topics: string;
    chapterNumber?: number;
    headings: (string | ChapterHeading)[];
    subTopics?: any[];
    source?: string;
    [key: string]: unknown;
}

export interface SubTopicOption {
    topics: string;
    _id: string;
    [key: string]: unknown;
}

export interface HeadingData {
    name: string;
    count: number;
    chapters: number[];
}

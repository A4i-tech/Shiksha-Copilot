export const LOGIN_ROUTE = '/auth'
export const SESSION_VERSION = 1;

export const MAX_FILE_SIZE = 16 * 1024 * 1024;

export const BULK_UPLOAD_FILE_TYPES = [".xlsx"];

export const DEFAULT_LANGUAGE = [{ name: 'English', value: 'en' }];

export const LOC_LANGUAGES: any[] = [
    {
        state: 'Karnataka',
        value: [
            { name: 'ಕನ್ನಡ', value: 'kn' }
        ]
    },
    {
        state: 'Telangana',
        value: [
            { name: 'తెలుగు', value: 'tg' }
        ]
    }
]

export const MEDIUMS = [{ name: 'English', value: 'english' }, { name: 'Kannada', value: 'kannada' }, { name: 'Telugu', value: 'telugu' }]

export const CLASS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const LOADER_RESTRICTED_URLS = [
    '/chapter/list',
    '/master-lesson/list/',
    '/resource-plan/list/',
    '/teacher-lesson-plan/list',
    '/presentation/job',
    '/presentation/jobs',
    '/presentation/list',
    '/auth/me',
    '/chat/',
    '/lessonchat/'
]

export const IDLE_START_THRESHOLD = 180;

export const IDLE_WARNING_THRESHOLD = 1620;

export const INTERACTION_LOG_THRESHOLD = 10;

export const QUESTION_SOURCE = {
    AI: 'AI Questions',
    LBA: 'Pre-generated Questions',
} as const;

export const QUESTION_TYPE = [
    {
        type: "MCQ",
        name: "Objective Questions (MCQ)",
        value: "Four alternatives are given for each of the following questions, choose the correct alternative"
    },
    {
        type: "FILL_BLANKS",
        name: "Fill in the blanks with suitable words",
        value: "Fill in the blanks with suitable words"
    },
    {
        type: "MATCHING",
        name: "Match the following",
        value: "Match the following"
    },
    {
        type: "ANSWER_VERY_SHORT",
        name: "Very Short Answer",
        value: "Answer the following in a word, phrase or sentence"
    },
    {
        type: "ANSWER_SHORT",
        name: "Short Answer",
        value: "Answer the following in two or three sentences each"
    },
    {
        type: "ANSWER_MEDIUM",
        name: "Answer the following questions",
        value: "Answer the following questions"
    },
    {
        type: "ANSWER_LONG",
        name: "Long Answer",
        value: "Answer the following question in four or five sentences"
    },
    {
        type: "GRAMMAR_MCQ",
        name: "Grammar: Multiple Choice Questions",
        value: "Grammar: Choose the correct option"
    },
    {
        type: "GRAMMAR_FILL_BLANKS",
        name: "Grammar: Fill in the blanks",
        value: "Grammar: Fill in the blanks with correct words/forms"
    },
    {
        type: "GRAMMAR_EDITING",
        name: "Grammar: Identify and correct the error",
        value: "Grammar: Identify and correct the error in the sentence"
    }
]

export const formatMarks = (marks: number) => String(marks).replace(/(?:^0)?\.5$/, '½');

export const CCE_TYPE_MAPPER: any = {
    'Science': 'cce_tools_math_science',
    'Mathematics': 'cce_tools_math_science',
    'Evs': 'cce_tools_math_science',
    'Social Science': 'cce_tools_social',
    'English': 'cce_tools_english'
}

export const TEX_MATH_DELIMITERS = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
  { left: '\\(', right: '\\)', display: false },
  { left: '\\[', right: '\\]', display: true },
];

export const DOCX_CONFIG = {
  spacing: {
    sectionHeader: { before: 120, after: 120 },
    questionItem: { after: 100 },
    optionItem: { after: 120 },
    tableCell: { before: 50, after: 50 },
  },
  indent: {
    optionLeft: '   ',
  },
};

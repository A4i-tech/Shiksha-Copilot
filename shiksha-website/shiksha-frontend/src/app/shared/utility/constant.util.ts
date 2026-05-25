export const LOGIN_ROUTE = '/auth'

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

export const QUESTION_TYPE_MAPPER: any = {
    "Four alternatives are given for each of the following questions, choose the correct alternative": "Objective Questions (MCQ)",
    "Fill in the blanks with suitable words": "Fill in the blanks with suitable words",
    "Match the following": "Match the following",
    "Answer the following in a word, phrase or sentence": "Very Short Answer",
    "Answer the following in two or three sentences each": "Short Answer",
    "Answer the following questions": "Answer the following questions",
    "Answer the following question in four or five sentences": "Long Answer",
}

export const CORE_SUBJECTS = ['Science', 'Social Science', 'Mathematics', 'Evs'];

export const CORE_OBJECTIVE_MAPPER = [{ objective: 'Knowledge', percentage_distribution: 25 }, { objective: 'Understanding', percentage_distribution: 45 }, { objective: 'Application', percentage_distribution: 20 }, { objective: 'Skill', percentage_distribution: 10 }];

export const CORE_OBJECTIVE_MAPPER_10 = [{ objective: 'Knowledge', percentage_distribution: 10 }, { objective: 'Understanding', percentage_distribution: 55 }, { objective: 'Application', percentage_distribution: 20 }, { objective: 'Skill', percentage_distribution: 15 }];

export const LANGUAGE_OBJECTIVE_MAPPER = [{ objective: 'Knowledge', percentage_distribution: 25 }, { objective: 'Comprehension', percentage_distribution: 40 }, { objective: 'Expression', percentage_distribution: 30 }, { objective: 'Appreciation', percentage_distribution: 5 }];

export const TELANGANA_OBJECTIVE_MAPPER = [{ objective: 'Knowledge', percentage_distribution: 10 }, { objective: 'Understanding', percentage_distribution: 20 }, { objective: 'Application', percentage_distribution: 30 }, { objective: 'Higher order thinking', percentage_distribution: 40 }]

export const RESOURCE_MAPPER: any = {
    activities: 'Activities',
    questionbank: 'Question Bank',
    realworldscenarios: 'Real World Scenarios',
};

export const CCE_TYPE_MAPPER: any = {
    'Science': 'cce_tools_math_science',
    'Mathematics': 'cce_tools_math_science',
    'Evs': 'cce_tools_math_science',
    'Social Science': 'cce_tools_social',
    'English': 'cce_tools_english'
}

export const QUESTION_TYPE_MAPPING_LONG = QUESTION_TYPE.reduce((acc: any, item) => {
    acc[item.type] = item.value;
    return acc;
}, {});

export const QUESTION_TYPE_DESCRIPTIONS: any = QUESTION_TYPE.reduce((acc: any, item) => {
    acc[item.type] = item.name;
    return acc;
}, {});

export const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
  'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
  'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
  'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
  'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
  '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾',
};

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

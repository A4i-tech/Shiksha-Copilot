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

export const QUESTION_SOURCE = {
    AI: 'AI Questions',
    LBA: 'Pre-generated Questions',
} as const;

export const CCE_TYPE_MAPPER: any = {
    'Science': 'cce_tools_math_science',
    'Mathematics': 'cce_tools_math_science',
    'Evs': 'cce_tools_math_science',
    'Social Science': 'cce_tools_social',
    'English': 'cce_tools_english'
}

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

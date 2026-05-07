/**
 * Mock implementation of LLM API services
 * Mocks copilot.bot.service, chat.bot.service, and question.bank.bot.service
 */

// Mock chat bot response
const mockChatBotResponse = jest.fn().mockResolvedValue({
  success: true,
  response: 'This is a mock AI response to your question.',
  tokens_used: 150,
});

// Mock lesson plan generation
const mockGenerateLessonPlan = jest.fn().mockResolvedValue({
  success: true,
  lessonPlan: {
    engage: 'Mock engage content with attention-grabbing activity...',
    explore: 'Mock explore content with hands-on activities...',
    explain: 'Mock explain content with detailed explanations...',
    elaborate: 'Mock elaborate content with extended learning...',
    evaluate: 'Mock evaluate content with assessment activities...',
  },
  metadata: {
    generationTime: '5.2s',
    model: 'gpt-4',
    tokens: 2500,
  },
});

// Mock question paper generation
const mockGenerateQuestionPaper = jest.fn().mockResolvedValue({
  success: true,
  questionPaper: {
    metadata: {
      board: 'CBSE',
      medium: 'English',
      grade: '10',
      subject: 'Science',
      totalMarks: 80,
      duration: '3 hours',
    },
    questions: [
      {
        type: 'MCQ',
        question: 'What is photosynthesis?',
        options: ['A) Process of respiration', 'B) Process of making food', 'C) Process of digestion', 'D) Process of excretion'],
        answer: 'B',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
      },
      {
        type: 'ANSWER_SHORT',
        question: 'Explain the process of photosynthesis.',
        answer: 'Photosynthesis is the process by which plants make their own food...',
        marks: 3,
        difficulty: 'medium',
        bloomsLevel: 'Understand',
      },
    ],
  },
});

// Mock question template generation
const mockGenerateQuestionTemplate = jest.fn().mockResolvedValue({
  success: true,
  template: [
    { type: 'MCQ', marks_per_question: 1, number_of_questions: 10, unit: 1 },
    { type: 'FILL_BLANKS', marks_per_question: 1, number_of_questions: 5, unit: 1 },
    { type: 'ANSWER_SHORT', marks_per_question: 3, number_of_questions: 5, unit: 2 },
    { type: 'ANSWER_LONG', marks_per_question: 5, number_of_questions: 4, unit: 3 },
  ],
  totalMarks: 80,
});

// Mock lesson chat with RAG
const mockLessonChat = jest.fn().mockResolvedValue({
  success: true,
  response: 'Based on the chapter content, here is the answer...',
  sources: [
    { page: 12, excerpt: 'Relevant excerpt from chapter...' },
  ],
  tokens_used: 200,
});

// Mock blueprint generation
const mockGenerateBlueprint = jest.fn().mockResolvedValue({
  success: true,
  blueprint: {
    chapters: [
      { name: 'Chapter 1', marks: 20, topics: ['Topic 1', 'Topic 2'] },
      { name: 'Chapter 2', marks: 30, topics: ['Topic 3', 'Topic 4'] },
      { name: 'Chapter 3', marks: 30, topics: ['Topic 5', 'Topic 6'] },
    ],
    distribution: {
      remember: 20,
      understand: 30,
      apply: 20,
      analyze: 10,
    },
  },
});

// Mock workflow status check (for durable functions)
const mockCheckWorkflowStatus = jest.fn().mockResolvedValue({
  success: true,
  status: 'COMPLETED',
  output: {
    lessonPlan: {},
  },
  createdTime: new Date(),
  lastUpdatedTime: new Date(),
});

// Mock workflow trigger
const mockTriggerWorkflow = jest.fn().mockResolvedValue({
  success: true,
  instanceId: 'mock-instance-id-12345',
  statusQueryGetUri: 'https://mock-workflow-url/status/mock-instance-id-12345',
  webhookUrl: 'https://mock-webhook-url',
});

const CopilotBotService = {
  generateLessonPlan: mockGenerateLessonPlan,
  generateQuestionPaper: mockGenerateQuestionPaper,
  generateQuestionTemplate: mockGenerateQuestionTemplate,
  generateBlueprint: mockGenerateBlueprint,
  triggerWorkflow: mockTriggerWorkflow,
  checkWorkflowStatus: mockCheckWorkflowStatus,
};

const ChatBotService = {
  sendMessage: mockChatBotResponse,
  lessonChat: mockLessonChat,
};

const QuestionBankBotService = {
  generateQuestionPaper: mockGenerateQuestionPaper,
  generateTemplate: mockGenerateQuestionTemplate,
};

module.exports = {
  CopilotBotService,
  ChatBotService,
  QuestionBankBotService,
  mockChatBotResponse,
  mockGenerateLessonPlan,
  mockGenerateQuestionPaper,
  mockGenerateQuestionTemplate,
  mockLessonChat,
  mockGenerateBlueprint,
  mockCheckWorkflowStatus,
  mockTriggerWorkflow,
};

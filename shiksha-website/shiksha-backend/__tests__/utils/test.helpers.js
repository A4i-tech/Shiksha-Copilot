const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * Generate a valid JWT token for testing
 * @param {Object} payload - Token payload
 * @param {String} expiresIn - Token expiration (default: 1h)
 * @returns {String} JWT token
 */
const generateTestToken = (payload = {}, expiresIn = '1h') => {
  const defaultPayload = {
    userId: new mongoose.Types.ObjectId().toString(),
    role: 'TEACHER',
    ...payload,
  };

  return jwt.sign(defaultPayload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generate an admin JWT token for testing
 * @returns {String} Admin JWT token
 */
const generateAdminToken = () => {
  return generateTestToken({
    userId: new mongoose.Types.ObjectId().toString(),
    role: 'ADMIN',
    isAdmin: true,
  });
};

/**
 * Generate an expired JWT token for testing
 * @returns {String} Expired JWT token
 */
const generateExpiredToken = () => {
  return generateTestToken({}, '-1h'); // Expired 1 hour ago
};

/**
 * Create a mock user object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock user object
 */
const createMockUser = (overrides = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test User',
    phone: '9876543210',
    role: 'TEACHER',
    school: new mongoose.Types.ObjectId(),
    language: 'EN',
    isDeleted: false,
    isLoginAllowed: true,
    profileCompleted: true,
    ...overrides,
  };
};

/**
 * Create a mock admin user object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock admin user object
 */
const createMockAdmin = (overrides = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'ADMIN',
    isDeleted: false,
    isLoginAllowed: true,
    ...overrides,
  };
};

/**
 * Create a mock school object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock school object
 */
const createMockSchool = (overrides = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test School',
    board: new mongoose.Types.ObjectId(),
    medium: 'English',
    udiseCode: 'UDISE12345',
    region: new mongoose.Types.ObjectId(),
    isDeleted: false,
    ...overrides,
  };
};

/**
 * Create a mock lesson plan object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock lesson plan object
 */
const createMockLessonPlan = (overrides = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    teacher: new mongoose.Types.ObjectId(),
    masterLesson: new mongoose.Types.ObjectId(),
    subject: 'Mathematics',
    grade: '10',
    chapter: 'Algebra',
    topic: 'Linear Equations',
    status: 'COMPLETED',
    content: {
      engage: 'Engage content...',
      explore: 'Explore content...',
      explain: 'Explain content...',
      elaborate: 'Elaborate content...',
      evaluate: 'Evaluate content...',
    },
    isDeleted: false,
    ...overrides,
  };
};

/**
 * Create a mock question bank object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock question bank object
 */
const createMockQuestionBank = (overrides = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    teacher: new mongoose.Types.ObjectId(),
    board: 'CBSE',
    medium: 'English',
    grade: '10',
    subject: 'Science',
    totalMarks: 80,
    template: [
      { type: 'MCQ', marks_per_question: 1, number_of_questions: 10 },
      { type: 'ANSWER_SHORT', marks_per_question: 3, number_of_questions: 5 },
    ],
    questions: [],
    status: 'COMPLETED',
    isDeleted: false,
    ...overrides,
  };
};

/**
 * Create a mock chat message object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock chat message object
 */
const createMockChatMessage = (overrides = {}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    message: 'Test message',
    response: 'Test response',
    timestamp: new Date(),
    ...overrides,
  };
};

/**
 * Wait for a specified time (useful for async operations)
 * @param {Number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after specified time
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a random phone number for testing
 * @returns {String} Random 10-digit phone number
 */
const generateRandomPhone = () => {
  return '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
};

/**
 * Generate a random email for testing
 * @returns {String} Random email address
 */
const generateRandomEmail = () => {
  const random = Math.random().toString(36).substring(7);
  return `test.${random}@example.com`;
};

/**
 * Generate a random UDISE code for testing
 * @returns {String} Random UDISE code
 */
const generateRandomUdiseCode = () => {
  return 'UDISE' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
};

/**
 * Create pagination query parameters
 * @param {Number} page - Page number (default: 1)
 * @param {Number} limit - Items per page (default: 10)
 * @returns {Object} Pagination query object
 */
const createPaginationParams = (page = 1, limit = 10) => {
  return { page, limit };
};

/**
 * Extract error message from response
 * @param {Object} response - HTTP response object
 * @returns {String} Error message
 */
const extractErrorMessage = (response) => {
  return response.body.message || response.body.error || 'Unknown error';
};

/**
 * Mock file upload data
 * @param {String} filename - File name
 * @param {String} mimetype - MIME type
 * @returns {Object} Mock file object
 */
const createMockFile = (filename = 'test.pdf', mimetype = 'application/pdf') => {
  return {
    fieldname: 'file',
    originalname: filename,
    encoding: '7bit',
    mimetype: mimetype,
    buffer: Buffer.from('test file content'),
    size: 1024,
  };
};

/**
 * Mock Express request object
 * @param {Object} options - Request options
 * @returns {Object} Mock request object
 */
const createMockRequest = (options = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    isAdmin: false,
    file: null,
    files: [],
    ...options,
  };
};

/**
 * Mock Express response object
 * @returns {Object} Mock response object
 */
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendFile = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock Express next function
 * @returns {Function} Mock next function
 */
const createMockNext = () => jest.fn();

module.exports = {
  generateTestToken,
  generateAdminToken,
  generateExpiredToken,
  createMockUser,
  createMockAdmin,
  createMockSchool,
  createMockLessonPlan,
  createMockQuestionBank,
  createMockChatMessage,
  wait,
  generateRandomPhone,
  generateRandomEmail,
  generateRandomUdiseCode,
  createPaginationParams,
  extractErrorMessage,
  createMockFile,
  createMockRequest,
  createMockResponse,
  createMockNext,
};

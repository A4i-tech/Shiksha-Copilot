const mockEndlineDao = { existsByUser: jest.fn(), createSurvey: jest.fn() };
const mockBaselineDao = { findByUser: jest.fn() };
const mockTrainingDao = { getTrainingDateForUser: jest.fn() };
const mockLessonPlan = { countDocuments: jest.fn() };
const mockQuestionBank = { countDocuments: jest.fn() };

jest.mock('../../../dao/endlineSurvey.dao', () => jest.fn(() => mockEndlineDao));
jest.mock('../../../dao/baselineSurvey.dao', () => jest.fn(() => mockBaselineDao));
jest.mock('../../../dao/teacher.training.batch.dao', () => jest.fn(() => mockTrainingDao));
jest.mock('../../../models/teacher.lesson.plan.model', () => mockLessonPlan);
jest.mock('../../../models/question.bank.config.model', () => mockQuestionBank);

const manager = require('../../../managers/endlineSurvey.manager');
const validPayload = {
  shikshaTimeUsage: '5 – 15 minutes', shikshaUsability: 'Direct',
  shikshaBenefits: ['Provides quality content'], shikshaTimeUtilization: 'Students',
  shikshaContentUsed: ['Questions'], shikshaStudentImpact: ['Helps students'],
};

describe('EndlineSurveyManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrainingDao.getTrainingDateForUser.mockResolvedValue(new Date());
    mockBaselineDao.findByUser.mockResolvedValue({ createdAt: new Date(Date.now() - 31 * 86400000) });
    mockLessonPlan.countDocuments.mockResolvedValue(1);
    mockQuestionBank.countDocuments.mockResolvedValue(1);
    mockEndlineDao.existsByUser.mockResolvedValue(false);
    mockEndlineDao.createSurvey.mockResolvedValue({ _id: 'survey' });
  });

  it('requires submitted training attendance', async () => {
    mockTrainingDao.getTrainingDateForUser.mockResolvedValue(null);
    expect((await manager.checkStatus('user')).data.status).toBe('not_trained');
  });

  it('waits 30 days after the baseline survey', async () => {
    mockBaselineDao.findByUser.mockResolvedValue({ createdAt: new Date() });
    expect((await manager.checkStatus('user')).data.status).toBe('waiting_period');
  });

  it('requires two generated items', async () => {
    mockQuestionBank.countDocuments.mockResolvedValue(0);
    expect((await manager.checkStatus('user')).data).toEqual(expect.objectContaining({ status: 'minimum_usage_not_met', requiredCount: 2 }));
  });

  it('opens and submits an eligible survey', async () => {
    expect((await manager.checkStatus('user')).data.status).toBe('open');
    expect((await manager.submitSurvey('user', validPayload)).success).toBe(true);
    expect(mockEndlineDao.createSurvey).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user' }));
  });

  it('rejects mutually exclusive answers', async () => {
    await expect(manager.submitSurvey('user', { ...validPayload, shikshaBenefits: ['Provides quality content', 'Still exploring its usefulness'] }))
      .rejects.toMatchObject({ status: 400 });
  });
});

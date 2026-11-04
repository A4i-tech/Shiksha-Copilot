const TeacherFeedbackManager = require('../../../managers/teacher.feedback.manager');
jest.mock('../../../models/school.model', () => ({ distinct: jest.fn() }));
jest.mock('../../../models/user.model', () => ({ distinct: jest.fn() }));

describe('TeacherFeedbackManager', () => {
    let manager;

    beforeEach(() => {
        manager = new TeacherFeedbackManager();
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    it('should be an instance of TeacherFeedbackManager', () => {
        expect(manager).toBeInstanceOf(TeacherFeedbackManager);
    });
});

describe('TeacherFeedbackManager authorization', () => {
    const permissions = [{ permission: 'content.manage', scopeType: 'SCHOOL', dep: 'aaaaaaaaaaaaaaaaaaaaaaaa' }];
    const School = require('../../../models/school.model');
    const User = require('../../../models/user.model');
    let manager;

    beforeEach(() => {
        manager = new TeacherFeedbackManager();
        manager.dao = { getById: jest.fn().mockResolvedValue({ teacherId: 't1' }), update: jest.fn().mockResolvedValue({ _id: 'f1' }) };
        School.distinct.mockResolvedValue(['s1']);
        User.distinct.mockResolvedValue(['t2']);
    });

    it('blocks updating feedback of a teacher outside scope', async () => {
        await expect(manager.update('f1', { feedback: 'x' }, permissions)).rejects.toMatchObject({ statusCode: 403 });
        expect(manager.dao.update).not.toHaveBeenCalled();
    });

    it('answers an out-of-scope feedback id like a missing one', async () => {
        manager.dao.getById = jest.fn().mockResolvedValue({ teacherId: 't1' });
        const outOfScope = await manager.getById({ params: { id: 'f1' }, permissions });
        manager.dao.getById.mockResolvedValue(null);
        expect(outOfScope).toEqual(await manager.getById({ params: { id: 'f1' }, permissions }));
        expect(outOfScope).toEqual({ success: false, message: 'Record not found. Refresh the page and try again.', data: null });
    });

    it('returns a failure result when updating a missing id', async () => {
        manager.dao.getById = jest.fn().mockResolvedValue(null);
        manager.dao.update = jest.fn().mockResolvedValue(null);
        const result = await manager.update('missing', { feedback: 'x' }, permissions);
        expect(result).toEqual({ success: false, message: 'Feedback not found. Refresh the page and try again.', data: null });
        expect(manager.dao.update).not.toHaveBeenCalled();
    });

    it('returns an in-scope feedback by id', async () => {
        manager.dao.getById = jest.fn().mockResolvedValue({ teacherId: 't2' });
        const result = await manager.getById({ params: { id: 'f1' }, permissions });
        expect(result.success).toBe(true);
    });
});

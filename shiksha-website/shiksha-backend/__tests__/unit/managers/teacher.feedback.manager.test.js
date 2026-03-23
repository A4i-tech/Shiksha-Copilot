const TeacherFeedbackManager = require('../../../managers/teacher.feedback.manager');

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

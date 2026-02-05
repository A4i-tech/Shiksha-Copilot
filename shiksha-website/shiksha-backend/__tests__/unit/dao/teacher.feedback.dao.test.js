const TeacherFeedbackDao = require('../../../dao/teacher.feedback.dao');

describe('TeacherFeedbackDao', () => {
    let dao;

    beforeEach(() => {
        dao = new TeacherFeedbackDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of TeacherFeedbackDao', () => {
        expect(dao).toBeInstanceOf(TeacherFeedbackDao);
    });
});

const TeacherFeedbackController = require('../../../controllers/teacher.feedback.controller');

describe('TeacherFeedbackController', () => {
    let controller;

    beforeEach(() => {
        controller = new TeacherFeedbackController();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be an instance of TeacherFeedbackController', () => {
        expect(controller).toBeInstanceOf(TeacherFeedbackController);
    });
});

const FeedbackLessonController = require('../../../controllers/feedback.lesson.controller');

describe('FeedbackLessonController', () => {
    let controller;

    beforeEach(() => {
        controller = new FeedbackLessonController();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be an instance of FeedbackLessonController', () => {
        expect(controller).toBeInstanceOf(FeedbackLessonController);
    });
});

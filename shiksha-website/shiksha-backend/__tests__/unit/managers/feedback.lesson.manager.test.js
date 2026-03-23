const FeedbackLessonManager = require('../../../managers/feedback.lesson.manager');

describe('FeedbackLessonManager', () => {
    let manager;

    beforeEach(() => {
        manager = new FeedbackLessonManager();
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    it('should be an instance of FeedbackLessonManager', () => {
        expect(manager).toBeInstanceOf(FeedbackLessonManager);
    });
});

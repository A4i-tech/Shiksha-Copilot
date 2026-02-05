const FeedbackLessonDao = require('../../../dao/feedback.lesson.dao');

describe('FeedbackLessonDao', () => {
    let dao;

    beforeEach(() => {
        dao = new FeedbackLessonDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of FeedbackLessonDao', () => {
        expect(dao).toBeInstanceOf(FeedbackLessonDao);
    });
});

const masterLessonAggregation = require('../../../aggregation/master.lesson.aggregation');

describe('Master Lesson Aggregation', () => {
    it('should be defined', () => {
        expect(masterLessonAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof masterLessonAggregation).toBe('object');
    });
});

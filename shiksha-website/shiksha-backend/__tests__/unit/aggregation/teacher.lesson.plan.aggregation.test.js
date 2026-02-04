const teacherLessonPlanAggregation = require('../../../aggregation/teacher.lesson.plan.aggregation');

describe('Teacher Lesson Plan Aggregation', () => {
    it('should be defined', () => {
        expect(teacherLessonPlanAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof teacherLessonPlanAggregation).toBe('object');
    });
});

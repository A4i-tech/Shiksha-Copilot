const TeacherLessonPlanDao = require('../../../dao/teacher.lesson.plan.dao');

describe('TeacherLessonPlanDao', () => {
    let dao;

    beforeEach(() => {
        dao = new TeacherLessonPlanDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of TeacherLessonPlanDao', () => {
        expect(dao).toBeInstanceOf(TeacherLessonPlanDao);
    });
});

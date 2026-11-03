const AppError = require("./app.error");

// A regenerated lesson is a per-teacher copy: only a teacher with a live plan on it may use it.
async function assertRegeneratedAccess(teacherLessonPlanDao, teacherId, lesson) {
	if (lesson.isRegenerated && !(await teacherLessonPlanDao.getByTeacherAndLesson(teacherId, lesson._id))) {
		throw new AppError(`Master lesson with ID ${lesson._id} not found. Check the lesson ID and try again.`, 404);
	}
}

module.exports = { assertRegeneratedAccess };

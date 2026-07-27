const AuditLog = require("../models/audit.log.model");
const MasterLesson = require("../models/master.lesson.model");
const RegeneratedLessonResource = require("../models/regenerate.lesson.resource.model");
const Role = require("../models/role.model");
const School = require("../models/school.model");
const TeacherTrainingBatch = require("../models/teacher.training.batch.model");
const User = require("../models/user.model");

exports.session = async function session(req, res) {
  const user = await User.findById(req.body.userId);
  res.json({ success: true, data: { token: user.generateAuthToken() } });
};

exports.fixtures = async function fixtures(req, res) {
  const lesson = await MasterLesson.findOne().lean();
  if (!lesson) throw new Error("A master lesson is required");
  delete lesson._id;

  const content = [];
  const activities = [];
  for (const fixture of req.body.contentActivities) {
    const [source, generated] = await MasterLesson.create([
      { ...lesson, name: fixture.sourceName },
      { ...lesson, name: fixture.generatedName },
    ]);
    content.push(source, generated);
    activities.push(await RegeneratedLessonResource.create({
      isLesson: true,
      status: "completed",
      isMasterContent: false,
      contentId: source._id,
      genContentId: generated._id,
      generatedBy: fixture.generatedBy,
    }));
  }

  const batches = await TeacherTrainingBatch.create(req.body.trainingBatches);
  res.json({
    success: true,
    data: {
      content: content.map((item) => item._id),
      activities: activities.map((item) => item._id),
      batches,
    },
  });
};

exports.cleanup = async function cleanup(req, res) {
  const { roles, users, schools, content, activities, batches } = req.body;
  await Promise.all([
    AuditLog.deleteMany({ userId: { $in: users } }),
    TeacherTrainingBatch.deleteMany({ _id: { $in: batches } }),
    RegeneratedLessonResource.deleteMany({ _id: { $in: activities } }),
    MasterLesson.deleteMany({ _id: { $in: content } }),
    User.deleteMany({ _id: { $in: users } }),
    School.deleteMany({ _id: { $in: schools } }),
    Role.deleteMany({ _id: { $in: roles } }),
  ]);
  res.json({ success: true });
};

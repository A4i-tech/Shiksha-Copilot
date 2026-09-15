const CryptoJS = require("crypto-js");
const AuditLog = require("../models/audit.log.model");
const MasterLesson = require("../models/master.lesson.model");
const RegeneratedLessonResource = require("../models/regenerate.lesson.resource.model");
const Role = require("../models/role.model");
const School = require("../models/school.model");
const SchoolClass = require("../models/school.class.model");
const TeacherTrainingBatch = require("../models/teacher.training.batch.model");
const User = require("../models/user.model");
const authHelper = require("../helper/auth.helper");
const { deleteFromStorage } = require("../services/azure.blob.service");

exports.session = async function session(req, res) {
  const user = await User.findById(req.body.userId);
  res.json({ success: true, data: { token: user.generateAuthToken() } });
};

exports.resetAuth = async function resetAuth(req, res) {
  const { userId, pin } = req.body;
  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ success: false, message: "PIN must contain four digits" });
  if (!process.env.PIN_SECRET_KEY) throw new Error("PIN_SECRET_KEY is required");

  const user = await User.findByIdAndUpdate(userId, {
    $set: {
      otp: CryptoJS.AES.encrypt(pin, process.env.PIN_SECRET_KEY).toString(),
      loginAttempts: [],
      rememberMeToken: false,
      isLoginAllowed: true,
    },
    $unset: { recovery: 1 },
  }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  authHelper.clearSms(user.identity.phone);
  res.json({ success: true });
};

exports.latestSms = async function latestSms(req, res) {
  const message = authHelper.getLatestSms(req.query.phone);
  if (!message) return res.status(404).json({ success: false, message: "SMS not found" });
  res.json({ success: true, data: message });
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
  const { roles, users, schools, classes, auditLogs, content, activities, batches, blobs = [] } = req.body;
  await Promise.all([
    AuditLog.deleteMany({ $or: [{ userId: { $in: users } }, { _id: { $in: auditLogs } }] }),
    TeacherTrainingBatch.deleteMany({ _id: { $in: batches } }),
    RegeneratedLessonResource.deleteMany({ _id: { $in: activities } }),
    MasterLesson.deleteMany({ _id: { $in: content } }),
    User.deleteMany({ _id: { $in: users } }),
    SchoolClass.deleteMany({ $or: [{ schoolId: { $in: schools } }, { _id: { $in: classes } }] }),
    School.deleteMany({ _id: { $in: schools } }),
    Role.deleteMany({ _id: { $in: roles } }),
    ...blobs.map(deleteFromStorage),
  ]);
  res.json({ success: true });
};

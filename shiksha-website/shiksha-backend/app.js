const { webcrypto } = require("crypto");
if (!globalThis.crypto) {
	globalThis.crypto = webcrypto;
}

const dotenv = require("dotenv");
dotenv.config();

require("applicationinsights").setup().start();

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const dbService = require("./config/db");
const userRoutes = require("./routes/user.routes.js");
const masterLessonRoutes = require("./routes/master.lesson.routes");
const boardRoutes = require("./routes/board.routes");
const schoolRoutes = require("./routes/school.routes");
const schoolClassRoutes = require("./routes/school.class.routes");
const regionRoutes = require("./routes/region.routes");
const authRoutes = require("./routes/auth.routes");
const contentActivityRoutes = require("./routes/content.activity.routes");
const roleRoutes = require("./routes/role.routes");
const presentationRoutes = require("./routes/presentation.routes");
const resourceRoutes = require("./routes/facility.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const masterSubjectRoutes = require("./routes/master.subject.routes");
const masterClassRoutes = require("./routes/master.class.routes");
const masterResourceRoutes = require("./routes/master.resource.routes");
const chapterRoutes = require("./routes/chapter.routes");
const teacherLessonRoutes = require("./routes/teacher.lesson.plan.routes");
const lessonFeedbackRoutes = require("./routes/feedback.lesson.routes");
const resourceFeedbackRoutes = require("./routes/teacher.feedback.routes");
const questionBankRoutes = require("./routes/question.bank.routes.js");
const lessonPlanTemplateRoutes = require("./routes/lesson.plan.template.routes.js");
const chatRoutes = require("./routes/chat.routes");
const auditRoutes = require("./routes/audit.log.route");
const errorMiddleware = require('./middlewares/error.middleware');
const conditionalMorganMiddleware = require('./config/morgan');
const useragent = require('express-useragent');
const teacherTrainingBatchRoutes = require('./routes/teacher.training.batch.routes.js');
const teacherAbsentRoutes = require('./routes/teacher.absent.routes.js');
const baselineSurveyRoutes = require('./routes/baselineSurvey.routes');
const endlineSurveyRoutes = require('./routes/endlineSurvey.routes');
const systemRoutes = require('./routes/system.routes.js');
const supersetRoutes = require('./routes/superset.routes.js');

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // trust Azure ingress/LB for HTTPS detection

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [/^http:\/\/localhost:\d+$/];
app.use(cors({ origin: allowedOrigins, optionsSuccessStatus: 200 }));

app.use(logger("dev"));
app.use(conditionalMorganMiddleware);
app.use(useragent.express());

const PORT = process.env.PORT;
dbService.connect().then((data) => console.log(data.message));

app.use("/", systemRoutes);
app.use("/api", userRoutes);
app.use("/api", masterLessonRoutes);
app.use("/api", boardRoutes);
app.use("/api", schoolRoutes);
app.use("/api", schoolClassRoutes);
app.use("/api", regionRoutes);
app.use("/api", authRoutes);
app.use("/api", contentActivityRoutes);
app.use("/api", roleRoutes);
app.use("/api", resourceRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", masterSubjectRoutes);
app.use("/api", masterClassRoutes);
app.use("/api", masterResourceRoutes);
app.use("/api", presentationRoutes);
app.use("/api", chapterRoutes);
app.use("/api", teacherLessonRoutes);
app.use("/api", lessonFeedbackRoutes);
app.use("/api", resourceFeedbackRoutes);
app.use("/api", chatRoutes);
app.use("/api", auditRoutes);
app.use("/api", questionBankRoutes)
app.use("/api", lessonPlanTemplateRoutes)
app.use("/api", teacherTrainingBatchRoutes);
app.use('/api', teacherAbsentRoutes);
app.use('/api', baselineSurveyRoutes);
app.use('/api', endlineSurveyRoutes);
app.use('/api', supersetRoutes);
if (process.env.SHIKSHA_DEVTOOLS === "true") app.use("/api/devtools", require("./routes/devtools.routes"));

app.use(errorMiddleware);

process.on('unhandledRejection', (reason, promise) => {
	console.log(promise, reason);
	process.exit(1);
})
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

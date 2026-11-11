#!/usr/bin/env node
/**
 * Seeds a throwaway database for the kind CI cluster: built-in roles, a school,
 * a superuser, an admin, a teacher and a few lesson plans with generated content.
 * Never run it against a live database.
 *
 * Usage (inside the backend pod, so it uses the same models and env as the app):
 *   SEED_SU_PHONE=.. SEED_SU_PIN=.. SEED_ADMIN_PHONE=.. SEED_ADMIN_PIN=.. \
 *   SEED_TEACHER_PHONE=.. SEED_TEACHER_PIN=.. node scripts/seed-ci.js
 */
"use strict";

require("dotenv").config();
const CryptoJS = require("crypto-js");
const mongoose = require("mongoose");
const builtinRoles = require("../config/builtin_roles.json");
const { getAcademicYear } = require("../helper/academic.year.helper");
const BaselineSurvey = require("../models/baselineSurvey.model");
const Chapter = require("../models/chapter.model");
const LessonPlanTemplate = require("../models/lesson.plan.template.model");
const MasterLesson = require("../models/master.lesson.model");
const MasterSubject = require("../models/master.subject.model");
const Region = require("../models/region.model");
const RegeneratedLessonResource = require("../models/regenerate.lesson.resource.model");
const Role = require("../models/role.model");
const SchoolClass = require("../models/school.class.model");
const School = require("../models/school.model");
const TeacherLessonPlan = require("../models/teacher.lesson.plan.model");
const User = require("../models/user.model");

const { MONGO_URL, PIN_SECRET_KEY } = process.env;
if (!/^mongodb:\/\/(shiksha-mongo|localhost|127\.0\.0\.1)[.:/]/.test(MONGO_URL || "")) {
  throw new Error(`Refusing to seed ${MONGO_URL ? "a non-CI database" : "without MONGO_URL"}. MONGO_URL must point at shiksha-mongo or localhost.`);
}
if (!PIN_SECRET_KEY) throw new Error("PIN_SECRET_KEY is required");

const need = (name) => {
  if (!process.env[name]) throw new Error(`${name} is required`);
  return process.env[name];
};
const pin = (value) => CryptoJS.AES.encrypt(value, PIN_SECRET_KEY).toString();
const roleId = (name) => builtinRoles.find((role) => role.name === name)._id;

async function main() {
  await mongoose.connect(MONGO_URL);
  // The backend may already have created the built-in roles at boot.
  await Role.bulkWrite(builtinRoles.map((role) => ({ replaceOne: { filter: { _id: role._id }, replacement: role, upsert: true } })));

  // Two districts and one block name in both: the integration suites need a remote school and a block-name collision.
  const regions = [
    { state: "Karnataka", zone: "Bengaluru", district: "Bengaluru Urban", blocks: ["Central", "South"] },
    { state: "Karnataka", zone: "Mysuru", district: "Mysuru", blocks: ["Central"] },
  ];
  await Region.create(regions.map(({ state, zone, district, blocks }) => ({
    state, zones: [{ name: zone, districts: [{ name: district, blocks: blocks.map((name) => ({ name })) }] }],
  })));
  const schools = await School.create(regions.flatMap(({ state, zone, district, blocks }) => blocks.map((block) => ({
    name: `CI School ${district} ${block}`, schoolId: 0, boards: ["KSEEB"], state, zone, district, block, mediums: ["english"],
  }))).map((school, index) => ({ ...school, schoolId: 29000000001 + index })));
  const school = schools[0];
  await SchoolClass.create(schools.map((item) => ({
    schoolId: item._id, board: "KSEEB", medium: "english", start: 1, end: 10,
    classDetails: [6, 8].map((standard) => ({ standard, girlsStrength: 10, boysStrength: 10, totalStrength: 20 })),
  })));

  const profile = { facilities: [], isProfileCompleted: true, classes: [{
    board: "KSEEB", class: 8, medium: "english", subject: "Science", name: "Science 8A", sem: 1,
  }] };
  await User.create([
    { identity: { name: "CI Superuser", phone: need("SEED_SU_PHONE") }, otp: pin(need("SEED_SU_PIN")),
      roles: [{ role: roleId("Superuser") }], profiles: { admin: { state: "Karnataka" } } },
    { identity: { name: "CI Admin", phone: need("SEED_ADMIN_PHONE") }, otp: pin(need("SEED_ADMIN_PIN")),
      roles: [{ role: roleId("Admin") }], profiles: { admin: { state: "Karnataka" } } },
    { identity: { name: "CI Teacher", phone: need("SEED_TEACHER_PHONE") }, otp: pin(need("SEED_TEACHER_PIN")),
      roles: [{ role: roleId("Power Teacher"), dep: school._id }], profiles: { teacher: profile } },
  ]);
  const teacher = await User.findOne({ "identity.phone": need("SEED_TEACHER_PHONE") });

  await BaselineSurvey.create({ userId: teacher._id, academicYear: getAcademicYear() });

  const subject = await MasterSubject.create({
    subjectName: "Science", name: "Science", sem: 1, boards: ["KSEEB"],
    applicableClasses: [{ board: "KSEEB", classes: [6, 8] }],
  });
  const chapter = await Chapter.create({
    subjectId: subject._id, topics: "Matter", subTopics: ["Solids", "Liquids"],
    medium: "english", standard: 8, board: "KSEEB", orderNumber: 1,
  });

  const template = await LessonPlanTemplate.create({ name: "CI Template", workFlowId: "ci", model: "ci" });
  for (const index of [1, 2, 3]) {
    const lesson = { templateId: template._id, class: 8, board: "KSEEB", medium: "english", subject: "Science", chapterId: chapter._id };
    const [source, generated] = await MasterLesson.create([
      { ...lesson, name: `CI Lesson Plan ${index}` },
      { ...lesson, name: `CI Lesson Plan ${index} (generated)` },
    ]);
    await RegeneratedLessonResource.create({
      isLesson: true, status: "completed", isMasterContent: false,
      contentId: source._id, genContentId: generated._id, generatedBy: teacher._id,
    });
    await TeacherLessonPlan.create({
      teacherId: teacher._id, lessonId: generated._id, baseLessonId: source._id,
      isLesson: true, status: "completed", isGenerated: true, isCompleted: true,
    });
  }
  console.log("seeded: roles, school, 3 users, 3 lesson plans");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

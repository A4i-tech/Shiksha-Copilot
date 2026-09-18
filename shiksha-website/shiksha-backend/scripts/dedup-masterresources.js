#!/usr/bin/env node
// Run --apply against a restored dump first, never prod directly.
'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MasterResource = require('../models/master.resource.model');
const TeacherLessonPlan = require('../models/teacher.lesson.plan.model');
const TeacherResourceFeedback = require('../models/feedback.resource.model');

// Repointed before delete to avoid orphaning FKs.
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL && require.main === module) {
  console.error('MONGO_URL env var is required');
  process.exit(1);
}

const APPLY = process.argv.includes('--apply');

// Matches the unique index key; see model.
function groupKey(doc) {
  return [doc.board, doc.class, doc.subject, doc.medium, doc.lessonName, doc.isAll].join('|');
}

function pickCanonical(docs) {
  return docs.slice().sort((a, b) => {
    const scoreA = (a.resources || []).length + (a.additionalResources || []).length;
    const scoreB = (b.resources || []).length + (b.additionalResources || []).length;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a._id.toString() < b._id.toString() ? -1 : 1;
  })[0];
}

async function findDuplicates() {
  const docs = await MasterResource.find({}).lean();
  const groups = new Map();
  for (const doc of docs) {
    const key = groupKey(doc);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(doc);
  }

  const toDelete = [];
  for (const groupDocs of groups.values()) {
    if (groupDocs.length < 2) continue;
    const canonical = pickCanonical(groupDocs);
    for (const doc of groupDocs) {
      if (String(doc._id) !== String(canonical._id)) {
        toDelete.push({
          _id: doc._id,
          keptCanonical: canonical._id,
          board: doc.board,
          medium: doc.medium,
          isAll: doc.isAll,
          lessonName: doc.lessonName,
        });
      }
    }
  }
  return toDelete;
}

async function findMalformedSubTopics() {
  const docs = await MasterResource.find({}).lean();
  return docs
    .filter((d) => Array.isArray(d.subTopics) && d.subTopics.some((s) => typeof s !== 'string' || !s.trim()))
    .map((d) => ({
      _id: d._id,
      before: d.subTopics,
      after: d.subTopics.filter((s) => typeof s === 'string' && s.trim()),
    }));
}

async function run() {
  await mongoose.connect(MONGO_URL);
  console.log(`Connected to MongoDB${APPLY ? ' (APPLY MODE - will write)' : ' (dry run)'}`);

  const allDeletes = await findDuplicates();
  console.log(`${allDeletes.length} duplicate docs to remove`);

  const subTopicFixes = await findMalformedSubTopics();
  console.log(`A5: ${subTopicFixes.length} docs with malformed subTopics to normalize`);

  const deletedIds = allDeletes.map((d) => d._id);
  const planRefs = await TeacherLessonPlan.countDocuments({ resourceId: { $in: deletedIds } });
  const feedbackRefs = await TeacherResourceFeedback.countDocuments({ resourceId: { $in: deletedIds } });
  console.log(`${planRefs} teacherlessonplans and ${feedbackRefs} teacherresourcefeedbacks reference a doc about to be deleted - will be repointed to the kept canonical, not orphaned.`);

  const logPath = path.join(__dirname, `dedup-log-${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ deletes: allDeletes, subTopicFixes }, null, 2));
  console.log(`Wrote audit log before any write: ${logPath}`);

  if (!APPLY) {
    console.log('Dry run complete. Re-run with --apply to perform the deletes/updates above.');
    await mongoose.disconnect();
    return;
  }

  // Single transaction keeps repoint and delete atomic.
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const repointOps = allDeletes.map((del) => ({
        updateMany: {
          filter: { resourceId: del._id },
          update: { $set: { resourceId: del.keptCanonical } },
        },
      }));
      const planResult = repointOps.length
        ? await TeacherLessonPlan.bulkWrite(repointOps, { session })
        : { modifiedCount: 0 };
      const feedbackResult = repointOps.length
        ? await TeacherResourceFeedback.bulkWrite(repointOps, { session })
        : { modifiedCount: 0 };
      console.log(`Repointed ${planResult.modifiedCount} teacherlessonplans and ${feedbackResult.modifiedCount} teacherresourcefeedbacks off deleted docs onto their kept canonical.`);

      const deleteIds = allDeletes.map((del) => del._id);
      if (deleteIds.length) {
        await MasterResource.deleteMany({ _id: { $in: deleteIds } }, { session });
      }
      console.log(`Deleted ${deleteIds.length} duplicate docs.`);

      const subTopicOps = subTopicFixes.map((fix) => ({
        updateOne: {
          filter: { _id: fix._id },
          update: { $set: { subTopics: fix.after } },
        },
      }));
      if (subTopicOps.length) {
        await MasterResource.bulkWrite(subTopicOps, { session });
      }
      console.log(`Normalized ${subTopicFixes.length} subTopics arrays.`);
    });
  } finally {
    await session.endSession();
  }

  console.log('Building the unique index now that duplicates are gone...');
  try {
    await MasterResource.syncIndexes();
  } catch (err) {
    console.error('Dedup committed, but index build failed - safe to rerun this script, it is idempotent:', err);
    throw err;
  }

  console.log('Apply complete.');
  await mongoose.disconnect();
}

module.exports = { groupKey, pickCanonical, run };

// Only runs when invoked directly, not when required by tests.
if (require.main === module) {
  run().catch((err) => {
    console.error('dedup-masterresources failed:', err);
    process.exit(1);
  });
}

#!/usr/bin/env node
/**
 * Fix script for issue #382 - masterresources duplicate lessonNames + malformed subTopics.
 *
 * Dedups the WHOLE collection on {board, class, subject, medium, lessonName, isAll} -
 * the exact key of the unique index added in master.resource.model.js. This covers
 * A3, A4, A6 (the issue's named duplicate groups) plus 2 KSEEB Kannada duplicates
 * the original audit did not list under any anomaly ID - the index rejects those too,
 * so a fix scoped to only the named anomalies leaves the index unable to build.
 * A5: drop blank entries from malformed subTopics arrays, across the whole collection
 * (not just the board/medium the original audit happened to check).
 *
 * Does NOT cover A1, A2, G1-G3 (out of scope per issue audit).
 *
 * Dry-run by default: writes what it WOULD delete/change to a JSON log and exits.
 * Pass --apply to actually delete/update. Always run --apply against a restored
 * dump first, never straight against prod. --apply runs the FK repoint and the
 * duplicate deletes inside one transaction, then calls MasterResource.syncIndexes()
 * to build the unique index now that the collection is clean (the schema has
 * autoIndex off specifically so this script controls when that index build happens).
 *
 * Usage:
 *   MONGO_URL=mongodb://... node scripts/dedup-masterresources-382.js
 *   MONGO_URL=mongodb://... node scripts/dedup-masterresources-382.js --apply
 */
'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MasterResource = require('../models/master.resource.model');
const TeacherLessonPlan = require('../models/teacher.lesson.plan.model');
const TeacherResourceFeedback = require('../models/feedback.resource.model');

// teacherlessonplans and teacherresourcefeedbacks both hold a resourceId FK into
// masterresources (see teacher.lesson.plan.model.js / feedback.resource.model.js).
// Deleting a duplicate whose _id one of these still points at would silently
// orphan that teacher's lesson plan or feedback - repoint the FK to the kept
// canonical doc before deleting, do not delete blind.

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL && require.main === module) {
  console.error('MONGO_URL env var is required');
  process.exit(1);
}

const APPLY = process.argv.includes('--apply');

// Matches the unique index in master.resource.model.js exactly. chapterId is
// deliberately NOT part of this key - two docs can share this tuple with a
// different chapterId (that IS the A4/A6 duplication) and the index rejects
// that regardless of chapterId, so dedup must too.
function groupKey(doc) {
  return [doc.board, doc.class, doc.subject, doc.medium, doc.lessonName, doc.isAll].join('|');
}

// Keep the doc with the most resource content; tie-break by oldest _id (first ingested).
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

  const subTopicFixes = await findMalformedSubTopics(); // A5 scope
  console.log(`A5: ${subTopicFixes.length} docs with malformed subTopics to normalize`);

  const deletedIds = allDeletes.map((d) => d._id);
  const planRefs = await TeacherLessonPlan.countDocuments({ resourceId: { $in: deletedIds } });
  const feedbackRefs = await TeacherResourceFeedback.countDocuments({ resourceId: { $in: deletedIds } });
  console.log(`${planRefs} teacherlessonplans and ${feedbackRefs} teacherresourcefeedbacks reference a doc about to be deleted - will be repointed to the kept canonical, not orphaned.`);

  const logPath = path.join(__dirname, `dedup-382-log-${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ deletes: allDeletes, subTopicFixes }, null, 2));
  console.log(`Wrote audit log before any write: ${logPath}`);

  if (!APPLY) {
    console.log('Dry run complete. Re-run with --apply to perform the deletes/updates above.');
    await mongoose.disconnect();
    return;
  }

  // One transaction for the whole batch: if anything fails partway (a crash,
  // a write conflict with live traffic), the repoints and the deletes all
  // roll back together instead of leaving some FKs repointed and their
  // target doc still present, or repointed FKs whose target got deleted
  // without the repoint having landed.
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
  await MasterResource.syncIndexes();

  console.log('Apply complete.');
  await mongoose.disconnect();
}

module.exports = { groupKey, pickCanonical };

// Only run against a live DB when invoked directly (`node dedup-masterresources-382.js`),
// not when required by tests for groupKey/pickCanonical.
if (require.main === module) {
  run().catch((err) => {
    console.error('dedup-masterresources-382 failed:', err);
    process.exit(1);
  });
}

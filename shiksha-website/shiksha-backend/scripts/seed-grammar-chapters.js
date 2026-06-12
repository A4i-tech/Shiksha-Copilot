#!/usr/bin/env node
/**
 * Seed script: creates grammar chapter records in MongoDB.
 *
 * For each grade (5-10) and each grammar topic in the syllabus grid,
 * it creates a Chapter document with isGrammar: true, linking to the
 * real chapter at the matching unit (orderNumber) for indexPath and
 * source-chapter titles.
 *
 * Idempotent: skips grades that already have grammar chapters.
 *
 * Usage:
 *   MONGO_URL=mongodb://... node scripts/seed-grammar-chapters.js
 */
'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Chapter = require('../models/chapter.model');

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error('MONGO_URL env var is required');
  process.exit(1);
}

// Grammar topic -> unit (orderNumber) mapping per grade.
// Copied from the existing GRAMMAR_TOPICS_BY_GRADE in question.bank.manager.js
// so the seed is self-contained and the manager constant can be removed.
const GRAMMAR_TOPICS_BY_GRADE = {
  5: {
    "Present Tense Form": 1,
    "Naming Words": 2,
    "Expressing About Self": 2,
    "Numbers": 3,
    "Past Tense Form": 4,
    "Pronouns": 5,
    "Dialogue Practice": 5,
    "Genders": 6,
    "Prepositions": 7,
    "Noun, Adjective": 8,
  },
  6: {
    "Exclamatory Sentences": 1,
    "Articles – 'a', 'an' and 'the'": 2,
    "Present Tense Forms": 2,
    "Subject-Verb Agreement": 3,
    "Regular and Irregular Verbs": 4,
    "Framing Yes/No Questions": 4,
    "Frame Wh-Questions": 5,
    "Sentence Construction": 5,
    "Adverbs": 6,
    "Past Tense Forms": 7,
    "Adding Verbs/Helping Verbs/Articles": 7,
  },
  7: {
    "Action Words and Uncountable Nouns": 1,
    "Interrogatives": 2,
    "Types of Sentences": 3,
    "Past Tense Articles": 4,
    "Adjectives Adverbs": 5,
    "Relative Pronouns": 6,
    "Prepositions": 7,
    "Present Tense": 8,
  },
  8: {
    "Determiners": 1,
    "Tense System": 2,
    "Present Continuous Form": 2,
    "Tense Past Perfect Form": 3,
    "Framing Questions": 4,
    "Prepositions": 5,
    "Degrees of Comparison": 6,
    "Reported Speech": 7,
    "Passive Voice": 8,
  },
  9: {
    "Statements – Positive and Negative Wh-Questions": 1,
    "Simple and Compound Sentences": 2,
    "Auxiliaries": 3,
    "Simple Present Tense": 4,
    "Modals, Types of Sentences – Simple, Compound and Complex": 6,
    "Modals": 8,
  },
  10: {
    "Adverbials": 1,
    "Sub+Verb Concord": 2,
    "If Clause": 3,
    "Articles/Determiners": 4,
    "Finite and Non-finite": 5,
    "Types of Sentences": 6,
    "Future Time Expression": 7,
    "Reported Speech": 8,
  },
};

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  // Grammar chapters must reference English-subject chapters only — without this
  // filter, unitMap merges chapters with the same orderNumber across all subjects
  // (math/science/social) and indexPath/grammarSourceChapters end up pointing at
  // the wrong subject's content.
  const MasterSubject = mongoose.connection.collection('mastersubjects');
  const engSubjectDocs = await MasterSubject.find(
    { $or: [{ name: /english/i }, { subjectName: /english/i }] },
    { projection: { _id: 1 } }
  ).toArray();
  const englishSubjectIds = engSubjectDocs.map((s) => s._id);
  if (englishSubjectIds.length === 0) {
    console.warn('No English subjects found in mastersubjects collection. Aborting.');
    await mongoose.disconnect();
    return;
  }
  console.log(`English subjects: ${englishSubjectIds.length}`);

  for (const [gradeStr, topicMap] of Object.entries(GRAMMAR_TOPICS_BY_GRADE)) {
    const grade = parseInt(gradeStr);

    // Idempotency: skip if grammar chapters already exist for this grade
    const existing = await Chapter.countDocuments({ standard: grade, isGrammar: true, isDeleted: false });
    if (existing > 0) {
      console.log(`Grade ${grade}: ${existing} grammar chapters already exist, skipping`);
      continue;
    }

    // Fetch real (non-grammar) English-subject chapters for this grade
    const realChapters = await Chapter.find({
      standard: grade,
      isDeleted: false,
      isGrammar: { $ne: true },
      subjectId: { $in: englishSubjectIds },
    }).lean();

    if (realChapters.length === 0) {
      console.warn(`Grade ${grade}: no real chapters found, skipping`);
      continue;
    }

    // Build nested lookup: subjectId -> orderNumber -> { indexPath, titles[], board, medium }
    // We seed grammar chapters per English-subject variant (e.g. "English", "English 2")
    // so the chapter dropdown surfaces grammar regardless of which English the teacher
    // picks, and the indexPath points to that subject's own PDF index.
    const bySubject = new Map();
    for (const ch of realChapters) {
      const unit = ch.orderNumber;
      if (!unit) continue;
      const sid = String(ch.subjectId);
      if (!bySubject.has(sid)) bySubject.set(sid, { subjectId: ch.subjectId, board: ch.board, medium: ch.medium, units: {} });
      const subj = bySubject.get(sid);
      if (!subj.units[unit]) subj.units[unit] = { indexPath: ch.indexPath || '', titles: [] };
      if (ch.topics) subj.units[unit].titles.push(ch.topics);
      if (ch.indexPath && !subj.units[unit].indexPath) {
        subj.units[unit].indexPath = ch.indexPath;
      }
    }

    const topics = Object.entries(topicMap);
    const toInsert = [];
    let perSubjectIdx = 0;

    for (const subj of bySubject.values()) {
      topics.forEach(([topicName, unitNumber], topicIdx) => {
        const unitInfo = subj.units[unitNumber];
        if (!unitInfo || !unitInfo.indexPath) {
          // Subject lacks chapters at this unit number — skip rather than create a
          // grammar record pointing at empty content.
          return;
        }
        toInsert.push({
          subjectId: subj.subjectId,
          topics: `GRAMMAR: ${topicName}`,
          subTopics: [],
          medium: subj.medium || 'English',
          standard: grade,
          board: subj.board || 'KSEEB',
          orderNumber: 9999 + perSubjectIdx * topics.length + topicIdx,
          isDeleted: false,
          isGrammar: true,
          grammarTopics: [topicName],
          grammarSourceChapters: unitInfo.titles || [],
          indexPath: unitInfo.indexPath,
          learningOutcomes: [],
          topicsLearningOutcomes: [],
        });
      });
      perSubjectIdx++;
    }

    if (toInsert.length > 0) {
      await Chapter.insertMany(toInsert);
      console.log(`Grade ${grade}: inserted ${toInsert.length} grammar chapters`);
    }
  }

  console.log('Seed complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

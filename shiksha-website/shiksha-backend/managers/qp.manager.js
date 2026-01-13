'use strict';

const path = require('path');
const fs = require('fs');
const QpDao = require('../dao/qp.dao.js');

const Chapter = require('../models/chapter.model.js');
const Question = require('../models/question.model.js');

const cleanClass = (c) => String(c || '').trim();

const getClasses = async () => {
  try {
    const classes = await QpDao.getClasses();
    return (classes || []).sort((a, b) => Number(a) - Number(b));
  } catch (err) {
    throw err;
  }
};

const getMedia = async (className) => {
  if (!className) throw new Error('Class is required');
  const normalizedClass = cleanClass(className);

  try {
    const media = await QpDao.getMedia(normalizedClass);
    return (media || []).sort();
  } catch (err) {
    throw err;
  }
};



// --- FIX: Delegate directly to DAO ---
// This ensures the "Bulletproof" logic in the DAO is used to find chapters
// by resolving IDs, names, and handling mixed data types.
const getChapters = async (className, medium, subject) => {
  try {
    const normalizedClass = cleanClass(className);
    return await QpDao.getChapters(normalizedClass, medium, subject);
  } catch (err) {
    console.error('[Manager] getChapters failed:', err);
    throw err;
  }
};

const getDifficulties = async () => {
  try {
    const diffs = await QpDao.getDifficulties();
    return (diffs || []).filter(Boolean).sort();
  } catch (err) {
    throw err;
  }
};

const getAnswerTypes = async () => {
  try {
    const types = await QpDao.getAnswerTypes();
    return (types || []).filter(Boolean).sort();
  } catch (err) {
    throw err;
  }
};

const getQuestions = async (filters) => {
  const {
    subject,
    medium,
    class: className,
    chapterNumbers,
    chapterIds, // New Filter
    marks,
    difficulty,
    type,
    search,
    headings,
  } = filters || {};

  if (!subject || !medium || !className || !chapterNumbers) {
    throw new Error('Subject, medium, class, and chapterNumbers are required');
  }

  const cleanFilters = {
    subject,
    medium,
    class: cleanClass(className),
    chapterNumbers: String(chapterNumbers || '')
      .split(',')
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n)),
    chapterIds: chapterIds ? String(chapterIds).split(',').map(id => String(id).trim()).filter(Boolean) : [],
    marks: marks === 'Any' ? undefined : marks,
    difficulty: difficulty === 'Any' ? undefined : difficulty,
    type: type === 'Any' ? undefined : type,
    search,
    headings,
  };

  try {
    return await QpDao.getQuestions(cleanFilters);
  } catch (err) {
    throw err;
  }
};

// const DOC_URL = (id) => `/PREGENERATED-qp/papers/${id}/download`;

const generateQuestionPaper = async (paperData, userDetails) => {
  const { config, questions, totalMarks } = paperData || {};
  if (!config || !Array.isArray(questions) || questions.length === 0) {
    throw new Error('Invalid paper data: config and questions are required');
  }

  const schoolName = userDetails?.school?.name || 'School Name';

  // 1. Save to Database
  const savedPaperDoc = await QpDao.saveQuestionPaper({
    teacherId: userDetails._id,
    config,
    questions,
    totalMarks,
    schoolName,
    type: 'PREGENERATED',
  });

  // 2. Convert to object if needed (optional since we aren't generating docx anymore)
  // const plainPaperData = savedPaperDoc.toObject ? savedPaperDoc.toObject() : savedPaperDoc;

  // 3. Generate File - REMOVED LEGACY DOCX GENERATION

  return {
    id: savedPaperDoc.id,
    _id: savedPaperDoc._id,
    config: savedPaperDoc.config,
    totalMarks: savedPaperDoc.totalMarks,
    schoolName: savedPaperDoc.schoolName,
    createdAt: savedPaperDoc.createdAt,
    // documentUrl: DOC_URL(savedPaperDoc.id), // Removed
  };
};

const getQuestionPaper = async (id) => {
  if (!id) throw new Error('Paper ID is required');
  const paper = await QpDao.getQuestionPaperById(id);
  if (!paper) throw new Error('Question paper not found');
  return paper;
};


// Upload logic stays in manager as it is business logic
const insertChaptersAndQuestions = async (data) => {
  const insertedChapters = [];
  const insertedQuestions = [];

  for (const entry of data || []) {
    const { class: className, medium, subject, chapterNumber, title, questions } = entry || {};

    if (!className || !medium || !subject || !title || !Array.isArray(questions)) {
      throw new Error(`Invalid entry: ${JSON.stringify(entry)}`);
    }

    let chapter = await Chapter.findOne({ class: className, medium, subject, title });
    if (!chapter) {
      chapter = await Chapter.create({ class: className, medium, subject, chapterNumber, title });
      insertedChapters.push(chapter);
    }

    for (const q of questions) {
      const question = await Question.create({
        subject,
        medium,
        class: className,
        chapterId: chapter._id,
        chapter: { chapterNumber: chapter.chapterNumber, title: chapter.title },
        groupHeading: q.groupHeading || '',
        answerType: q.answerType || '',
        difficulty: q.difficulty || '',
        marksPerQuestion: q.marksPerQuestion || 1,
        text: q.text || '',
        keyAnswer: q.keyAnswer || '',
        options: Array.isArray(q.options) ? q.options : [],
        pairs: Array.isArray(q.pairs) ? q.pairs : [],
        items: Array.isArray(q.items) ? q.items : [],
        correctOrderById: Array.isArray(q.correctOrderById) ? q.correctOrderById : [],
        correctOrderIndices: Array.isArray(q.correctOrderIndices) ? q.correctOrderIndices : [],
      });
      insertedQuestions.push(question);
    }
  }

  return {
    chaptersInserted: insertedChapters.length,
    questionsInserted: insertedQuestions.length,
    chapters: insertedChapters,
    questions: insertedQuestions,
  };
};

module.exports = {
  getClasses,
  getMedia,

  getChapters,
  getDifficulties,
  getAnswerTypes,
  getQuestions,
  generateQuestionPaper,
  getQuestionPaper,
  // generateWordDocument,
  insertChaptersAndQuestions,
};
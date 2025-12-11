'use strict';

/**
 * LBA Question Paper Manager
 * Handles business logic for LBA question paper generation and retrieval
 */
const path = require('path'); 
const lbaQpDao = require('../dao/lba.qp.dao.js');
const { buildQuestionPaperDocx } = require('../services/lba.qpaper.docx');

// These are needed for insertChaptersAndQuestions helper
const LBAChapter = require('../models/lba.chapter.model');
const LBAQuestion = require('../models/lba.question.model');

// ==========================================
// HELPER: Normalize Inputs
// ==========================================
// This ensures that even if Frontend sends Number 6, we convert to String "6"
const cleanClass = (c) => String(c || '').trim();

/** -------- Meta -------- */

const getClasses = async () => {
  console.log('[LBA-MGR] getClasses: Called');
  try {
    const classes = await lbaQpDao.getClasses();
    console.log('[LBA-MGR] getClasses: Raw Result ->', classes);
    
    // Sort numerically (6, 7, 8, 9, 10) instead of alphabetically (10, 6, 7)
    const sorted = (classes || []).sort((a, b) => Number(a) - Number(b));
    console.log('[LBA-MGR] getClasses: Sorted Result ->', sorted);
    return sorted;
  } catch (err) {
    console.error('[LBA-MGR-ERR] getClasses:', err);
    throw err;
  }
};

const getMedia = async (className) => {
  console.log(`[LBA-MGR] getMedia: Called with className="${className}" (Type: ${typeof className})`);
  
  if (!className) throw new Error('Class is required');

  // FIX: Force class to string before sending to DAO
  const normalizedClass = cleanClass(className);
  console.log(`[LBA-MGR] getMedia: Normalized Class -> "${normalizedClass}"`);

  try {
    const media = await lbaQpDao.getMedia(normalizedClass);
    console.log(`[LBA-MGR] getMedia: DAO Result for class ${normalizedClass} ->`, media);
    return (media || []).sort();
  } catch (err) {
    console.error('[LBA-MGR-ERR] getMedia:', err);
    throw err;
  }
};

const getSubjects = async (className, medium) => {
  console.log(`[LBA-MGR] getSubjects: Called with Class="${className}", Medium="${medium}"`);

  if (!className || !medium) throw new Error('Class and medium are required');

  // FIX: Normalize inputs
  const normalizedClass = cleanClass(className);
  // Optional: Capitalize medium if your DB is strict (e.g., "english" -> "English")
  // const normalizedMedium = medium.charAt(0).toUpperCase() + medium.slice(1).toLowerCase();
  
  try {
    const subjects = await lbaQpDao.getSubjects(normalizedClass, medium);
    console.log(`[LBA-MGR] getSubjects: DAO Result ->`, subjects);
    
    if (!subjects || subjects.length === 0) {
        console.warn(`[LBA-MGR-WARN] No subjects found. Check if DB has Class: "${normalizedClass}" AND Medium: "${medium}"`);
    }
    
    return (subjects || []).sort();
  } catch (err) {
    console.error('[LBA-MGR-ERR] getSubjects:', err);
    throw err;
  }
};

const getChapters = async (className, medium, subject) => {
  console.log(`[LBA-MGR] getChapters: Called with Class="${className}", Medium="${medium}", Subject="${subject}"`);

  if (!className || !medium || !subject) {
    throw new Error('Class, medium, and subject are required');
  }

  const normalizedClass = cleanClass(className);

  try {
    const chapters = await lbaQpDao.getChapters(normalizedClass, medium, subject);
    console.log(`[LBA-MGR] getChapters: Found ${chapters?.length || 0} chapters`);
    return chapters;
  } catch (err) {
    console.error('[LBA-MGR-ERR] getChapters:', err);
    throw err;
  }
};

const getDifficulties = async () => {
  try {
    const diffs = await lbaQpDao.getDifficulties();
    return (diffs || []).filter(Boolean).sort();
  } catch (err) {
    console.error('[LBA-MGR-ERR] getDifficulties:', err);
    throw err;
  }
};

const getAnswerTypes = async () => {
  try {
    const types = await lbaQpDao.getAnswerTypes();
    return (types || []).filter(Boolean).sort();
  } catch (err) {
    console.error('[LBA-MGR-ERR] getAnswerTypes:', err);
    throw err;
  }
};

/** -------- Questions -------- */

const getQuestions = async (filters) => {
  console.log('[LBA-MGR] getQuestions: Filters received ->', JSON.stringify(filters));

  const {
    subject,
    medium,
    class: className,
    chapterNumbers,
    marks,
    difficulty,
    type,
    search,
    headings, 
  } = filters || {};

  if (!subject || !medium || !className || !chapterNumbers) {
    throw new Error('Subject, medium, class, and chapterNumbers are required');
  }

  // Normalize Class here too
  const cleanFilters = {
    subject,
    medium,
    class: cleanClass(className),
    chapterNumbers: String(chapterNumbers)
      .split(',')
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n)),
    marks: marks === 'Any' ? undefined : marks,
    difficulty: difficulty === 'Any' ? undefined : difficulty,
    type: type === 'Any' ? undefined : type,
    search,
    headings,
  };

  try {
    const questions = await lbaQpDao.getQuestions(cleanFilters);
    console.log(`[LBA-MGR] getQuestions: Found ${questions?.length || 0} results`);
    return questions;
  } catch (err) {
    console.error('[LBA-MGR-ERR] getQuestions:', err);
    throw err;
  }
};

/** -------- Papers -------- */

const DOC_URL = (id) => `/api/lba-qp/papers/${id}/download`;

const generateQuestionPaper = async (paperData, userDetails) => {
  console.log('[LBA-MGR] generateQuestionPaper: Called');
  const { config, questions, totalMarks } = paperData || {};
  if (!config || !Array.isArray(questions) || questions.length === 0) {
    throw new Error('Invalid paper data: config and questions are required');
  }

  const schoolName = userDetails?.school?.name || 'School Name';

  // Persist paper
  const savedPaper = await lbaQpDao.saveQuestionPaper({
    teacherId: userDetails._id,
    config,
    questions,
    totalMarks,
    schoolName,
    type: 'LBA',
  });

  // Optionally generate the .docx now
  try {
    console.log('[LBA-MGR] generateQuestionPaper: Generating DOCX...');
    await generateWordDocument(savedPaper);
  } catch (e) {
    console.warn('[LBA-MGR-WARN] DOCX eager generation failed:', e?.message);
  }

  return {
    id: savedPaper.id,
    _id: savedPaper._id,
    config: savedPaper.config,
    totalMarks: savedPaper.totalMarks,
    schoolName: savedPaper.schoolName,
    createdAt: savedPaper.createdAt,
    documentUrl: DOC_URL(savedPaper.id),
  };
};

const generateWordDocument = async (paperData) => {
  try {
    const storageDir = path.join(__dirname, '..', 'storage', 'lba-papers');
    const url = await buildQuestionPaperDocx(paperData, storageDir);
    return url || DOC_URL(paperData._id?.toString?.() || paperData.id);
  } catch (e) {
    console.error('[LBA-MGR-ERR] Error generating Word document:', e);
    return null;
  }
};

// Stub for future persistence of document URL
const updateQuestionPaperDocument = async (_paperId, _documentUrl) => {
  return true;
};

const getQuestionPaper = async (id) => {
  if (!id) throw new Error('Paper ID is required');
  const paper = await lbaQpDao.getQuestionPaperById(id);
  if (!paper) throw new Error('Question paper not found');
  return paper;
};

/** -------- Optional helper: bulk insert (used elsewhere) -------- */

const insertChaptersAndQuestions = async (data) => {
  console.log('[LBA-MGR] insertChaptersAndQuestions: Called with entries ->', data?.length);
  const insertedChapters = [];
  const insertedQuestions = [];

  for (const entry of data || []) {
    const { class: className, medium, subject, chapterNumber, title, questions } = entry || {};

    if (!className || !medium || !subject || !title || !Array.isArray(questions)) {
      throw new Error(`Invalid entry: ${JSON.stringify(entry)}`);
    }

    // Create or find chapter
    let chapter = await LBAChapter.findOne({ class: className, medium, subject, title });
    if (!chapter) {
      chapter = await LBAChapter.create({ class: className, medium, subject, chapterNumber, title });
      insertedChapters.push(chapter);
    }

    // Insert questions
    for (const q of questions) {
      const question = await LBAQuestion.create({
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

/** -------- Feedback -------- */

const saveFeedback = async (feedbackData) => {
  return lbaQpDao.saveFeedback(feedbackData);
};

/** -------- Exports -------- */

module.exports = {
  getClasses,
  getMedia,
  getSubjects,
  getChapters,
  getDifficulties,
  getAnswerTypes,
  getQuestions,
  generateQuestionPaper,
  getQuestionPaper,
  generateWordDocument,
  saveFeedback,
  insertChaptersAndQuestions,
};
'use strict';

const path = require('path');
const fs = require('fs');
const lbaQpDao = require('../dao/lba.qp.dao.js');
const { buildQuestionPaperDocx } = require('../services/lba.qpaper.docx');

const LBAChapter = require('../models/lba.chapter.model');
const LBAQuestion = require('../models/lba.question.model');

const cleanClass = (c) => String(c || '').trim();

const getClasses = async () => {
  try {
    const classes = await lbaQpDao.getClasses();
    return (classes || []).sort((a, b) => Number(a) - Number(b));
  } catch (err) {
    throw err;
  }
};

const getMedia = async (className) => {
  if (!className) throw new Error('Class is required');
  const normalizedClass = cleanClass(className);

  try {
    const media = await lbaQpDao.getMedia(normalizedClass);
    return (media || []).sort();
  } catch (err) {
    throw err;
  }
};

const getSubjects = async (className, medium) => {
  if (!className || !medium) throw new Error('Class and medium are required');
  const normalizedClass = cleanClass(className);
  
  try {
    const subjects = await lbaQpDao.getSubjects(normalizedClass, medium);
    return (subjects || []).sort();
  } catch (err) {
    throw err;
  }
};

const getChapters = async (className, medium, subject) => {
  console.log('[DEBUG] --- Unified getChapters with Aggregation ---');
  
  try {
    const normalizedClass = cleanClass(className);
    const subjectPattern = (subject || '').replace(/[\s_]/g, '[\\s_]');

    // 1. Find the Chapters first
    const query = {
      $or: [
        { class: normalizedClass },
        { standard: normalizedClass },
        { standard: Number(normalizedClass) }
      ],
      medium: { $regex: new RegExp(`^${medium}$`, 'i') },
      subject: { $regex: new RegExp(`^${subjectPattern}$`, 'i') }
    };

    const chapters = await LBAChapter.find(query).lean();
    console.log(`[DEBUG] Found ${chapters.length} chapter documents.`);

    if (chapters.length === 0) return [];

    // 2. Get all Chapter IDs to find their headings
    const chapterIds = chapters.map(c => c._id);

    // 3. AGGREGATE HEADINGS from the LBAQuestion collection
    // This is the "Different Collection" where the headings actually live
    const questionStats = await LBAQuestion.aggregate([
      { $match: { chapterId: { $in: chapterIds } } },
      { 
        $group: { 
          _id: { chapterId: "$chapterId", heading: "$groupHeading" }, 
          count: { $sum: 1 } 
        } 
      }
    ]);

    // 4. Attach the found headings back to their respective chapters
    const chaptersWithHeadings = chapters.map(ch => {
      // Find all headings that belong to this specific chapter
      const chapterHeadings = questionStats
        .filter(stat => stat._id.chapterId.toString() === ch._id.toString())
        .map(stat => ({
          name: stat._id.heading || 'General',
          count: stat.count
        }));

      return {
        ...ch,
        topics: ch.topics || ch.title,
        headings: chapterHeadings, // <--- Headings are now injected here
        subTopics: ch.subTopics || []
      };
    });

    console.log(`[DEBUG] Processed ${chaptersWithHeadings.length} chapters with aggregated headings.`);
    return chaptersWithHeadings;

  } catch (err) {
    console.error('[DEBUG] !!! aggregation failed:', err);
    throw err;
  }
};


const getDifficulties = async () => {
  try {
    const diffs = await lbaQpDao.getDifficulties();
    return (diffs || []).filter(Boolean).sort();
  } catch (err) {
    throw err;
  }
};

const getAnswerTypes = async () => {
  try {
    const types = await lbaQpDao.getAnswerTypes();
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
    return await lbaQpDao.getQuestions(cleanFilters);
  } catch (err) {
    throw err;
  }
};

const DOC_URL = (id) => `/lba-qp/papers/${id}/download`;

const generateQuestionPaper = async (paperData, userDetails) => {
  const { config, questions, totalMarks } = paperData || {};
  if (!config || !Array.isArray(questions) || questions.length === 0) {
    throw new Error('Invalid paper data: config and questions are required');
  }

  const schoolName = userDetails?.school?.name || 'School Name';

  // 1. Save to Database
  const savedPaperDoc = await lbaQpDao.saveQuestionPaper({
    teacherId: userDetails._id,
    config,
    questions,
    totalMarks,
    schoolName,
    type: 'LBA',
  });

  // 2. CRITICAL FIX: Convert Mongoose Doc to Plain Object
  // If we pass the Mongoose doc directly, the DOCX generator crashes and writes the error stack to the file.
  const plainPaperData = savedPaperDoc.toObject ? savedPaperDoc.toObject() : savedPaperDoc;

  // 3. Generate File
  try {
    await generateWordDocument(plainPaperData);
  } catch (e) {
    console.error('DOCX Generation Error:', e);
    // Proceed so user gets the ID, but file download might fail 
  }

  return {
    id: savedPaperDoc.id,
    _id: savedPaperDoc._id,
    config: savedPaperDoc.config,
    totalMarks: savedPaperDoc.totalMarks,
    schoolName: savedPaperDoc.schoolName,
    createdAt: savedPaperDoc.createdAt,
    documentUrl: DOC_URL(savedPaperDoc.id),
  };
};

const generateWordDocument = async (paperData) => {
  try {
    const storageDir = path.join(__dirname, '..', 'storage', 'lba-papers');

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const url = await buildQuestionPaperDocx(paperData, storageDir);
    
    // Safety Check: If file is too small (e.g., < 2KB), it is likely an error message text file.
    const filename = `${paperData._id || paperData.id}.docx`;
    const filePath = path.join(storageDir, filename);
    
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size < 2000) {
            console.error(`[Warning] Generated DOCX is only ${stats.size} bytes. This usually indicates a corrupted file or an error message written to disk.`);
        }
    }

    return url || DOC_URL(paperData._id || paperData.id);
  } catch (e) {
    throw e;
  }
};

const updateQuestionPaperDocument = async (_paperId, _documentUrl) => {
  return true;
};

const getQuestionPaper = async (id) => {
  if (!id) throw new Error('Paper ID is required');
  const paper = await lbaQpDao.getQuestionPaperById(id);
  if (!paper) throw new Error('Question paper not found');
  return paper;
};

const insertChaptersAndQuestions = async (data) => {
  const insertedChapters = [];
  const insertedQuestions = [];

  for (const entry of data || []) {
    const { class: className, medium, subject, chapterNumber, title, questions } = entry || {};

    if (!className || !medium || !subject || !title || !Array.isArray(questions)) {
      throw new Error(`Invalid entry: ${JSON.stringify(entry)}`);
    }

    let chapter = await LBAChapter.findOne({ class: className, medium, subject, title });
    if (!chapter) {
      chapter = await LBAChapter.create({ class: className, medium, subject, chapterNumber, title });
      insertedChapters.push(chapter);
    }

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

const saveFeedback = async (feedbackData) => {
  return lbaQpDao.saveFeedback(feedbackData);
};

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
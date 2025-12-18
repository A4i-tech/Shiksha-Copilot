'use strict';

const path = require('path');
const fs = require('fs');

// Imports
const lbaQpManager = require('../managers/lba.qp.manager.js');
const formatApiResponse = require('../helper/response.js');
const LBAChapter = require('../models/lba.chapter.model');
const LBAQuestion = require('../models/lba.question.model');

// Constants
const STORAGE_DIR = path.join(__dirname, '..', 'storage', 'lba-papers');

// ------------------- Utility Functions ------------------- //

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeFilename(s) {
  return String(s || '').replace(/[^\w\s-]|_/g, '').replace(/\s+/g, '_').slice(0, 60);
}

function normStr(x) {
  return x == null ? '' : String(x);
}

function titleCase(s = '') {
  return s
    .replace(/\s+/g, ' ')
    .replace(/_/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normMedium(s = '') {
  s = String(s).trim();
  if (!s) return 'English';
  return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
}

function normClass(s = '') {
  const m = String(s).match(/\d+/);
  return m ? m[0] : String(s);
}

function normDifficulty(s = '') {
  s = String(s || 'average').toLowerCase();
  if (s.startsWith('eas')) return 'Easy';
  if (s.startsWith('dif')) return 'Difficult';
  return 'Average';
}

function asNum(v, fb = 1) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
}

function alpha(i) { return String.fromCharCode(65 + i); } // A, B, C...

function mapAnswerType(t = '') {
  const x = String(t).toLowerCase();
  if (x.includes('mcq')) return 'mcq';
  if (x.includes('fill')) return 'fill_in_the_blank';
  if (x.includes('one_sentence')) return 'short_answer';
  if (x.includes('short')) return 'short_answer';
  if (x.includes('long')) return 'long_answer';
  if (x.includes('match')) return 'match_pairs';
  if (x.includes('chronological') || x.includes('arrange')) return 'ordering';
  if (x.includes('word_relation') || x.includes('analogy')) return 'analogy';
  if (x.includes('map')) return 'map_based';
  return x;
}

function canonHeading(h = '') {
  const s = String(h).trim().toLowerCase();
  if (s.includes('fill')) return 'Fill in the Blanks';
  if (s.includes('one sentence')) return 'Answer in One Sentence';
  if (s.includes('match')) return 'Match the Following';
  if (s.includes('chrono') || s.includes('arrange')) return 'Arrange in Chronological Order';
  if (s.includes('word') || s.includes('relation') || s.includes('analogy')) return 'Word Relation';
  if (s.includes('2-4')) return 'Answer in 2-4 Sentences';
  if (s.includes('6')) return 'Answer in 6 Sentences';
  if (s.includes('map')) return 'Map Activity';
  if (s.includes('mcq')) return 'MCQs';
  return titleCase(h || 'General');
}

function normalizeOptions(optArr = []) {
  if (!Array.isArray(optArr)) return [];
  return optArr
    .map((o, i) => {
      if (o == null) return null;
      if (typeof o === 'string') return { label: alpha(i), text: o };
      const text = (o.text ?? '').toString().trim();
      if (!text) return null;
      const label = (o.label ?? o.key ?? alpha(i)).toString();
      return { label, text };
    })
    .filter(Boolean);
}

// ------------------- Meta Controllers ------------------- //

const getClasses = async (req, res) => {
  try {
    const result = await lbaQpManager.getClasses();
    return res.status(200).json(formatApiResponse(true, 'Classes retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getMedia = async (req, res) => {
  try {
    const { class: className } = req.query;
    const result = await lbaQpManager.getMedia(className);
    return res.status(200).json(formatApiResponse(true, 'Medium retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getSubjects = async (req, res) => {
  try {
    const { class: className, medium } = req.query;
    const result = await lbaQpManager.getSubjects(className, medium);
    return res.status(200).json(formatApiResponse(true, 'Subjects retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getChapters = async (req, res) => {
  try {
    const { class: className, medium, subject } = req.query;
    const result = await lbaQpManager.getChapters(className, medium, subject);
    return res.status(200).json(formatApiResponse(true, 'Chapters retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getDifficulties = async (req, res) => {
  try {
    const result = await lbaQpManager.getDifficulties();
    return res.status(200).json(formatApiResponse(true, 'Difficulties retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getAnswerTypes = async (req, res) => {
  try {
    const result = await lbaQpManager.getAnswerTypes();
    return res.status(200).json(formatApiResponse(true, 'Answer types retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

// ------------------- Question & Paper Controllers ------------------- //

const getQuestions = async (req, res) => {
  try {
    const filters = req.query;
    const result = await lbaQpManager.getQuestions(filters);
    return res.status(200).json(formatApiResponse(true, 'Questions retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const generateQuestionPaper = async (req, res) => {
  try {
    const paperData = req.body;
    const userDetails = req.user; 
    
    if (!userDetails) {
      return res.status(401).json(formatApiResponse(false, 'User authentication required', null));
    }
    
    const result = await lbaQpManager.generateQuestionPaper(paperData, userDetails);
    return res.status(200).json(formatApiResponse(true, 'Question paper generated successfully', result));
  } catch (error) {
    console.error('Error generating question paper:', error);
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message || 'Failed to generate question paper', null));
  }
};

const getQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await lbaQpManager.getQuestionPaper(id);
    return res.status(200).json(formatApiResponse(true, 'Question paper retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const downloadQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;
    ensureDir(STORAGE_DIR);

    const filePath = path.join(STORAGE_DIR, `${id}.docx`);

    // Helper to stream file
    const streamFile = (paper) => {
       const base = `LBA_QP_${safeFilename(paper?.config?.examName)}_${id}.docx`;
       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
       res.setHeader('Content-Disposition', `attachment; filename="${base}"`);
       return fs.createReadStream(filePath).pipe(res);
    };

    // 1. If file exists, stream it
    if (fs.existsSync(filePath)) {
      const paper = await lbaQpManager.getQuestionPaper(id).catch(() => null);
      return streamFile(paper);
    }

    // 2. If not, fetch data and generate it
    const paper = await lbaQpManager.getQuestionPaper(id);
    if (!paper) {
      return res.status(404).json(formatApiResponse(false, 'Question paper not found', null));
    }

    if (typeof lbaQpManager.generateWordDocument === 'function') {
      await lbaQpManager.generateWordDocument(paper);
    } else {
      const { buildQuestionPaperDocx } = require('../services/lba.qpaper.docx');
      await buildQuestionPaperDocx(paper, STORAGE_DIR);
    }

    // 3. Stream newly generated file
    if (fs.existsSync(filePath)) {
      return streamFile(paper);
    }

    return res.status(500).json(formatApiResponse(false, 'Failed to generate document', null));
  } catch (error) {
    console.error('downloadQuestionPaper error:', error);
    return res.status(500).json(formatApiResponse(false, 'Failed to download document', null));
  }
};

const saveFeedback = async (req, res) => {
  try {
    const { questionPaperId } = req.params;
    const feedbackData = {
      ...req.body,
      questionPaperId,
      teacherId: req.user?._id,
    };
    const result = await lbaQpManager.saveFeedback(feedbackData);
    return res.status(200).json(formatApiResponse(true, 'Feedback saved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

// ------------------- Upload Controller (Direct Mongo Access) ------------------- //

const uploadJsonFileFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatApiResponse(false, 'No file uploaded.', null));
    }

    const fileBuffer = req.file.buffer.toString('utf-8');
    const jsonData = JSON.parse(fileBuffer);

    // Normalize input: handle object or array
    const master = jsonData?.chapters ? jsonData : { chapters: jsonData };

    const className = normClass(master.class || master?.meta?.class || '');
    const medium = normMedium(master.medium || master?.meta?.medium || 'English');
    const subject = normStr(master.subject || master?.meta?.subject || 'Social Science');
    const year = normStr(master.year || master?.meta?.year || '2024-25');
    const examType = normStr(master.type || master?.meta?.type || 'LBA');

    let chapterCount = 0;
    let questionCount = 0;

    for (const ch of master.chapters || []) {
      const chapterNumber = asNum(ch.chapter_number, 0);
      const title = normStr(ch.title || '');

      // Direct Mongo Write
      const chapterDoc = await LBAChapter.create({
        class: className,
        medium,
        subject,
        chapterNumber,
        title,
        year,
        examType,
      });

      const chapterId = chapterDoc._id;
      chapterCount++;

      for (const q of ch.questions || []) {
        const groupHeading = canonHeading(q.heading || '');
        const answerType = mapAnswerType(q.type || '');
        const difficulty = normDifficulty(q.difficulty);
        const marks = asNum(q.marks_per_question, 1);

        // Case A: Items are individual questions (not MCQ/Match/Order)
        if (Array.isArray(q.items) && q.items.length && !['ordering', 'match_pairs', 'mcq'].includes(answerType)) {
          for (const it of q.items) {
            const text = typeof it === 'string' ? it : normStr(it.question || it.text || '');
            // Direct Mongo Write
            await LBAQuestion.create({
              subject,
              medium,
              class: className,
              year,
              examType,
              chapterId,
              chapter: { chapterNumber, title },
              groupHeading,
              answerType,
              difficulty,
              marksPerQuestion: marks,
              text,
              keyAnswer: normStr(it.Key_ans || ''),
              options: Array.isArray(it.options) ? normalizeOptions(it.options) : [],
            });
            questionCount++;
          }
          continue;
        }

        // Case B: Standard Question (MCQ, Match, Order, etc.)
        // Direct Mongo Write
        await LBAQuestion.create({
          subject,
          medium,
          class: className,
          year,
          examType,
          chapterId,
          chapter: { chapterNumber, title },
          groupHeading,
          answerType,
          difficulty,
          marksPerQuestion: marks,
          text: q.question || null,
          keyAnswer: q.Key_ans || null,
          options: normalizeOptions(q.options),
          pairs: Array.isArray(q.pairs) ? q.pairs : [],
          items: answerType === 'ordering' ? (Array.isArray(q.items) ? q.items : []) : [],
          correctOrderById: Array.isArray(q.Key_ans_order_by_id) ? q.Key_ans_order_by_id : [],
          correctOrderIndices: Array.isArray(q.Key_ans_order_indices) ? q.Key_ans_order_indices : [],
        });
        questionCount++;
      }
    }

    return res.status(200).json(formatApiResponse(
      true,
      `Chapters uploaded: ${chapterCount}, Questions uploaded: ${questionCount}`,
      { chapterCount, questionCount }
    ));

  } catch (error) {
    console.error('Error uploading LBA JSON:', error);
    return res.status(500).json(formatApiResponse(false, 'Internal server error.', { error: error.message }));
  }
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
  downloadQuestionPaper,
  saveFeedback,
  uploadJsonFileFromFile,
};
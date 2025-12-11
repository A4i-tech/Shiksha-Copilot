'use strict';

const BaseDao = require('./base.dao.js');
const mongoose = require('mongoose');
const LBAChapter = require('../models/lba.chapter.model');
const LBAQuestion = require('../models/lba.question.model');
const LBAQuestionPaper = require('../models/lba.question.paper.model');
const LBAFeedback = require('../models/lba.feedback.model');

// --- Helpers ---

// creates a Case-Insensitive Regex for exact matching
// e.g. "english" matches "English", "ENGLISH", "english"
const regexExact = (val) => new RegExp(`^${String(val).trim()}$`, 'i');

// Safely converts input to String (handles nulls)
const str = (val) => String(val || '').trim();

class LBAQPDao extends BaseDao {
  constructor() {
    super();
  }

  /** 
   * Get all available classes 
   * Returns: ["6", "7", "8", "9", "10"]
   */
  async getClasses() {
    return LBAChapter.distinct('class');
  }

  /** 
   * Get media options for a specific class
   * Fix: Forces class to String to match DB format
   */
  async getMedia(className) {
    // DB Query: { class: "6" }
    return LBAChapter.distinct('medium', { 
      class: str(className) 
    });
  }

  /** 
   * Get subjects for a specific class and medium
   * Fix: Uses Regex for Medium to handle "english" vs "English"
   */
  async getSubjects(className, medium) {
    return LBAChapter.distinct('subject', { 
      class: str(className), 
      medium: regexExact(medium) 
    });
  }

  /**
   * Get chapters with Heading Counts
   * Optimization: Uses Aggregation to avoid looping queries
   */
  async getChapters(className, medium, subject) {
    const classStr = str(className);
    const medRx = regexExact(medium);
    const subRx = regexExact(subject);

    // 1. Get the Chapters
    const chapters = await LBAChapter
      .find({ class: classStr, medium: medRx, subject: subRx })
      .sort({ chapterNumber: 1 })
      .lean();

    if (!chapters.length) return [];

    const chapterNumbers = chapters.map(ch => ch.chapterNumber);

    // 2. Count questions per heading for these chapters (ONE DB Call)
    const headingStats = await LBAQuestion.aggregate([
      {
        $match: {
          class: classStr,
          medium: medRx,
          subject: subRx,
          'chapter.chapterNumber': { $in: chapterNumbers }
        }
      },
      {
        $group: {
          _id: { chNum: '$chapter.chapterNumber', heading: '$groupHeading' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.chNum',
          headings: {
            $push: {
              name: { $ifNull: ['$_id.heading', 'Misc'] },
              count: '$count'
            }
          }
        }
      }
    ]);

    // 3. Map stats back to chapters
    const statsMap = new Map();
    headingStats.forEach(stat => {
      statsMap.set(stat._id, stat.headings.sort((a, b) => a.name.localeCompare(b.name)));
    });

    return chapters.map(ch => ({
      chapterNumber: ch.chapterNumber,
      title: ch.title || `Chapter ${ch.chapterNumber}`,
      _id: ch._id,
      headings: statsMap.get(ch.chapterNumber) || []
    }));
  }

  /** Get all available difficulties */
  async getDifficulties() {
    return LBAQuestion.distinct('difficulty');
  }

  /** Get all available answer types */
  async getAnswerTypes() {
    return LBAQuestion.distinct('answerType');
  }

  /**
   * Get questions based on filters
   */
  async getQuestions(filters) {
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

    const query = {
      class: str(className),
      medium: regexExact(medium),
      subject: regexExact(subject),
      'chapter.chapterNumber': { $in: Array.isArray(chapterNumbers) ? chapterNumbers : [] },
    };

    // Optional Filters
    if (headings) {
      const arr = String(headings).split(',').map(s => s.trim()).filter(Boolean);
      if (arr.length) query.groupHeading = { $in: arr }; // Case sensitive usually, unless collation set
    }

    if (marks && marks !== 'Any') {
        const m = Number(marks);
        if(!isNaN(m)) query.marksPerQuestion = m;
    }

    if (difficulty && difficulty !== 'Any') query.difficulty = difficulty;
    if (type && type !== 'Any') query.answerType = type;

    if (search) {
      const rx = new RegExp(str(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ text: rx }, { 'chapter.title': rx }];
    }

    const docs = await LBAQuestion.find(query)
      .sort({ 'chapter.chapterNumber': 1, _id: 1 })
      .lean();

    // Helper to format options safely
    const sanitizeOptions = (opts) => {
      if (!Array.isArray(opts)) return [];
      const alpha = (i) => String.fromCharCode(65 + i); // A, B, C...
      return opts.map((o, i) => {
          if (!o) return null;
          // Handle simple string options vs object options
          if (typeof o === 'string') return { label: alpha(i), text: o };
          return { label: o.label || alpha(i), text: o.text || '' };
        }).filter(o => o && o.text);
    };

    return docs.map(q => ({
      _id: q._id,
      text: q.text,
      groupHeading: q.groupHeading,
      answerType: q.answerType,
      difficulty: q.difficulty,
      marksPerQuestion: q.marksPerQuestion,
      options: sanitizeOptions(q.options),
      pairs: q.pairs || [],
      items: q.items || [],
      keyAnswer: q.keyAnswer,
      correctOrderById: q.correctOrderById || [],
      correctOrderIndices: q.correctOrderIndices || [],
      chapter: q.chapter ? {
        chapterNumber: q.chapter.chapterNumber,
        title: q.chapter.title
      } : null
    }));
  }

  /** Save question paper */
  async saveQuestionPaper(paperData) {
    const paper = new LBAQuestionPaper(paperData);
    const saved = await paper.save();
    return {
      _id: saved._id,
      id: saved._id.toString(),
      ...paperData,
      createdAt: saved.createdAt
    };
  }

  /** Get question paper by ID */
  async getQuestionPaperById(id) {
    return LBAQuestionPaper.findById(id).populate('teacherId', 'name school');
  }

  /** Save feedback */
  async saveFeedback(feedbackData) {
    const feedback = new LBAFeedback(feedbackData);
    return feedback.save();
  }
}

module.exports = new LBAQPDao();
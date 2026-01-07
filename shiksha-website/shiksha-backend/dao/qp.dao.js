'use strict';

const BaseDao = require('./base.dao.js');
const mongoose = require('mongoose');
const Chapter = require('../models/chapter.model.js');
const Question = require('../models/question.model.js');
const QuestionPaper = require('../models/question.paper.model.js');
const MasterSubject = require('../models/master.subject.model.js');

// --- Helpers ---

// Helper to capitalize words (e.g. "english" -> "English")
const toTitleCase = (str) => {
  if (!str) return '';
  return String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase();
};

const regexExact = (val) => new RegExp(`^${String(val).trim()}$`, 'i');
const str = (val) => String(val || '').trim();

class QPDao extends BaseDao {
  constructor() {
    super();
  }

  /**
   * Helper: Resolves a Subject ID to its string 'name'
   */
  async resolveSubjectName(identifier) {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const subjectDoc = await MasterSubject.findById(identifier).select('name').lean();
      return subjectDoc ? subjectDoc.name : str(identifier);
    }
    return str(identifier);
  }

  /** 
   * Get all available classes 
   */
  async getClasses() {
    let classes = await Chapter.distinct('standard'); // Try 'standard' (number) first
    
    if (!classes || classes.length === 0) {
       classes = await Chapter.distinct('class'); // Fallback to 'class' (string)
    }

    console.log(`[QP-Dao] getClasses found: ${classes.length} classes`);

    return classes
      .map(c => parseInt(c))
      .filter(n => !isNaN(n)) 
      .sort((a, b) => a - b)
      .map(String);
  }

  /** 
   * Get media options for a specific class
   */
  async getMedia(className) {
    console.log(`[QP-Dao] getMedia called for Class: ${className}`);
    const rawMedia = await Chapter.distinct('medium', { 
      $or: [
        { standard: parseInt(className) },
        { class: str(className) }
      ]
    });

    const uniqueMedia = new Set(rawMedia.map(m => toTitleCase(m)));
    return Array.from(uniqueMedia).sort();
  }

  /** 
   * Get subjects for a specific class
   */
  async getSubjects(className, medium) {
    console.log(`[QP-Dao] getSubjects called for Class: ${className}`);
    const classNum = parseInt(className);

    const subjects = await MasterSubject.find({
      isDeleted: false,
      "applicableClasses.classes": classNum
    })
    .select('subjectName name _id')
    .sort({ subjectName: 1 })
    .lean();

    // Deduplication Logic
    const uniqueMap = new Map();
    
    subjects.forEach(sub => {
      let displayName = sub.subjectName;
      // Format to Title Case if needed
      if (displayName.includes('_') || displayName === displayName.toLowerCase()) {
         displayName = displayName.split('_').map(word => toTitleCase(word)).join(' ');
      }

      const uniqueKey = displayName; 

      if (!uniqueMap.has(uniqueKey)) {
        uniqueMap.set(uniqueKey, {
          _id: sub._id,
          name: displayName,  
          code: sub.name      
        });
      }
    });

    const finalSubjects = Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    return finalSubjects;
  }

  /**
   * Get chapters 
   * FIX: Robust query handling ID mismatch and Schema differences
   */
  async getChapters(className, medium, subjectId) {
    console.log(`[QP-Dao] getChapters called. Class: ${className}, SubjectID: ${subjectId}`);
    
    // 1. Resolve Subject Logic
    let subjectCode = str(subjectId);
    let targetSubjectIds = [];

    if (mongoose.Types.ObjectId.isValid(subjectId)) {
       const subjectDoc = await MasterSubject.findById(subjectId).select('name').lean();
       if (subjectDoc) {
         subjectCode = subjectDoc.name; 
         
         // KEY FIX: Find ALL MasterSubject IDs that share this name.
         // This bridges the gap if Chapters use a different ID than the Dropdown.
         const relatedSubjects = await MasterSubject.find({ name: subjectCode }).select('_id').lean();
         targetSubjectIds = relatedSubjects.map(s => s._id);
       } else {
         // If passed ID is not in MasterSubject, use it directly (legacy orphan ID)
         targetSubjectIds = [new mongoose.Types.ObjectId(subjectId)];
       }
    }

    console.log(`[QP-Dao] Subject Name: "${subjectCode}", Related IDs: ${targetSubjectIds.join(', ')}`);

    // 2. Prepare Query Filters
    const medRx = regexExact(medium);
    const standardNum = parseInt(className); // e.g. 6
    const classStr = str(className);         // e.g. "6"

    const chapterQuery = {
      isDeleted: false,
      medium: medRx,
      $and: [
        // Handle Class: Check both 'standard' (number) and 'class' (string)
        { 
          $or: [ 
            { standard: standardNum }, 
            { class: classStr } 
          ] 
        },
        // Handle Subject: Check 'subjectId' (ObjectId list) and legacy 'subject' (string)
        {
          $or: [
            { subjectId: { $in: targetSubjectIds } },
            { subject: regexExact(subjectCode) }
          ]
        }
      ]
    };

    // 3. Execute Query
    const chapters = await Chapter
      .find(chapterQuery)
      .sort({ orderNumber: 1 }) // Using 'orderNumber' as seen in your DB sample
      .lean();

    console.log(`[QP-Dao] Chapters found: ${chapters.length}`);

    if (!chapters.length) return [];

    const chapterNumbers = chapters.map(ch => ch.orderNumber || ch.chapterNumber);

    // 4. Count questions per heading
    // Questions likely still use the String Subject Name and String Class
    const headingStats = await Question.aggregate([
      {
        $match: {
          $or: [ { class: classStr }, { standard: standardNum } ],
          medium: medRx,
          subject: regexExact(subjectCode), 
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

    // 5. Map stats back
    const statsMap = new Map();
    headingStats.forEach(stat => {
      statsMap.set(stat._id, stat.headings.sort((a, b) => a.name.localeCompare(b.name)));
    });

    return chapters.map(ch => ({
      _id: ch._id,
      // Handle legacy vs new fields
      chapterNumber: ch.orderNumber || ch.chapterNumber, 
      title: ch.topics || ch.title || `Chapter ${ch.orderNumber || ch.chapterNumber}`, 
      headings: statsMap.get(ch.orderNumber || ch.chapterNumber) || [],
      subTopics: ch.subTopics
    }));
  }

  async getDifficulties() {
    return Question.distinct('difficulty');
  }

  async getAnswerTypes() {
    return Question.distinct('answerType');
  }

  /**
   * Get questions 
   */
  async getQuestions(filters) {
    const {
      subject,
      medium,
      class: className,
      chapterNumbers,
      headings,
    } = filters || {};

    const resolvedSubjectName = await this.resolveSubjectName(subject);

    const query = {
      // Handle Mixed Class Types
      $or: [ { class: str(className) }, { standard: parseInt(className) } ],
      medium: regexExact(medium),
      subject: regexExact(resolvedSubjectName),
      'chapter.chapterNumber': { $in: Array.isArray(chapterNumbers) ? chapterNumbers : [] },
    };

    if (headings) {
      const arr = String(headings).split(',').map(s => s.trim()).filter(Boolean);
      if (arr.length) query.groupHeading = { $in: arr }; 
    }

    // Optional Filters
    if (filters.marks && filters.marks !== 'Any') {
        const m = Number(filters.marks);
        if(!isNaN(m)) query.marksPerQuestion = m;
    }
    if (filters.difficulty && filters.difficulty !== 'Any') query.difficulty = filters.difficulty;
    if (filters.type && filters.type !== 'Any') query.answerType = filters.type;
    
    if (filters.search) {
      const rx = new RegExp(str(filters.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      // Search in text OR in chapter title
      query.$or = [{ text: rx }, { 'chapter.title': rx }];
    }

    const docs = await Question.find(query)
      .sort({ 'chapter.chapterNumber': 1, _id: 1 })
      .lean();

    const sanitizeOptions = (opts) => {
      if (!Array.isArray(opts)) return [];
      const alpha = (i) => String.fromCharCode(65 + i); 
      return opts.map((o, i) => {
          if (!o) return null;
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

  async saveQuestionPaper(paperData) {
    const paper = new QuestionPaper(paperData);
    const saved = await paper.save();
    return {
      _id: saved._id,
      id: saved._id.toString(),
      ...paperData,
      createdAt: saved.createdAt
    };
  }

  async getQuestionPaperById(id) {
    return QuestionPaper.findById(id).populate('teacherId', 'name school');
  }

}

module.exports = new QPDao();
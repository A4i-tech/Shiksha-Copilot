'use strict';

const path = require('path');
const fs = require('fs');

// Imports
const QpManager = require('../managers/qp.manager.js');
const formatApiResponse = require('../helper/response.js');
const Chapter = require('../models/chapter.model.js');
const Question = require('../models/question.model.js');

// Constants
const STORAGE_DIR = path.join(__dirname, '..', 'storage', 'papers');

// ------------------- Utility Functions ------------------- //

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeFilename(s) {
  return String(s || '').replace(/[^\w\s-]|_/g, '').replace(/\s+/g, '_').slice(0, 60);
}

function normalizeOptions(optArr = []) {
  if (!Array.isArray(optArr)) return [];
  const alpha = (i) => String.fromCharCode(65 + i);
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
    const result = await QpManager.getClasses();
    return res.status(200).json(formatApiResponse(true, 'Classes retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getMedia = async (req, res) => {
  try {
    const { class: className } = req.query;
    const result = await QpManager.getMedia(className);
    return res.status(200).json(formatApiResponse(true, 'Medium retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};



const getChapters = async (req, res) => {
  try {
    const { class: className, medium, subject } = req.query;
    // Delegate to manager -> which delegates to DAO
    const result = await QpManager.getChapters(className, medium, subject);
    return res.status(200).json(formatApiResponse(true, 'Chapters retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getDifficulties = async (req, res) => {
  try {
    const result = await QpManager.getDifficulties();
    return res.status(200).json(formatApiResponse(true, 'Difficulties retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

const getAnswerTypes = async (req, res) => {
  try {
    const result = await QpManager.getAnswerTypes();
    return res.status(200).json(formatApiResponse(true, 'Answer types retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

// ------------------- Question & Paper Controllers ------------------- //

const getQuestions = async (req, res) => {
  try {
    const filters = req.query;
    const result = await QpManager.getQuestions(filters);
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

    const result = await QpManager.generateQuestionPaper(paperData, userDetails);
    return res.status(200).json(formatApiResponse(true, 'Question paper generated successfully', result));
  } catch (error) {
    console.error('Error generating question paper:', error);
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message || 'Failed to generate question paper', null));
  }
};

const getQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await QpManager.getQuestionPaper(id);
    return res.status(200).json(formatApiResponse(true, 'Question paper retrieved successfully', result));
  } catch (error) {
    return res.status(error.statusCode || 500).json(formatApiResponse(false, error.message, null));
  }
};

// downloadQuestionPaper removed


const uploadJsonFileFromFile = async (req, res) => {
  // Keep original functionality for JSON uploads
  try {
    if (!req.file) return res.status(400).json(formatApiResponse(false, 'No file uploaded.', null));

    const fileBuffer = req.file.buffer.toString('utf-8');
    const jsonData = JSON.parse(fileBuffer);
    const master = jsonData?.chapters ? jsonData : { chapters: jsonData };

    const result = await QpManager.insertChaptersAndQuestions([master]);

    return res.status(200).json(formatApiResponse(
      true,
      `Upload successful. Chapters: ${result.chaptersInserted}, Questions: ${result.questionsInserted}`,
      result
    ));

  } catch (error) {
    console.error('Error uploading JSON:', error);
    return res.status(500).json(formatApiResponse(false, 'Internal server error.', { error: error.message }));
  }
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
  // downloadQuestionPaper,
  uploadJsonFileFromFile,
};
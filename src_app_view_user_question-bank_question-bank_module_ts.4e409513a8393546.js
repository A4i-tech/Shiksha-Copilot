"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_user_question-bank_question-bank_module_ts"],{

/***/ 960:
/*!**************************************************************!*\
  !*** ./src/app/shared/services/blue-print.export.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BluePrintExportService: () => (/* binding */ BluePrintExportService)
/* harmony export */ });
/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! docx */ 35820);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! file-saver */ 85841);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utility_constant_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);





class BluePrintExportService {
  constructor(translateService) {
    this.translateService = translateService;
  }
  exportToWord(flatData, metadata) {
    const heading = new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
      text: `${this.capitalize(metadata.examinationName)} - Blueprint`,
      heading: 'Heading1',
      alignment: docx__WEBPACK_IMPORTED_MODULE_0__.AlignmentType.CENTER,
      spacing: {
        after: 200
      }
    });
    // Create simple 2-col metadata table
    const metadataRows = Object.entries(metadata).map(([key, value]) => new docx__WEBPACK_IMPORTED_MODULE_0__.TableRow({
      children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TableCell({
        children: [new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
          children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
            text: this.capitalize(key) + ':',
            bold: true
          })]
        })],
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100
        },
        width: {
          size: 30,
          type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
        }
      }), new docx__WEBPACK_IMPORTED_MODULE_0__.TableCell({
        children: [new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph(key === 'schoolName' ? value.toString() : key === 'totalMarks' ? (0,_utility_constant_util__WEBPACK_IMPORTED_MODULE_2__.formatMarks)(Number(value)) : this.capitalize(value.toString()))],
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100
        },
        width: {
          size: 70,
          type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
        }
      })]
    }));
    const metadataTable = new docx__WEBPACK_IMPORTED_MODULE_0__.Table({
      rows: metadataRows,
      width: {
        size: 50,
        type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
      },
      layout: docx__WEBPACK_IMPORTED_MODULE_0__.TableLayoutType.FIXED,
      borders: {
        top: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        bottom: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        left: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        right: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        insideHorizontal: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        insideVertical: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        }
      }
    });
    // Table Header Row
    const headerRow = new docx__WEBPACK_IMPORTED_MODULE_0__.TableRow({
      children: ['Topic', 'Type', 'Objective', 'Marks'].map(text => this.createPaddedCell(text, true))
    });
    // Data Rows
    const dataRows = flatData.map(item => new docx__WEBPACK_IMPORTED_MODULE_0__.TableRow({
      children: [this.createPaddedCell(item.unitName), this.createPaddedCell(this.translate(item.type)), this.createPaddedCell(this.translate(item.objective)), this.createPaddedCell((0,_utility_constant_util__WEBPACK_IMPORTED_MODULE_2__.formatMarks)(item.marks))]
    }));
    const dataTable = new docx__WEBPACK_IMPORTED_MODULE_0__.Table({
      rows: [headerRow, ...dataRows],
      width: {
        size: 100,
        type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
      },
      borders: {
        top: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        bottom: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        left: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        right: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        insideHorizontal: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        },
        insideVertical: {
          style: docx__WEBPACK_IMPORTED_MODULE_0__.BorderStyle.SINGLE,
          size: 1,
          color: '000000'
        }
      }
    });
    const doc = new docx__WEBPACK_IMPORTED_MODULE_0__.Document({
      sections: [{
        properties: {},
        children: [heading, new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph(''), metadataTable, new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph(''), dataTable]
      }]
    });
    const fileName = `${metadata.subject}_${metadata.class}_${metadata.examinationName}_Blueprint`;
    docx__WEBPACK_IMPORTED_MODULE_0__.Packer.toBlob(doc).then(blob => {
      (0,file_saver__WEBPACK_IMPORTED_MODULE_1__.saveAs)(blob, fileName);
    });
  }
  createPaddedCell(text, isHeader = false) {
    return new docx__WEBPACK_IMPORTED_MODULE_0__.TableCell({
      children: [new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
        children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
          text,
          bold: isHeader,
          size: 22
        })]
      })],
      margins: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      },
      width: {
        size: 25,
        type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
      }
    });
  }
  translate(value) {
    if (value == null || value === '') return '';
    return this.translateService.instant(String(value));
  }
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1').trim();
  }
  static {
    this.ɵfac = function BluePrintExportService_Factory(t) {
      return new (t || BluePrintExportService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: BluePrintExportService,
      factory: BluePrintExportService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 73298:
/*!*******************************************************************!*\
  !*** ./src/app/shared/services/question-bank-download.service.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankDownloadService: () => (/* binding */ QuestionBankDownloadService)
/* harmony export */ });
/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! docx */ 35820);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! file-saver */ 85841);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var image_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! image-size */ 40275);
/* harmony import */ var _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _docx_utility_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./docx-utility.service */ 32709);








const COLOR_ANSWER = '2E7D32';
class QuestionBankDownloadService {
  constructor(utilityService, translateService, docxUtility) {
    this.utilityService = utilityService;
    this.translateService = translateService;
    this.docxUtility = docxUtility;
  }
  /** Public method to download the Question Bank */
  downloadQuestionBank(data) {
    const children = this.buildContent(data.questionBank.questions, false, data.questionTypeLabels);
    const doc = this.createDocument(data, children, '');
    this.saveDocument(doc, `${data.subject}_QuestionBank.docx`);
  }
  /** Public method to download the Answer Key */
  downloadAnswerKey(data) {
    const children = this.buildContent(data.questionBank.questions, true, data.questionTypeLabels);
    const doc = this.createDocument(data, children, ' - ANSWER KEY');
    this.saveDocument(doc, `${data.subject}_AnswerKey.docx`);
  }
  /** Unified content builder for both Bank and Answer Key */
  buildContent(sections, showAnswers, questionTypeLabels) {
    const content = [];
    let sectionCount = 1;
    for (const section of sections) {
      const roman = this.utilityService.intToRoman(sectionCount);
      content.push(new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
        children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
          text: `${roman}. ${this.translateService.instant(questionTypeLabels[section.type] || section.type)}`,
          bold: true
        }), new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
          text: `\t${section.numberOfQuestions} X ${(0,_utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.formatMarks)(section.marksPerQuestion)} = ${(0,_utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.formatMarks)(section.numberOfQuestions * section.marksPerQuestion)}`,
          bold: true
        })],
        tabStops: [{
          type: docx__WEBPACK_IMPORTED_MODULE_0__.TabStopType.RIGHT,
          position: 9000
        }],
        spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.sectionHeader
      }));
      if (section.type === 'MATCHING') {
        content.push(this.buildMatchTable(section.questions, !showAnswers));
      } else {
        content.push(...this.buildStandardQuestions(section.questions, showAnswers));
      }
      content.push(new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
        text: ''
      }));
      sectionCount++;
    }
    return content;
  }
  /** Builds a table for Match the Following questions */
  buildMatchTable(questions, shuffle) {
    const row = (left, right, bold = false) => new docx__WEBPACK_IMPORTED_MODULE_0__.TableRow({
      children: [left, right].map(content => new docx__WEBPACK_IMPORTED_MODULE_0__.TableCell({
        width: {
          size: 50,
          type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
        },
        children: [new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
          children: bold ? [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
            text: content,
            bold: true
          })] : this.contentRuns(content),
          spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.tableCell
        })]
      }))
    });
    const left = questions.map(q => q.value1 ?? q.left ?? q.text);
    const answers = questions.map(q => q.value2 ?? q.right ?? q.keyAnswer);
    const right = shuffle ? this.utilityService.shuffleOptions([...answers]) : answers;
    const rows = left.map((value, index) => row(value, right[index]));
    if (!shuffle) rows.unshift(row('Left', 'Right (Answer)', true));
    return new docx__WEBPACK_IMPORTED_MODULE_0__.Table({
      width: {
        size: 100,
        type: docx__WEBPACK_IMPORTED_MODULE_0__.WidthType.PERCENTAGE
      },
      rows
    });
  }
  /** Builds standard questions with optional answers */
  buildStandardQuestions(questions, showAnswers) {
    const paragraphs = [];
    questions.forEach((q, index) => {
      paragraphs.push(new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
        children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
          text: `${index + 1}. `
        }), ...this.contentRuns(q.question ?? q.text)],
        spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.questionItem
      }));
      // Options render in both the standard bank and answer-key layouts so that
      // objective questions retain context alongside their answers.
      if (q.options) {
        q.options.forEach((opt, i) => {
          paragraphs.push(new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
            children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
              text: `${_utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.indent.optionLeft}${opt.label || String.fromCharCode(65 + i)}. `
            }), ...this.contentRuns(opt.text)],
            spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.optionItem
          }));
        });
      }
      if (showAnswers) {
        if (q.keyAnswer) {
          paragraphs.push(new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
            children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
              text: `   ${this.translateService.instant('Hint')}: `,
              bold: true,
              color: COLOR_ANSWER
            }), ...this.contentRuns(q.keyAnswer)],
            spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.optionItem
          }));
        }
      }
    });
    return paragraphs;
  }
  contentRuns(content) {
    if (!Array.isArray(content)) return this.docxUtility.getTextRunsWithMath(content);
    return content.flatMap(item => {
      if (item.contentType === 'text/plain') return this.docxUtility.getTextRunsWithMath(item.content);
      const type = item.contentType === 'image/jpeg' ? 'jpg' : 'png';
      const data = Uint8Array.from(atob(item.content), c => c.charCodeAt(0));
      const {
        width = 240,
        height = 160
      } = (0,image_size__WEBPACK_IMPORTED_MODULE_2__.imageSize)(data);
      return [new docx__WEBPACK_IMPORTED_MODULE_0__.ImageRun({
        type,
        data,
        transformation: {
          width: 240,
          height: 240 * height / width
        }
      })];
    });
  }
  /** Shared Document Shell */
  createDocument(data, children, subtitleSuffix) {
    let totalMarks = 0;
    for (const section of data.questionBank.questions) {
      totalMarks += Number(section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0);
    }
    return new docx__WEBPACK_IMPORTED_MODULE_0__.Document({
      sections: [{
        headers: {
          first: new docx__WEBPACK_IMPORTED_MODULE_0__.Header({
            children: [new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
              text: data.questionBank.metadata.schoolName,
              heading: docx__WEBPACK_IMPORTED_MODULE_0__.HeadingLevel.HEADING_1,
              alignment: docx__WEBPACK_IMPORTED_MODULE_0__.AlignmentType.CENTER,
              spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.sectionHeader
            }), new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
              text: `${data.examinationName}${subtitleSuffix}`,
              heading: docx__WEBPACK_IMPORTED_MODULE_0__.HeadingLevel.HEADING_2,
              alignment: docx__WEBPACK_IMPORTED_MODULE_0__.AlignmentType.CENTER,
              spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.sectionHeader
            }), new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
              children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
                text: `Subject: ${data.subject}`,
                bold: true
              }), new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
                text: `\tClass: ${data.grade}`,
                bold: true
              }), new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
                text: `\tMarks: ${(0,_utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.formatMarks)(totalMarks)}`,
                bold: true
              })],
              tabStops: [{
                type: docx__WEBPACK_IMPORTED_MODULE_0__.TabStopType.CENTER,
                position: 4500
              }, {
                type: docx__WEBPACK_IMPORTED_MODULE_0__.TabStopType.RIGHT,
                position: 9000
              }],
              spacing: _utility_constant_util__WEBPACK_IMPORTED_MODULE_3__.DOCX_CONFIG.spacing.sectionHeader
            })]
          })
        },
        footers: {
          default: new docx__WEBPACK_IMPORTED_MODULE_0__.Footer({
            children: [new docx__WEBPACK_IMPORTED_MODULE_0__.Paragraph({
              alignment: docx__WEBPACK_IMPORTED_MODULE_0__.AlignmentType.CENTER,
              children: [new docx__WEBPACK_IMPORTED_MODULE_0__.TextRun({
                children: ['Page ', docx__WEBPACK_IMPORTED_MODULE_0__.PageNumber.CURRENT]
              })]
            })]
          })
        },
        properties: {
          titlePage: true
        },
        children
      }]
    });
  }
  /** Saves the document as a blob */
  saveDocument(doc, fileName) {
    docx__WEBPACK_IMPORTED_MODULE_0__.Packer.toBlob(doc).then(blob => {
      (0,file_saver__WEBPACK_IMPORTED_MODULE_1__.saveAs)(blob, fileName);
    });
  }
  static {
    this.ɵfac = function QuestionBankDownloadService_Factory(t) {
      return new (t || QuestionBankDownloadService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_7__.TranslateService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_docx_utility_service__WEBPACK_IMPORTED_MODULE_5__.DocxUtilityService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
      token: QuestionBankDownloadService,
      factory: QuestionBankDownloadService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 30084:
/*!****************************************************!*\
  !*** ./src/app/shared/utility/math-render.util.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTexMath: () => (/* binding */ renderTexMath)
/* harmony export */ });
/* harmony import */ var _constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.util */ 64487);

const MATH_RENDER_OPTIONS = {
  delimiters: _constant_util__WEBPACK_IMPORTED_MODULE_0__.TEX_MATH_DELIMITERS,
  throwOnError: false
};
const renderTexMath = element => setTimeout(() => renderMathInElement(element, MATH_RENDER_OPTIONS));

/***/ }),

/***/ 63837:
/*!**************************************************************!*\
  !*** ./src/app/shared/utility/question-bank-display.util.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contentItems: () => (/* binding */ contentItems),
/* harmony export */   difficultyColor: () => (/* binding */ difficultyColor),
/* harmony export */   hasQuestionImage: () => (/* binding */ hasQuestionImage),
/* harmony export */   questionContentItems: () => (/* binding */ questionContentItems),
/* harmony export */   questionText: () => (/* binding */ questionText),
/* harmony export */   sourceBorderClass: () => (/* binding */ sourceBorderClass),
/* harmony export */   sourceTagClass: () => (/* binding */ sourceTagClass)
/* harmony export */ });
/* harmony import */ var _constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.util */ 64487);

function difficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'average':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'difficult':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
function sourceTagClass(source) {
  return source === _constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
}
function sourceBorderClass(source) {
  return source === _constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI ? 'border-l-blue-500' : 'border-l-green-500';
}
function contentItems(content) {
  if (content == null) return [];
  if (Array.isArray(content)) return content;
  return [{
    contentType: 'text/plain',
    content: String(content)
  }];
}
function questionContentItems(question) {
  if (question?.type === 'MATCHING') {
    return [...contentItems(question.value1), {
      contentType: 'text/plain',
      content: '-'
    }, ...contentItems(question.value2)];
  }
  return contentItems(question?.text ?? question?.question);
}
function questionText(question) {
  return questionContentItems(question).filter(item => item.contentType === 'text/plain').map(item => item.content).join(' ');
}
function hasQuestionImage(question) {
  const content = [...questionContentItems(question), ...contentItems(question?.keyAnswer), ...(question?.options || []).flatMap(option => contentItems(option?.text))];
  return content.some(item => item.contentType?.startsWith('image/'));
}

/***/ }),

/***/ 67589:
/*!*********************************************************************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-generation/question-bank-blue-print/question-bank-blue-print.component.ts ***!
  \*********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankBluePrintComponent: () => (/* binding */ QuestionBankBluePrintComponent)
/* harmony export */ });
/* harmony import */ var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/drag-drop */ 50854);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/math-render.util */ 30084);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ng2-charts */ 57839);
/* harmony import */ var _question_tags_question_tags_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../question-tags/question-tags.component */ 72815);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 90852);











const _c0 = ["bluePrintContent"];
function QuestionBankBluePrintComponent_div_26_div_14_ng_container_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](item_r11.content);
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_ng_container_10_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "img", 38);
  }
  if (rf & 2) {
    const item_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", ctx_r13.mediaSrc(item_r11), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_26_div_14_ng_container_10_span_1_Template, 2, 1, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, QuestionBankBluePrintComponent_div_26_div_14_ng_container_10_img_2_Template, 1, 1, "img", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", item_r11.contentType === "text/plain");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", item_r11.contentType !== "text/plain");
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_b_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", option_r17.label, ".");
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_ng_container_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", item_r21.content, "");
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_ng_container_2_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "img", 43);
  }
  if (rf & 2) {
    const item_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", ctx_r23.mediaSrc(item_r21), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_ng_container_2_span_1_Template, 2, 1, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_ng_container_2_img_2_Template, 1, 1, "img", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", item_r21.contentType === "text/plain");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", item_r21.contentType !== "text/plain");
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_b_1_Template, 2, 1, "b", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_ng_container_2_Template, 3, 2, "ng-container", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r17 = ctx.$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", option_r17.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r16.contentItems(option_r17.text))("ngForTrackBy", ctx_r16.trackContent);
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_26_div_14_div_12_div_1_Template, 3, 3, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const q_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", q_r7.options);
  }
}
function QuestionBankBluePrintComponent_div_26_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 26)(1, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "img", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 30)(8, "div", 31)(9, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, QuestionBankBluePrintComponent_div_26_div_14_ng_container_10_Template, 3, 2, "ng-container", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "app-question-tags", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, QuestionBankBluePrintComponent_div_26_div_14_div_12_Template, 2, 1, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const q_r7 = ctx.$implicit;
    const j_r8 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r6.sourceBorderClass(q_r7.source));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 10, "Drag to reorder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 8, "Reorder question"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", j_r8 + 1, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r6.questionContentItems(q_r7))("ngForTrackBy", ctx_r6.trackContent);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("question", q_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", q_r7.options == null ? null : q_r7.options.length);
  }
}
const _c1 = function (a0, a1) {
  return {
    count: a0,
    marks: a1
  };
};
function QuestionBankBluePrintComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 17)(1, "div", 18)(2, "div", 19)(3, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "img", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "h3", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("cdkDropListDropped", function QuestionBankBluePrintComponent_div_26_Template_div_cdkDropListDropped_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r28);
      const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r27.dropQuestion($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](14, QuestionBankBluePrintComponent_div_26_div_14_Template, 13, 12, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const group_r4 = ctx.$implicit;
    const i_r5 = ctx.index;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 10, "Drag to reorder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 8, "Reorder section"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", i_r5 + 1, ". ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](9, 12, group_r4.type), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](12, 14, "Questions x Marks", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction2"](17, _c1, group_r4.questions.length, ctx_r1.formatMarks(group_r4.marksPerQuestion))), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("cdkDropListData", group_r4.questions)("cdkDropListAutoScrollDisabled", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", group_r4.questions);
  }
}
function QuestionBankBluePrintComponent_span_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r29 = ctx.$implicit;
    const last_r30 = ctx.last;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", s_r29, "", !last_r30 ? "," : "", " ");
  }
}
function QuestionBankBluePrintComponent_div_31_canvas_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "canvas", 55);
  }
  if (rf & 2) {
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("data", ctx_r31.objectivesChartData)("options", ctx_r31.objectivesChartOptions)("legend", true)("type", "doughnut");
  }
}
function QuestionBankBluePrintComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 45)(1, "div", 46)(2, "h3", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, QuestionBankBluePrintComponent_div_31_canvas_5_Template, 1, 4, "canvas", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div", 50)(7, "div", 51)(8, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "div", 51)(14, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r3.chartTitle, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r3.objectivesChartData);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](10, 8, "Selected Questions"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.finalSelectedQuestions.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](16, 10, "Current Marks"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r3.selectedQuestionsMarks === ctx_r3.totalMarks ? "text-primary" : "text-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", ctx_r3.formatMarks(ctx_r3.selectedQuestionsMarks), " / ", ctx_r3.formatMarks(ctx_r3.totalMarks), " ");
  }
}
const _c2 = function (a0) {
  return {
    "max-h-[55vh] overflow-y-auto": a0
  };
};
class QuestionBankBluePrintComponent {
  constructor() {
    this.currentStep = 3;
    this.totalSteps = 3;
    this.fullWidth = false;
    this.totalMarks = 0;
    this.selectedQuestionsMarks = 0;
    this.examName = '';
    // Data from Parent
    this.finalSelectedQuestions = [];
    this.bluePrintChapterDropdownOptions = [];
    this.bluePrintObjectiveDropdownOptions = [];
    this.bluePrintData = [];
    this.backClick = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.generateClick = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.questionsReorder = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.contentItems = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.contentItems;
    this.questionContentItems = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.questionContentItems;
    this.sourceBorderClass = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.sourceBorderClass;
    // NEW: Dynamic Title
    this.chartTitle = 'Objective Analysis';
    this.groupedBlueprintData = [];
    /** Prevents re-rendering the drop lists while CDK is finishing a drop (leaves blank scroll space). */
    this.skipNextRebuild = false;
    this.objectivesChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: tooltipItem => {
              const value = tooltipItem.raw;
              const dataset = tooltipItem.chart.data.datasets[0];
              const total = dataset.data.reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? Math.round(value / total * 100) : 0;
              return tooltipItem.label + ': ' + percentage + '% (' + value + ')';
            }
          }
        }
      }
    };
  }
  ngOnInit() {
    this.processDataForView();
  }
  ngAfterViewInit() {
    (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__.renderTexMath)(this.bluePrintContent.nativeElement);
  }
  ngOnChanges(changes) {
    if (!changes['finalSelectedQuestions']) return;
    if (this.skipNextRebuild) {
      this.skipNextRebuild = false;
      return;
    }
    this.processDataForView();
  }
  processDataForView() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) return;
    const groups = {};
    const orderedKeys = [];
    this.finalSelectedQuestions.forEach(q => {
      const sectionName = `${q.type}:${q.marks}`;
      if (!groups[sectionName]) {
        groups[sectionName] = {
          type: q.heading,
          marksPerQuestion: q.marks,
          questions: []
        };
        orderedKeys.push(sectionName);
      }
      groups[sectionName].questions.push(q);
    });
    this.groupedBlueprintData = orderedKeys.map(key => groups[key]);
    this.updateChartData();
    if (this.bluePrintContent) (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__.renderTexMath)(this.bluePrintContent.nativeElement);
  }
  dropSection(event) {
    if (event.previousIndex === event.currentIndex) return;
    (0,_angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_5__.moveItemInArray)(this.groupedBlueprintData, event.previousIndex, event.currentIndex);
    this.emitOrder();
  }
  dropQuestion(event) {
    if (event.previousIndex === event.currentIndex) return;
    (0,_angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_5__.moveItemInArray)(event.container.data, event.previousIndex, event.currentIndex);
    this.emitOrder();
  }
  emitOrder() {
    this.skipNextRebuild = true;
    this.questionsReorder.emit(this.groupedBlueprintData.flatMap(g => g.questions));
  }
  updateChartData() {
    const chartMapper = {};
    let chartColors = [];
    this.finalSelectedQuestions.forEach(q => {
      const label = q.source === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI ? q.objective : 'Pre-generated';
      chartMapper[label] = (chartMapper[label] || 0) + 1;
    });
    this.chartTitle = 'Paper Composition Analysis';
    const labels = Object.keys(chartMapper);
    const palette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
    labels.forEach((_, i) => chartColors.push(palette[i % palette.length]));
    this.objectivesChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(chartMapper),
        backgroundColor: chartColors,
        hoverOffset: 4
      }]
    };
  }
  get uniqueSources() {
    const sources = new Set();
    this.finalSelectedQuestions.forEach(q => {
      sources.add(q.source);
    });
    return Array.from(sources);
  }
  trackContent(index) {
    return index;
  }
  mediaSrc(item) {
    return `data:${item.contentType};base64,${item.content}`;
  }
  previousStep() {
    this.backClick.emit();
  }
  static {
    this.ɵfac = function QuestionBankBluePrintComponent_Factory(t) {
      return new (t || QuestionBankBluePrintComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: QuestionBankBluePrintComponent,
      selectors: [["app-question-bank-blue-print"]],
      viewQuery: function QuestionBankBluePrintComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.bluePrintContent = _t.first);
        }
      },
      inputs: {
        currentStep: "currentStep",
        totalSteps: "totalSteps",
        fullWidth: "fullWidth",
        totalMarks: "totalMarks",
        selectedQuestionsMarks: "selectedQuestionsMarks",
        examName: "examName",
        finalSelectedQuestions: "finalSelectedQuestions",
        bluePrintChapterDropdownOptions: "bluePrintChapterDropdownOptions",
        bluePrintObjectiveDropdownOptions: "bluePrintObjectiveDropdownOptions",
        bluePrintData: "bluePrintData"
      },
      outputs: {
        backClick: "backClick",
        generateClick: "generateClick",
        questionsReorder: "questionsReorder"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵNgOnChangesFeature"]],
      decls: 32,
      vars: 30,
      consts: [[1, "p-4", "md:p-8"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "mb-6", "border-b", "pb-4"], [1, "text-xl", "font-bold", "text-content"], [1, "text-sm", "text-gray-500"], [1, "font-semibold", "text-primary"], [1, "bg-blue-50", "border", "border-blue-100", "p-3", "rounded-lg", "flex", "items-center", "gap-2", "mt-3", "md:mt-0"], ["src", "assets/icons/Info 2.svg", "alt", "info", 1, "w-5", "h-5"], [1, "text-blue-800", "font-medium"], [1, "flex", "flex-col", "lg:flex-row", "gap-8"], [1, "min-w-0", "w-full"], ["tabindex", "0", "role", "region", "aria-label", "Question list", 1, "pr-2", 3, "ngClass"], ["bluePrintContent", ""], ["cdkDropList", "", 3, "cdkDropListData", "cdkDropListAutoScrollDisabled", "cdkDropListDropped"], ["cdkDrag", "", "data-testid", "preview-section", "class", "mb-8 bg-gray-50 rounded-lg border p-4 section-drag", 4, "ngFor", "ngForOf"], [1, "mt-2", "pt-2", "border-t", "text-xs", "font-bold", "text-gray-500", "text-right"], ["class", "text-primary uppercase ml-1", 4, "ngFor", "ngForOf"], ["class", "lg:w-80 flex flex-col items-center", 4, "ngIf"], ["cdkDrag", "", "data-testid", "preview-section", 1, "mb-8", "bg-gray-50", "rounded-lg", "border", "p-4", "section-drag"], [1, "flex", "justify-between", "items-center", "border-b", "pb-2", "mb-4", "gap-2"], [1, "flex", "items-center", "gap-2", "min-w-0"], ["type", "button", "cdkDragHandle", "", 1, "drag-handle", "shrink-0", 3, "title"], ["src", "assets/icons/drag-handle.svg", "alt", "", 1, "w-4", "h-4"], ["data-testid", "preview-section-heading", 1, "font-bold", "text-lg", "text-content", "truncate"], ["data-testid", "preview-section-marks-badge", 1, "bg-primary-10", "text-primary", "px-3", "py-1", "rounded-full", "text-xs", "font-bold", "shrink-0"], ["cdkDropList", "", 1, "space-y-3", 3, "cdkDropListData", "cdkDropListAutoScrollDisabled", "cdkDropListDropped"], ["cdkDrag", "", "class", "bg-white p-3 rounded border border-l-4 flex gap-3 question-drag", 3, "ngClass", 4, "ngFor", "ngForOf"], ["cdkDrag", "", 1, "bg-white", "p-3", "rounded", "border", "border-l-4", "flex", "gap-3", "question-drag", 3, "ngClass"], ["type", "button", "cdkDragHandle", "", 1, "drag-handle", "shrink-0", "self-start", "mt-0.5", 3, "title"], ["src", "assets/icons/drag-handle.svg", "alt", "", 1, "w-3.5", "h-3.5"], [1, "text-gray-400", "font-bold", "text-sm"], [1, "flex-1", "min-w-0"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:justify-between", "sm:items-start", "mb-2"], [1, "text-sm", "text-content", "flex-1", "sm:mr-2"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "question"], ["class", "ml-4 mb-2", 4, "ngIf"], [4, "ngIf"], ["class", "mt-2 max-h-40 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-2", "max-h-40", "max-w-full", 3, "src"], [1, "ml-4", "mb-2"], ["class", "text-xs text-gray-600", 4, "ngFor", "ngForOf"], [1, "text-xs", "text-gray-600"], ["class", "mt-1 max-h-24 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-1", "max-h-24", "max-w-full", 3, "src"], [1, "text-primary", "uppercase", "ml-1"], [1, "lg:w-80", "flex", "flex-col", "items-center"], [1, "sticky", "top-0", "w-full", "bg-white", "border", "rounded-xl", "p-6", "shadow-sm"], [1, "text-center", "font-bold", "text-content", "mb-4", "uppercase", "tracking-widest", "text-xs"], [1, "h-64"], ["baseChart", "", 3, "data", "options", "legend", "type", 4, "ngIf"], [1, "mt-6", "space-y-2", "border-t", "pt-4"], [1, "flex", "justify-between", "text-sm"], [1, "text-gray-500"], [1, "font-bold"], [1, "font-bold", 3, "ngClass"], ["baseChart", "", 3, "data", "options", "legend", "type"]],
      template: function QuestionBankBluePrintComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](13, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](17, "img", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "small", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](20, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "div", 8)(22, "div", 9)(23, "div", 10, 11)(25, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("cdkDropListDropped", function QuestionBankBluePrintComponent_Template_div_cdkDropListDropped_25_listener($event) {
            return ctx.dropSection($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](26, QuestionBankBluePrintComponent_div_26_Template, 15, 20, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](29, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](30, QuestionBankBluePrintComponent_span_30_Template, 2, 2, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](31, QuestionBankBluePrintComponent_div_31_Template, 19, 12, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate4"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 16, "Step"), " ", ctx.currentStep, "/", ctx.totalSteps, ": ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](6, 18, "Preview"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](9, 20, "Exam"), ": ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.examName);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" | ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](13, 22, "Total Marks"), ": ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.formatMarks(ctx.totalMarks));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](20, 24, "Drag sections and questions to rearrange the paper order."));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](28, _c2, !ctx.fullWidth));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("cdkDropListData", ctx.groupedBlueprintData)("cdkDropListAutoScrollDisabled", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.groupedBlueprintData);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](29, 26, "Sources included"), ": ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.uniqueSources);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.fullWidth);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_5__.CdkDropList, _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_5__.CdkDrag, _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_5__.CdkDragHandle, ng2_charts__WEBPACK_IMPORTED_MODULE_7__.BaseChartDirective, _question_tags_question_tags_component__WEBPACK_IMPORTED_MODULE_3__.QuestionTagsComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslatePipe],
      styles: [".drag-handle[_ngcontent-%COMP%] {\n  cursor: grab;\n  border: none;\n  background: transparent;\n  padding: 0.15rem;\n  line-height: 0;\n  border-radius: 0.25rem;\n}\n.drag-handle[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.drag-handle[_ngcontent-%COMP%]:active {\n  cursor: grabbing;\n}\n\n.section-drag.cdk-drag-preview[_ngcontent-%COMP%], .question-drag.cdk-drag-preview[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);\n  border-radius: 0.5rem;\n  background: #fff;\n}\n\n.section-drag.cdk-drag-placeholder[_ngcontent-%COMP%], .question-drag.cdk-drag-placeholder[_ngcontent-%COMP%] {\n  opacity: 0.35;\n}\n\n.section-drag.cdk-drag-animating[_ngcontent-%COMP%], .question-drag.cdk-drag-animating[_ngcontent-%COMP%] {\n  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);\n}\n\n.cdk-drop-list-dragging[_ngcontent-%COMP%]   .section-drag[_ngcontent-%COMP%]:not(.cdk-drag-placeholder), .cdk-drop-list-dragging[_ngcontent-%COMP%]   .question-drag[_ngcontent-%COMP%]:not(.cdk-drag-placeholder) {\n  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXN0aW9uLWJhbmstYmx1ZS1wcmludC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFlBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxzQkFBQTtBQUNGO0FBQ0U7RUFDRSwrQkFBQTtBQUNKO0FBRUU7RUFDRSxnQkFBQTtBQUFKOztBQUlBOztFQUVFLHNCQUFBO0VBQ0EsMENBQUE7RUFDQSxxQkFBQTtFQUNBLGdCQUFBO0FBREY7O0FBSUE7O0VBRUUsYUFBQTtBQURGOztBQUlBOztFQUVFLHNEQUFBO0FBREY7O0FBSUE7O0VBRUUsc0RBQUE7QUFERiIsImZpbGUiOiJxdWVzdGlvbi1iYW5rLWJsdWUtcHJpbnQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZHJhZy1oYW5kbGUge1xuICBjdXJzb3I6IGdyYWI7XG4gIGJvcmRlcjogbm9uZTtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIHBhZGRpbmc6IDAuMTVyZW07XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xuXG4gICY6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4wNSk7XG4gIH1cblxuICAmOmFjdGl2ZSB7XG4gICAgY3Vyc29yOiBncmFiYmluZztcbiAgfVxufVxuXG4uc2VjdGlvbi1kcmFnLmNkay1kcmFnLXByZXZpZXcsXG4ucXVlc3Rpb24tZHJhZy5jZGstZHJhZy1wcmV2aWV3IHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYm94LXNoYWRvdzogMCA4cHggMjBweCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG4gIGJhY2tncm91bmQ6ICNmZmY7XG59XG5cbi5zZWN0aW9uLWRyYWcuY2RrLWRyYWctcGxhY2Vob2xkZXIsXG4ucXVlc3Rpb24tZHJhZy5jZGstZHJhZy1wbGFjZWhvbGRlciB7XG4gIG9wYWNpdHk6IDAuMzU7XG59XG5cbi5zZWN0aW9uLWRyYWcuY2RrLWRyYWctYW5pbWF0aW5nLFxuLnF1ZXN0aW9uLWRyYWcuY2RrLWRyYWctYW5pbWF0aW5nIHtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDIwMG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xufVxuXG4uY2RrLWRyb3AtbGlzdC1kcmFnZ2luZyAuc2VjdGlvbi1kcmFnOm5vdCguY2RrLWRyYWctcGxhY2Vob2xkZXIpLFxuLmNkay1kcm9wLWxpc3QtZHJhZ2dpbmcgLnF1ZXN0aW9uLWRyYWc6bm90KC5jZGstZHJhZy1wbGFjZWhvbGRlcikge1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMjAwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSk7XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1nZW5lcmF0aW9uL3F1ZXN0aW9uLWJhbmstYmx1ZS1wcmludC9xdWVzdGlvbi1iYW5rLWJsdWUtcHJpbnQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0Esc0JBQUE7QUFDRjtBQUNFO0VBQ0UsK0JBQUE7QUFDSjtBQUVFO0VBQ0UsZ0JBQUE7QUFBSjs7QUFJQTs7RUFFRSxzQkFBQTtFQUNBLDBDQUFBO0VBQ0EscUJBQUE7RUFDQSxnQkFBQTtBQURGOztBQUlBOztFQUVFLGFBQUE7QUFERjs7QUFJQTs7RUFFRSxzREFBQTtBQURGOztBQUlBOztFQUVFLHNEQUFBO0FBREY7QUFDQSxndURBQWd1RCIsInNvdXJjZXNDb250ZW50IjpbIi5kcmFnLWhhbmRsZSB7XG4gIGN1cnNvcjogZ3JhYjtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgcGFkZGluZzogMC4xNXJlbTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG5cbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjA1KTtcbiAgfVxuXG4gICY6YWN0aXZlIHtcbiAgICBjdXJzb3I6IGdyYWJiaW5nO1xuICB9XG59XG5cbi5zZWN0aW9uLWRyYWcuY2RrLWRyYWctcHJldmlldyxcbi5xdWVzdGlvbi1kcmFnLmNkay1kcmFnLXByZXZpZXcge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBib3gtc2hhZG93OiAwIDhweCAyMHB4IHJnYmEoMCwgMCwgMCwgMC4xMik7XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbn1cblxuLnNlY3Rpb24tZHJhZy5jZGstZHJhZy1wbGFjZWhvbGRlcixcbi5xdWVzdGlvbi1kcmFnLmNkay1kcmFnLXBsYWNlaG9sZGVyIHtcbiAgb3BhY2l0eTogMC4zNTtcbn1cblxuLnNlY3Rpb24tZHJhZy5jZGstZHJhZy1hbmltYXRpbmcsXG4ucXVlc3Rpb24tZHJhZy5jZGstZHJhZy1hbmltYXRpbmcge1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMjAwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSk7XG59XG5cbi5jZGstZHJvcC1saXN0LWRyYWdnaW5nIC5zZWN0aW9uLWRyYWc6bm90KC5jZGstZHJhZy1wbGFjZWhvbGRlciksXG4uY2RrLWRyb3AtbGlzdC1kcmFnZ2luZyAucXVlc3Rpb24tZHJhZzpub3QoLmNkay1kcmFnLXBsYWNlaG9sZGVyKSB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAyMDBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 96090:
/*!********************************************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-generation/question-bank-generation.component.ts ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankGenerationComponent: () => (/* binding */ QuestionBankGenerationComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs */ 44665);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var src_app_shared_utility_animations_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/animations.util */ 29066);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 89475);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 43143);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _question_bank_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../question-bank.service */ 69542);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/services/idle.service */ 7628);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./question-bank-template/question-bank-template.component */ 50261);
/* harmony import */ var _question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./question-bank-blue-print/question-bank-blue-print.component */ 67589);

















function QuestionBankGenerationComponent_div_8_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "div", 23);
  }
  if (rf & 2) {
    const i_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().index;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", ctx_r12.currentStep > i_r11 + 1 ? "bg-primary" : "bg-gray-300");
  }
}
const _c0 = function (a0, a1, a2) {
  return {
    "bg-primary text-white border-primary": a0,
    "bg-blue-100 text-primary border-primary": a1,
    "bg-gray-200 text-gray-400 border-gray-300": a2
  };
};
function QuestionBankGenerationComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 19)(1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, QuestionBankGenerationComponent_div_8_div_6_Template, 1, 1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r11 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("flex-1", i_r11 < ctx_r0.totalSteps - 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction3"](8, _c0, ctx_r0.currentStep > i_r11 + 1, ctx_r0.currentStep === i_r11 + 1, ctx_r0.currentStep < i_r11 + 1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](i_r11 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 6, ctx_r0.stepNames[i_r11]));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r11 < ctx_r0.totalSteps - 1);
  }
}
function QuestionBankGenerationComponent_div_13_small_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Required"));
  }
}
function QuestionBankGenerationComponent_div_13_small_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Required"));
  }
}
function QuestionBankGenerationComponent_div_13_ng_container_43_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, option_r21.info));
  }
}
function QuestionBankGenerationComponent_div_13_ng_container_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](3, QuestionBankGenerationComponent_div_13_ng_container_43_span_3_Template, 3, 3, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const option_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](option_r21.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", option_r21.info);
  }
}
const _c1 = function () {
  return {
    standalone: true
  };
};
function QuestionBankGenerationComponent_div_13_label_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "label", 53)(1, "input", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_13_label_54_Template_input_ngModelChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r27);
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r26.questionBankTypeValue = $event);
    })("change", function QuestionBankGenerationComponent_div_13_label_54_Template_input_change_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r27);
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r28.onQuestionTypeChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const type_r24 = ctx.$implicit;
    const i_r25 = ctx.index;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r17.questionBankTypeValue)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](8, _c1))("id", type_r24.name + i_r25)("value", type_r24.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("data-testid", "scope-radio-" + type_r24.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 6, type_r24.name), " ");
  }
}
function QuestionBankGenerationComponent_div_13_app_dropdown_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "app-dropdown", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_app_dropdown_57_Template_app_dropdown_valueChange_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r30);
      const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r29.onSubtopicChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r18.convertToFormControl(ctx_r18.f.subTopic))("dropDownValues", ctx_r18.subtopicsDropdownOptions)("config", ctx_r18.subTopicDropdownconfig)("submitted", ctx_r18.submittedConfig);
  }
}
function QuestionBankGenerationComponent_div_13_div_58_th_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const objective_r34 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, objective_r34.objective));
  }
}
function QuestionBankGenerationComponent_div_13_div_58_td_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td", 67)(1, "input", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_13_div_58_td_15_Template_input_ngModelChange_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r38);
      const objective_r35 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](objective_r35.percentageDistribution = $event);
    })("ngModelChange", function QuestionBankGenerationComponent_div_13_div_58_td_15_Template_input_ngModelChange_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r38);
      const i_r36 = restoredCtx.index;
      const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r39.calculateTotalPercentage(i_r36));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const objective_r35 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", objective_r35.percentageDistribution)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](2, _c1));
  }
}
function QuestionBankGenerationComponent_div_13_div_58_small_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Total distribution must equal 100%."));
  }
}
function QuestionBankGenerationComponent_div_13_div_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 56)(1, "div", 57)(2, "h2", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "button", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_13_div_58_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r41);
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r40.resetQuestionDistribution());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 60)(9, "table", 61)(10, "thead", 62)(11, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](12, QuestionBankGenerationComponent_div_13_div_58_th_12_Template, 3, 3, "th", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "tbody")(14, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, QuestionBankGenerationComponent_div_13_div_58_td_15_Template, 2, 3, "td", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](16, QuestionBankGenerationComponent_div_13_div_58_small_16_Template, 3, 3, "small", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 5, "Objectives Weightage (%)"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](7, 7, "Reset"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r19.questionBankObjectives);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r19.questionBankObjectives);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r19.totalPercentage !== 100);
  }
}
function QuestionBankGenerationComponent_div_13_div_59_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "td", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td", 67)(4, "input", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_13_div_59_tr_18_Template_input_ngModelChange_4_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r46);
      const distribution_r43 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](distribution_r43.marks = $event);
    })("ngModelChange", function QuestionBankGenerationComponent_div_13_div_59_tr_18_Template_input_ngModelChange_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r46);
      const i_r44 = restoredCtx.index;
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r47.updatePercentage(i_r44));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "td", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const distribution_r43 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](distribution_r43.unitName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", distribution_r43.marks)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](4, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", distribution_r43.percentageDistribution, "%");
  }
}
function QuestionBankGenerationComponent_div_13_div_59_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 56)(1, "h2", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div", 60)(5, "table", 61)(6, "thead", 62)(7, "tr")(8, "th", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](13, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, QuestionBankGenerationComponent_div_13_div_59_tr_18_Template, 7, 5, "tr", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 5, "Topic-wise Marks Distribution"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](10, 7, "Chapter/Topic Name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](13, 9, "Allocated Marks"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](16, 11, "Weightage %"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r20.marksDistribution);
  }
}
function QuestionBankGenerationComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "div", 24)(2, "h2", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "p", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "form", 27)(9, "div", 28)(10, "app-dropdown", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_Template_app_dropdown_valueChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r48.onBoardChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "app-dropdown", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_Template_app_dropdown_valueChange_11_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r50.onStandardChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "app-dropdown", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_Template_app_dropdown_valueChange_12_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r51.onSubjectChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 32)(14, "div")(15, "label", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](17, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](19, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](20, "input", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](21, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](22, QuestionBankGenerationComponent_div_13_small_22_Template, 3, 3, "small", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "div")(24, "label", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](26, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](28, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](29, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](30, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](31, QuestionBankGenerationComponent_div_13_small_31_Template, 3, 3, "small", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](32, "div", 32)(33, "div")(34, "label", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](36, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](37, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](38, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](39, "span", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("focus", function QuestionBankGenerationComponent_div_13_Template_span_focus_39_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r52.sourceHelpOpen = true);
    })("blur", function QuestionBankGenerationComponent_div_13_Template_span_blur_39_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r53.sourceHelpOpen = false);
    })("click", function QuestionBankGenerationComponent_div_13_Template_span_click_39_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r54.sourceHelpOpen = true);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](40, "img", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](41, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](42, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](43, QuestionBankGenerationComponent_div_13_ng_container_43_Template, 4, 2, "ng-container", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](44, "app-dropdown", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_Template_app_dropdown_valueChange_44_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r55.onSourceGenerationChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](45, "app-dropdown", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_Template_app_dropdown_valueChange_45_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r56.onLanguageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](46, "div", 45)(47, "div")(48, "label", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](50, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](51, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](52, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](53, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](54, QuestionBankGenerationComponent_div_13_label_54_Template, 4, 9, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](55, "div", 32)(56, "app-dropdown", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_13_Template_app_dropdown_valueChange_56_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r49);
      const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r57.onChapterChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](57, QuestionBankGenerationComponent_div_13_app_dropdown_57_Template, 1, 4, "app-dropdown", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](58, QuestionBankGenerationComponent_div_13_div_58_Template, 17, 9, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](59, QuestionBankGenerationComponent_div_13_div_59_Template, 19, 13, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", ctx_r1.currentStep === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 44, "Step 1/4: Question Paper Configuration"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](7, 46, "Configure the question paper here."));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx_r1.questionBankConfigForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r1.convertToFormControl(ctx_r1.f.board))("dropDownValues", ctx_r1.boardDropdownOptions)("config", ctx_r1.boardDropdownconfig)("submitted", ctx_r1.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r1.convertToFormControl(ctx_r1.f.grade))("dropDownValues", ctx_r1.classDropdownOptions)("config", ctx_r1.classDropdownconfig)("submitted", ctx_r1.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r1.convertToFormControl(ctx_r1.f.subject))("dropDownValues", ctx_r1.subjectDropdownOptions)("config", ctx_r1.subjectDropdownconfig)("submitted", ctx_r1.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](17, 48, "Examination Name"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](21, 50, "Examination Name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.submittedConfig && (ctx_r1.f.examinationName.errors == null ? null : ctx_r1.f.examinationName.errors.required));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](26, 52, "Total Marks"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](30, 54, "Total Marks"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.submittedConfig && (ctx_r1.f.totalMarks.errors == null ? null : ctx_r1.f.totalMarks.errors.required));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](36, 56, "Source"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("opacity-100", ctx_r1.sourceHelpOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](42, 58, "Source information"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r1.sourceGenerationOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r1.convertToFormControl(ctx_r1.f.sourceGeneration))("dropDownValues", ctx_r1.sourceGenerationOptions)("config", ctx_r1.sourceGenerationDropdownconfig)("submitted", ctx_r1.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r1.convertToFormControl(ctx_r1.f.language))("dropDownValues", ctx_r1.languageDropdownOptions)("config", ctx_r1.languageDropdownconfig)("submitted", ctx_r1.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](50, 60, "Scope"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r1.questionBankTypes);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownCtrl", ctx_r1.convertToFormControl(ctx_r1.f.chapter))("dropDownValues", ctx_r1.chapterDropdownOptions)("config", ctx_r1.chapterDropdownconfig)("submitted", ctx_r1.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.questionBankTypeValue === "singleChapter" && ctx_r1.hasSubtopics);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.questionBankObjectives.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.marksDistribution.length);
  }
}
function QuestionBankGenerationComponent_div_14_tr_33_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r65 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_14_tr_33_button_18_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r65);
      const i_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().index;
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r63.removeTemplateRow(i_r60));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "img", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_div_14_tr_33_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r67 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_14_tr_33_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r67);
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r66.addTemplateRow());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "img", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_div_14_tr_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r69 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr", 83)(1, "td", 84)(2, "label", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "app-dropdown", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_14_tr_33_Template_app_dropdown_ngModelChange_5_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r69);
      const row_r59 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](row_r59.type = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "td", 87)(7, "label", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "input", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_14_tr_33_Template_input_ngModelChange_10_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r69);
      const row_r59 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](row_r59.numberOfQuestions = $event);
    })("ngModelChange", function QuestionBankGenerationComponent_div_14_tr_33_Template_input_ngModelChange_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r69);
      const ctx_r71 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r71.recalculateTemplate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "td", 87)(12, "label", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "input", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_14_tr_33_Template_input_ngModelChange_15_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r69);
      const row_r59 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](row_r59.marksPerQuestion = $event);
    })("ngModelChange", function QuestionBankGenerationComponent_div_14_tr_33_Template_input_ngModelChange_15_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r69);
      const ctx_r73 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r73.recalculateTemplate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "td", 90)(17, "div", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, QuestionBankGenerationComponent_div_14_tr_33_button_18_Template, 2, 0, "button", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, QuestionBankGenerationComponent_div_14_tr_33_button_19_Template, 2, 0, "button", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const row_r59 = ctx.$implicit;
    const i_r60 = ctx.index;
    const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 13, "Question Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownValues", ctx_r58.questionTypeOptions)("config", ctx_r58.questionTypeConfig)("ngModel", row_r59.type)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](19, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](9, 15, "Number of Questions"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", row_r59.numberOfQuestions)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](20, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](14, 17, "Marks per Question"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", row_r59.marksPerQuestion)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](21, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r58.templateData.length > 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r60 === ctx_r58.templateData.length - 1);
  }
}
function QuestionBankGenerationComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r75 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 73)(1, "div", 53)(2, "img", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_14_Template_img_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r75);
      const ctx_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r74.previousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "h2", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "p", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 76)(10, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](15, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "div", 77)(17, "table", 78)(18, "thead", 79)(19, "tr")(20, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](22, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](25, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](26, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](28, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](31, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](32, "tbody", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](33, QuestionBankGenerationComponent_div_14_tr_33_Template, 20, 22, "tr", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](34, "p", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](36, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", ctx_r2.currentStep === 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 14, "Step 2/4: Question Paper Template"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](8, 16, "Customize the question paper template according to your needs."));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](12, 18, "Template"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](15, 20, "Total Marks"), ": ", ctx_r2.formatMarks(ctx_r2.totalMarks), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](22, 22, "Question Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](25, 24, "Number of Questions"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](28, 26, "Marks per Question"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](31, 28, "Action"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r2.templateData);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate3"]("[ ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](36, 30, "Total Template Marks/Total Marks"), " ]: [ ", ctx_r2.formatMarks(ctx_r2.totalTemplateMarks), "/", ctx_r2.formatMarks(ctx_r2.totalMarks), " ]");
  }
}
function QuestionBankGenerationComponent_div_15_ng_container_10_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r83 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 101)(1, "span", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 103)(4, "app-dropdown", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_15_ng_container_10_div_7_Template_app_dropdown_ngModelChange_4_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r83);
      const distribution_r80 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](distribution_r80.unitName = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 103)(6, "app-dropdown", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_15_ng_container_10_div_7_Template_app_dropdown_ngModelChange_6_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r83);
      const distribution_r80 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](distribution_r80.objective = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const distribution_r80 = ctx.$implicit;
    const j_r81 = ctx.index;
    const ctx_r79 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", j_r81 + 1, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownValues", ctx_r79.chapterOptions)("config", ctx_r79.chapterConfig)("ngModel", distribution_r80.unitName)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](9, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownValues", ctx_r79.objectiveOptions)("config", ctx_r79.objectiveConfig)("ngModel", distribution_r80.objective)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](10, _c1));
  }
}
function QuestionBankGenerationComponent_div_15_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 99)(2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, QuestionBankGenerationComponent_div_15_ng_container_10_div_7_Template, 7, 11, "div", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const block_r77 = ctx.$implicit;
    const i_r78 = ctx.index;
    const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", i_r78 + 1, ". ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 6, ctx_r76.questionTypeLabel(block_r77.type)), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate3"]("", block_r77.numberOfQuestions, " X ", ctx_r76.formatMarks(block_r77.marksPerQuestion), " = ", ctx_r76.formatMarks(block_r77.numberOfQuestions * block_r77.marksPerQuestion), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", block_r77.questionDistribution);
  }
}
function QuestionBankGenerationComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r86 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 73)(1, "div", 53)(2, "img", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_15_Template_img_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r86);
      const ctx_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r85.previousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "h2", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, QuestionBankGenerationComponent_div_15_ng_container_10_Template, 8, 8, "ng-container", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", ctx_r3.currentStep === 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 4, "Step 3/4: Blue Print"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](8, 6, "Review the blue print and generate questions."));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r3.questionBankBluePrintData);
  }
}
function QuestionBankGenerationComponent_div_16_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r90 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "app-question-bank-template", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("selectionChange", function QuestionBankGenerationComponent_div_16_div_1_Template_app_question_bank_template_selectionChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r90);
      const ctx_r89 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r89.onPickerSelectionChange($event));
    })("backClick", function QuestionBankGenerationComponent_div_16_div_1_Template_app_question_bank_template_backClick_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r90);
      const ctx_r91 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r91.pickerOpen = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r87 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("currentStep", 4)("totalSteps", 4)("totalMarks", ctx_r87.totalMarks)("availableQuestions", ctx_r87.allAvailableQuestions)("preSelectedQuestions", ctx_r87.selectedQuestions)("subject", ctx_r87.f.subject.value);
  }
}
function QuestionBankGenerationComponent_div_16_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r93 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "app-question-bank-blue-print", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("questionsReorder", function QuestionBankGenerationComponent_div_16_div_2_Template_app_question_bank_blue_print_questionsReorder_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r93);
      const ctx_r92 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r92.onPreviewReorder($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r88 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("currentStep", 4)("totalSteps", 4)("fullWidth", true)("finalSelectedQuestions", ctx_r88.finalSelectedQuestions)("examName", ctx_r88.f.examinationName.value)("totalMarks", ctx_r88.totalMarks)("selectedQuestionsMarks", ctx_r88.selectedQuestionsMarks);
  }
}
function QuestionBankGenerationComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankGenerationComponent_div_16_div_1_Template, 2, 6, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankGenerationComponent_div_16_div_2_Template, 2, 7, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r4.pickerOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r4.pickerOpen);
  }
}
function QuestionBankGenerationComponent_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r95 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_18_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r95);
      const ctx_r94 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r94.previousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Previous"));
  }
}
function QuestionBankGenerationComponent_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r97 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r97);
      const ctx_r96 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r96.onSubmit(ctx_r96.currentStep));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r6.isLoadingQuestions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 2, "Next"));
  }
}
function QuestionBankGenerationComponent_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r99 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_20_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r99);
      const ctx_r98 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r98.previewQuestions());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r7.isLoadingQuestions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 2, ctx_r7.isLoadingQuestions ? "Generating questions..." : "Preview Questions"), " ");
  }
}
function QuestionBankGenerationComponent_button_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r101 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_21_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r101);
      const ctx_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r100.togglePicker());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, ctx_r8.pickerOpen ? "Show Preview" : "Change Questions"), " ");
  }
}
function QuestionBankGenerationComponent_button_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r103 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 111);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_22_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r103);
      const ctx_r102 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r102.generateQuestionPaper());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r9.isLoadingQuestions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 2, ctx_r9.isLoadingQuestions ? "Creating question paper..." : "Generate Question Paper"), " ");
  }
}
const SOURCE_GENERATION_OPTIONS = [{
  name: src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI,
  value: 'AI',
  info: 'These are AI-generated questions based on the selected criteria.'
}, {
  name: src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA,
  value: 'LBA',
  info: 'These are LBA Questions as recommended by the educational board.'
}];
class QuestionBankGenerationComponent {
  constructor(fb, utilityservice, translateService, questionBankService, router, idleService) {
    this.fb = fb;
    this.utilityservice = utilityservice;
    this.translateService = translateService;
    this.questionBankService = questionBankService;
    this.router = router;
    this.idleService = idleService;
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.submittedConfig = false;
    this.allAvailableQuestions = [];
    this.isLoadingQuestions = false;
    this.finalSelectedQuestions = [];
    this.boardDropdownOptions = [];
    this.mediumDropdownOptions = [];
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
    this.chapterDropdownOptions = [];
    this.subtopicsDropdownOptions = [];
    this.languageDropdownOptions = [];
    this.sourceGenerationOptions = [];
    this.paperQuestionTypes = [];
    this.hasSubtopics = false;
    this.sourceHelpOpen = false;
    this.pickerOpen = false;
    this.boardDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Board',
      fieldName: 'Board',
      bindLabel: 'board',
      bindValue: 'board',
      required: true,
      clearableOff: true
    };
    this.sourceGenerationDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Source',
      fieldName: 'Source',
      bindLabel: 'name',
      bindValue: 'value',
      required: true,
      clearableOff: true,
      multi: true,
      selectAllOption: true,
      selectAllValue: 'value',
      openOnSelect: true,
      hideLabel: true
    };
    this.languageDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Translate to',
      fieldName: 'Translate to',
      info: 'The language the generated question paper will be translated into.',
      bindLabel: 'name',
      bindValue: 'value',
      required: true,
      clearableOff: true
    };
    this.classDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Class',
      fieldName: 'Class',
      bindLabel: 'class',
      bindValue: 'class',
      required: true,
      clearableOff: true
    };
    this.subjectDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Class first',
      fieldName: 'Subject',
      bindLabel: 'name',
      bindValue: 'value',
      required: true,
      clearableOff: true,
      disabled: true
    };
    this.chapterDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Subject first',
      fieldName: 'Chapter',
      bindLabel: 'topics',
      bindValue: 'topics',
      required: true,
      clearableOff: true,
      disabled: true,
      wrapValue: true
    };
    this.subTopicDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Chapter first',
      fieldName: 'Sub-Topic',
      bindLabel: 'topics',
      bindValue: 'topics',
      selectAllValue: 'topics',
      required: true,
      clearableOff: true,
      multi: true,
      selectAllOption: true,
      openOnSelect: true,
      disabled: true
    };
    this.questionTypeOptions = [];
    this.chapterOptions = [];
    this.objectiveOptions = [];
    this.questionTypeConfig = {
      isBackground: false,
      placeHolderTxt: 'Select Type',
      bindLabel: 'name',
      bindValue: 'value',
      required: true,
      clearableOff: true
    };
    this.chapterConfig = {
      isBackground: false,
      placeHolderTxt: 'Topic',
      bindLabel: 'name',
      bindValue: 'name',
      required: true,
      clearableOff: true
    };
    this.objectiveConfig = {
      isBackground: false,
      placeHolderTxt: 'Objective',
      bindLabel: 'name',
      bindValue: 'objective',
      required: true,
      clearableOff: true
    };
    this.questionBankTypes = [{
      value: 'singleChapter',
      name: 'Single Chapter'
    }, {
      value: 'multiChapter',
      name: 'Multiple Chapters'
    }];
    this.questionBankTypeValue = 'singleChapter';
    this.questionBankObjectives = [];
    this.initialQuestionBankObjectives = [];
    this.totalMarks = 0;
    this.totalPercentage = 100;
    this.totalDistributedMarks = 0;
    this.totalDistributedPercentage = 0;
    this.marksDistribution = [];
    this.currentStep = 1;
    this.totalSteps = 4;
    this.stepNames = ['Configuration', 'Template', 'Blue Print', 'Preview'];
    this.templateData = [];
    this.totalTemplateMarks = 0;
    this.selectedQuestionsMarks = 0;
    this.selectedQuestions = [];
    this.previewBlueprint = '';
    this.stepArray = Array(this.totalSteps).fill(0);
  }
  ngOnInit() {
    this.initializeForm();
    const data = localStorage.getItem('userData') ?? '';
    if (data) {
      const user = JSON.parse(data);
      this.teacherProfile = user.profiles.teacher;
      this.preferredLanguage = user.preferredLanguage;
    }
    this.getBoardsList();
    this.languageDropdownOptions = [...src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_LANGUAGE, ...src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.LOC_LANGUAGES.flatMap(item => item.value)];
    this.setPreferredLanguage();
    // Ensure initial validation state is correct
    this.updateFormValidators();
  }
  initializeForm() {
    this.questionBankConfigForm = this.fb.group({
      medium: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      board: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      sourceGeneration: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      language: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      grade: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      subject: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      chapter: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      subTopic: [null],
      totalMarks: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]],
      examinationName: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]]
    });
    this.questionBankConfigForm.get('totalMarks')?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_11__.distinctUntilChanged)()).subscribe({
      next: val => {
        this.totalMarks = Number(val);
        this.distributeMarks();
      }
    });
  }
  updateFormValidators() {
    if (this.questionBankTypeValue === 'singleChapter' && this.hasSubtopics) {
      this.f.subTopic.enable();
      this.f.subTopic.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]);
    } else {
      this.f.subTopic.clearValidators();
      this.f.subTopic.disable();
    }
    this.f.subTopic.updateValueAndValidity();
    this.f.chapter.enable();
    this.f.chapter.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_10__.Validators.required]);
    this.f.chapter.updateValueAndValidity();
  }
  onSourceGenerationChange(_selected) {
    this.distributeMarks();
  }
  get useAI() {
    const v = this.f.sourceGeneration.value;
    return (Array.isArray(v) ? v : [v]).includes('AI');
  }
  get useLBA() {
    const v = this.f.sourceGeneration.value;
    return (Array.isArray(v) ? v : [v]).includes('LBA');
  }
  convertToFormControl(absCtrl) {
    return absCtrl;
  }
  get f() {
    return this.questionBankConfigForm.controls;
  }
  getBoardsList() {
    const rawClasses = this.teacherProfile.classes;
    const uniqueBoards = new Set();
    rawClasses.forEach(c => {
      if (c.board) uniqueBoards.add(c.board);
    });
    this.boardDropdownOptions = Array.from(uniqueBoards).map(b => ({
      board: b
    }));
    this.boardDropdownconfig.disabled = this.boardDropdownOptions.length === 1;
    if (this.boardDropdownOptions.length === 1) {
      this.f.board.setValue(this.boardDropdownOptions[0].board);
      this.onBoardChange({
        board: this.boardDropdownOptions[0].board
      });
    }
  }
  onBoardChange(val) {
    this.f.medium.reset();
    this.f.grade.reset();
    this.f.subject.reset();
    this.mediumDropdownOptions = [];
    this.subjectDropdownOptions = [];
    this.classDropdownOptions = [];
    this.resetDistribution();
    if (val) {
      const boardName = val.board;
      const uniqueClasses = new Set(this.teacherProfile.classes.filter(c => c.board === boardName).map(c => c.class));
      this.classDropdownOptions = Array.from(uniqueClasses).map(c => ({
        class: String(c)
      })).sort((a, b) => parseInt(a.class) - parseInt(b.class));
      this.classDropdownconfig.disabled = this.classDropdownOptions.length === 1;
      this.questionBankService.getPaperConfig({
        board: boardName,
        grade: '',
        subjectName: ''
      }).subscribe(config => this.updateSourceOptions(config.questionSources));
      this.syncDependentDropdowns();
      if (this.classDropdownOptions.length === 1) {
        this.f.grade.setValue(this.classDropdownOptions[0].class);
        this.onStandardChange(this.classDropdownOptions[0]);
      }
      return;
    }
    this.syncDependentDropdowns();
  }
  updateSourceOptions(questionSources) {
    this.sourceGenerationOptions = SOURCE_GENERATION_OPTIONS.filter(option => questionSources.includes(String(option.value))).map(option => ({
      ...option,
      name: this.translateService.instant(String(option.name))
    }));
    this.sourceGenerationDropdownconfig.disabled = this.sourceGenerationOptions.length === 1;
    if (!this.f.sourceGeneration.value) {
      const preferred = this.sourceGenerationOptions.find(o => o.value === 'LBA') || this.sourceGenerationOptions[0];
      if (preferred) {
        this.f.sourceGeneration.setValue([preferred.value]);
        this.onSourceGenerationChange(this.f.sourceGeneration.value);
      }
      return;
    }
    const currentSelections = [].concat(this.f.sourceGeneration.value);
    const validValues = new Set(this.sourceGenerationOptions.map(opt => opt.value));
    const validSelections = currentSelections.filter(sel => validValues.has(sel));
    if (validSelections.length !== currentSelections.length) {
      this.f.sourceGeneration.setValue(validSelections);
      this.onSourceGenerationChange(validSelections);
    }
  }
  onStandardChange(val) {
    this.f.medium.reset();
    this.f.subject.reset();
    this.mediumDropdownOptions = [];
    this.subjectDropdownOptions = [];
    this.resetDistribution();
    if (val) {
      const selectedClass = val.class;
      const selectedBoard = this.f.board.value;
      const uniqueMediums = new Set();
      this.teacherProfile.classes.forEach(c => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium) {
          uniqueMediums.add(c.medium);
        }
      });
      this.mediumDropdownOptions = Array.from(uniqueMediums).map(m => ({
        medium: m,
        mediumLabel: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
      }));
    }
    this.syncDependentDropdowns();
    const medium = this.mediumDropdownOptions.find(option => option.medium === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.MEDIUMS[0].value) || this.mediumDropdownOptions[0];
    if (medium) {
      this.f.medium.setValue(medium.medium);
      this.onMediumChange(medium);
    }
  }
  onMediumChange(val) {
    this.f.subject.reset();
    this.f.language.reset();
    this.subjectDropdownOptions = [];
    this.resetDistribution();
    if (val) {
      const selectedClass = this.f.grade.value;
      const selectedBoard = this.f.board.value;
      const subjectMap = new Map();
      this.teacherProfile.classes.forEach(c => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium === val.medium && c.subject) {
          const formatted = this.formatSubjectName(c.subject);
          if (!subjectMap.has(formatted)) subjectMap.set(formatted, c.subject);
        }
      });
      this.subjectDropdownOptions = Array.from(subjectMap.entries()).map(([name, value]) => ({
        name,
        value
      })).sort((a, b) => a.name.localeCompare(b.name));
      this.setPreferredLanguage();
    }
    this.syncDependentDropdowns();
    if (this.subjectDropdownOptions.length === 1) {
      this.f.subject.setValue(this.subjectDropdownOptions[0].value);
      this.onSubjectChange(this.subjectDropdownOptions[0]);
    }
  }
  setPreferredLanguage() {
    this.f.language.setValue(this.preferredLanguage);
  }
  formatSubjectName(subject) {
    if (!subject) return '';
    // Replace underscores with spaces
    let formatted = subject.replace(/_/g, ' ');
    // Aggressively remove all trailing numbers/spaces sequences
    // e.g. "English 2 2" -> "English", "Social Science 1_1" -> "Social Science"
    formatted = formatted.replace(/(\s\d+)+$/, '');
    formatted = formatted.replace(/(_\d+)+$/, '');
    // Title Case
    return formatted.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).trim();
  }
  onSubjectChange(val) {
    this.resetSubjectChange();
    if (val) {
      const standard = this.f.grade.value;
      const medium = this.f.medium.value;
      const board = this.f.board.value;
      // Extract details from selection
      const selectedSubjectObj = this.subjectDropdownOptions.find(opt => opt.value === val.value);
      const subjectName = selectedSubjectObj.name;
      const subjectId = selectedSubjectObj.value;
      this.isLoadingQuestions = true;
      (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.forkJoin)({
        config: this.questionBankService.getPaperConfig({
          board,
          grade: String(standard),
          subjectName
        }),
        chapters: this.questionBankService.getChapters({
          class: String(standard),
          medium: medium,
          subject: subjectId
        })
      }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
        next: ({
          config,
          chapters
        }) => {
          this.paperQuestionTypes = config.questionTypes;
          this.questionBankObjectives = structuredClone(config.objectives);
          this.initialQuestionBankObjectives = structuredClone(config.objectives);
          this.updateSourceOptions(config.questionSources);
          this.chapterDropdownOptions = chapters.map(ch => ({
            ...ch,
            topics: ch.title,
            _id: ch._id,
            chapterNumber: ch.chapterNumber,
            subTopics: ch.subTopics
          })).sort((a, b) => {
            return a.chapterNumber === b.chapterNumber ? a.topics.localeCompare(b.topics) : a.chapterNumber - b.chapterNumber;
          });
          this.syncDependentDropdowns();
        },
        error: err => {
          console.error("Error fetching chapters", err);
          this.utilityservice.showError('Failed to load chapters.');
        }
      });
    } else {
      this.syncDependentDropdowns();
    }
  }
  onChapterChange(val) {
    this.distributeMarks();
    this.f.subTopic.reset();
    const toName = v => v && typeof v === 'object' ? v.topics : v;
    let selectedChapterNames = [];
    if (Array.isArray(val)) selectedChapterNames = val.map(toName);else if (val) selectedChapterNames = [toName(val)];
    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch => selectedChapterNames.includes(ch.topics));
    let combinedSubTopics = [];
    selectedChaptersFullData.forEach(ch => {
      if (ch.subTopics?.length > 0) {
        combinedSubTopics = [...combinedSubTopics, ...ch.subTopics];
      }
    });
    this.subtopicsDropdownOptions = combinedSubTopics.map(st => ({
      topics: st,
      _id: st
    }));
    this.hasSubtopics = this.subtopicsDropdownOptions.length > 0;
    this.updateFormValidators();
    this.syncDependentDropdowns();
  }
  syncDependentDropdowns() {
    const hasClass = !!this.f.grade.value;
    const hasMedium = !!this.f.medium.value;
    const hasSubject = !!this.f.subject.value;
    const chapterVal = this.f.chapter.value;
    const hasChapter = Array.isArray(chapterVal) ? chapterVal.length > 0 : !!chapterVal;
    this.subjectDropdownconfig.disabled = !hasMedium || this.subjectDropdownOptions.length === 1;
    this.subjectDropdownconfig.placeHolderTxt = hasClass ? 'Select Subject' : 'Select Class first';
    this.chapterDropdownconfig.disabled = !hasSubject;
    this.chapterDropdownconfig.placeHolderTxt = hasSubject ? 'Select Chapter' : 'Select Subject first';
    this.subTopicDropdownconfig.disabled = !hasChapter;
    this.subTopicDropdownconfig.placeHolderTxt = hasChapter ? 'Select Sub-Topic' : 'Select Chapter first';
  }
  onSubmit(step) {
    if (step === 1) this.createTemplate();
    if (step === 2) this.createBluePrint();
  }
  createTemplate() {
    this.submittedConfig = true;
    this.totalMarks = Number(this.f.totalMarks.value);
    this.distributeMarks();
    if (this.questionBankConfigForm.invalid || this.totalPercentage !== 100 || this.totalDistributedMarks !== this.totalMarks) {
      this.utilityservice.showError('Please complete the configuration and distributions.');
      return;
    }
    if (this.questionBankTypeValue === 'multiChapter' && this.f.chapter.value.length < 2) {
      this.utilityservice.showWarning('Please select at least two chapters.');
      return;
    }
    const availableTypes = this.availableQuestionTypes();
    this.questionTypeOptions = availableTypes.map(type => ({
      name: this.translateService.instant(type.label),
      value: type.key
    }));
    const rows = availableTypes.map(type => ({
      type: type.key,
      marksPerQuestion: Number(type.marksPerQuestion[0]),
      numberOfQuestions: 0,
      questionDistribution: []
    }));
    let remaining = this.totalMarks;
    while (true) {
      const row = rows.filter(item => item.marksPerQuestion <= remaining).sort((a, b) => a.numberOfQuestions * a.marksPerQuestion - b.numberOfQuestions * b.marksPerQuestion)[0];
      if (!row) break;
      row.numberOfQuestions++;
      remaining -= row.marksPerQuestion;
    }
    this.templateData = rows.filter(row => row.numberOfQuestions);
    this.recalculateTemplate();
    this.currentStep = 2;
  }
  createBluePrint() {
    if (!this.templateData.every(row => row.type && Number(row.numberOfQuestions) && Number(row.marksPerQuestion)) || this.totalTemplateMarks !== this.totalMarks) {
      this.utilityservice.showWarning('Template marks must equal the question paper marks.');
      return;
    }
    const payload = this.getTemplatePayload();
    payload.template = this.templateData;
    payload.objectiveDistribution = this.questionBankObjectives;
    this.isLoadingQuestions = true;
    this.questionBankService.generateQuestionBankBluePrint(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
      next: response => {
        this.questionBankBluePrintData = response.data;
        this.objectiveOptions = this.questionBankObjectives.map(item => ({
          objective: item.objective,
          name: this.translateService.instant(item.objective)
        }));
        this.chapterOptions = this.marksDistribution.map(item => ({
          name: item.unitName
        }));
        this.chapterConfig.disabled = this.chapterOptions.length === 1;
        this.currentStep = 3;
      },
      error: error => this.utilityservice.handleError(error)
    });
  }
  previewQuestions() {
    const blueprint = JSON.stringify(this.questionBankBluePrintData);
    if (this.selectedQuestions.length && blueprint === this.previewBlueprint) {
      this.updatePreview();
      this.currentStep = 4;
      this.pickerOpen = this.selectedQuestionsMarks !== this.totalMarks;
      return;
    }
    this.isLoadingQuestions = true;
    (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.concat)(this.useLBA ? this.fetchLBAQuestionsPool() : (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([]), this.useAI ? this.generateAIQuestionsPool() : (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([])).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.toArray)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(parts => parts.flat()), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
      next: questions => {
        this.previewBlueprint = blueprint;
        this.allAvailableQuestions = questions;
        this.selectedQuestions = this.pickToTotalMarks(questions);
        this.updatePreview();
        this.currentStep = 4;
        this.pickerOpen = this.selectedQuestionsMarks !== this.totalMarks;
      },
      error: error => this.utilityservice.handleError(error)
    });
  }
  pickToTotalMarks(pool) {
    const shuffled = this.utilityservice.shuffleOptions([...pool]);
    const used = new Set();
    const picked = [];
    for (const row of this.templateData) {
      let need = row.numberOfQuestions;
      for (const q of shuffled) {
        if (!need || used.has(q._id)) continue;
        if (q.type === row.type && Number(q.marks) === Number(row.marksPerQuestion)) {
          picked.push(q);
          used.add(q._id);
          need--;
        }
      }
    }
    let marks = picked.reduce((s, q) => s + Number(q.marks), 0);
    for (const q of shuffled.filter(q => !used.has(q._id))) {
      if (marks + Number(q.marks) > this.totalMarks) continue;
      picked.push(q);
      used.add(q._id);
      marks += Number(q.marks);
      if (marks === this.totalMarks) break;
    }
    return this.sortQuestionsByMarks(picked);
  }
  /** Default paper order: lower marks first (e.g. 5-mark questions last). */
  sortQuestionsByMarks(questions) {
    return [...questions].sort((a, b) => Number(a.marks) - Number(b.marks) || String(a.type || '').localeCompare(String(b.type || '')) || String(a.heading || '').localeCompare(String(b.heading || '')));
  }
  updatePreview() {
    this.finalSelectedQuestions = [...this.selectedQuestions];
    this.selectedQuestionsMarks = this.selectedQuestions.reduce((total, question) => total + Number(question.marks), 0);
  }
  onPickerSelectionChange(questions) {
    this.selectedQuestions = [...questions];
    this.updatePreview();
  }
  onPreviewReorder(questions) {
    this.selectedQuestions = questions;
    this.finalSelectedQuestions = [...questions];
    this.selectedQuestionsMarks = questions.reduce((total, question) => total + Number(question.marks), 0);
  }
  togglePicker() {
    this.pickerOpen = !this.pickerOpen;
    window.scrollTo(0, 0);
  }
  generateQuestionPaper() {
    this.updatePreview();
    if (this.selectedQuestionsMarks !== this.totalMarks) {
      this.utilityservice.showWarning(this.translateService.instant('Please select questions worth exactly {{marks}} marks.', {
        marks: this.totalMarks
      }));
      return;
    }
    this.generateMergedQuestionBank();
  }
  addTemplateRow() {
    this.templateData.push({
      type: null,
      numberOfQuestions: null,
      marksPerQuestion: null,
      questionDistribution: []
    });
  }
  removeTemplateRow(index) {
    this.templateData.splice(index, 1);
    this.recalculateTemplate();
  }
  recalculateTemplate() {
    this.totalTemplateMarks = this.templateData.reduce((total, row) => total + Number(row.numberOfQuestions || 0) * Number(row.marksPerQuestion || 0), 0);
  }
  questionTypeLabel(key) {
    return this.questionTypeOptions.find(item => item.value === key).name;
  }
  availableQuestionTypes() {
    const selected = Array.isArray(this.f.chapter.value) ? this.f.chapter.value : [this.f.chapter.value];
    const chapters = this.chapterDropdownOptions.filter(chapter => selected.includes(chapter.topics));
    const hasGrammar = chapters.some(chapter => chapter.isGrammar);
    const hasContent = chapters.some(chapter => !chapter.isGrammar);
    return this.paperQuestionTypes.filter(type => type.key.startsWith('GRAMMAR_') ? hasGrammar : hasContent);
  }
  generateMergedQuestionBank() {
    if (!this.finalSelectedQuestions?.length) {
      this.utilityservice.showError("No questions selected.");
      return;
    }
    this.isLoadingQuestions = true;
    const payload = this.getTemplatePayload();
    payload.isPreview = false;
    const sectionsMap = new Map();
    this.finalSelectedQuestions.forEach(q => {
      const sectionKey = `${q.type}:${Number(q.marks)}`;
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          type: q.type,
          heading: q.heading,
          marksPerQuestion: Number(q.marks),
          numberOfQuestions: 0,
          questions: []
        });
      }
      const section = sectionsMap.get(sectionKey);
      section.questions.push(q.source === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA ? this.slimLbaQuestion(q) : {
        question: q.text,
        options: q.options,
        keyAnswer: q.keyAnswer,
        marks: Number(q.marks),
        _id: q._id,
        unitName: q.unitName,
        objective: q.objective,
        value1: q.value1,
        value2: q.value2
      });
      section.numberOfQuestions = section.questions.length;
    });
    const finalSections = Array.from(sectionsMap.values());
    payload.questions = finalSections;
    payload.template = finalSections.map(s => ({
      type: s.type,
      numberOfQuestions: s.numberOfQuestions,
      marksPerQuestion: s.marksPerQuestion,
      questionDistribution: s.questions.map(q => ({
        unitName: q.unitName,
        objective: q.objective
      }))
    }));
    this.questionBankService.generateQuestionBank(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
      next: res => {
        const finalId = res.data?._id;
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/question-papers/view/${finalId}`]);
        } else {
          this.utilityservice.showError("Paper created but ID not found.");
        }
      },
      error: err => {
        this.utilityservice.showError(err?.error?.message || err?.message || 'Failed to generate paper');
      }
    });
  }
  slimLbaQuestion(q) {
    const parts = String(q._id).split('_pair_');
    return {
      _id: q._id,
      lbaQuestionId: parts[0],
      lbaPairIndex: parts[1] != null ? Number(parts[1]) : undefined,
      marks: Number(q.marks),
      unitName: q.unitName,
      objective: q.objective
    };
  }
  fetchLBAQuestionsPool() {
    const config = this.questionBankConfigForm.value;
    const titles = (Array.isArray(config.chapter) ? config.chapter : [config.chapter]).map(t => t?.topics ?? t?.title ?? t);
    const chapters = this.chapterDropdownOptions.filter(ch => titles.includes(ch.topics));
    const headings = [...new Set(chapters.flatMap(ch => (ch.headings || []).map(h => h.name).filter(Boolean)))];
    return this.questionBankService.getLBAQuestions({
      subject: config.subject,
      medium: config.medium,
      class: config.grade,
      chapterNumbers: chapters.map(c => c.chapterNumber).join(','),
      chapterIds: chapters.map(c => c._id).join(','),
      headings: headings.join(','),
      targetLanguage: config.language
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(docs => docs.map(q => ({
      ...q,
      source: src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA,
      type: q.type || q.answerType,
      marks: Number(q.marks ?? q.marksPerQuestion),
      unitName: q.unitName || q.chapter?.title
    }))));
  }
  generateAIQuestionsPool() {
    const slots = this.templateData.flatMap(row => {
      const type = this.paperQuestionTypes.find(t => t.key === row.type);
      return Array.from({
        length: Number(row.numberOfQuestions) || 0
      }, () => ({
        key: row.type,
        label: type?.label,
        marksPerQuestion: row.marksPerQuestion
      }));
    });
    if (!slots.length) return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([]);
    const payload = this.getTemplatePayload();
    payload.template = slots.map(slot => ({
      type: slot.key,
      marksPerQuestion: slot.marksPerQuestion,
      questionDistribution: []
    }));
    payload.isPreview = true;
    const headingByTypeAndMarks = new Map(slots.map(slot => [`${slot.key}:${Number(slot.marksPerQuestion)}`, slot]));
    return this.questionBankService.generateQuestionBank(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(finalRes => {
      const flatQuestions = [];
      const chapterName = Array.isArray(this.f.chapter.value) ? this.f.chapter.value[0] : this.f.chapter.value;
      finalRes.data.questions.forEach(block => {
        const blockType = block.type;
        const blockMarks = Number(block.marksPerQuestion);
        const heading = headingByTypeAndMarks.get(`${blockType}:${blockMarks}`);
        if (!heading) throw new Error(`Unexpected AI question block ${blockType}:${blockMarks}`);
        block.questions.forEach(q => {
          const typedQuestion = {
            ...q,
            type: blockType
          };
          flatQuestions.push({
            ...typedQuestion,
            source: src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI,
            text: (0,src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__.questionContentItems)(typedQuestion),
            marks: blockMarks,
            heading: heading.label,
            unitName: chapterName,
            objective: q.objective,
            value1: q.value1,
            value2: q.value2,
            _id: `ai_${Math.random().toString(36).substring(7)}`
          });
        });
      });
      return flatQuestions;
    }));
  }
  getTemplatePayload() {
    const formVal = this.questionBankConfigForm.getRawValue();
    const validChapterIds = this.getChapterIds();
    const objectiveDistribution = this.questionBankObjectives.map(obj => ({
      objective: obj?.objective,
      percentageDistribution: Number(obj?.percentageDistribution)
    })).filter(obj => !!obj.objective);
    const selectedSubjectObj = this.subjectDropdownOptions.find(opt => opt.value === formVal.subject);
    const subjectName = selectedSubjectObj ? selectedSubjectObj.name : formVal.subject;
    let subTopicsPayload = [];
    const rawSubTopics = formVal.subTopic ? Array.isArray(formVal.subTopic) ? formVal.subTopic : [formVal.subTopic] : [];
    if (rawSubTopics.length > 0) {
      subTopicsPayload = rawSubTopics; // Use user selection (whether text or ID)
    } else {
      subTopicsPayload = Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter];
    }
    return {
      board: formVal.board,
      medium: formVal.medium,
      language: formVal.language,
      grade: String(formVal.grade),
      subject: subjectName,
      totalMarks: Number(formVal.totalMarks),
      surplus: true,
      examinationName: formVal.examinationName,
      chapter: Array.isArray(formVal.chapter) ? formVal.chapter : [formVal.chapter],
      chapterIds: validChapterIds,
      subTopic: subTopicsPayload,
      isMultiChapter: this.questionBankTypeValue === 'multiChapter',
      unitLevel: this.questionBankTypeValue === 'singleChapter' && this.hasSubtopics ? 'SUBTOPIC' : 'CHAPTER',
      marksDistribution: this.marksDistribution.map(d => ({
        unitName: d.unitName,
        marks: Number(d.marks),
        percentageDistribution: Number(d.percentageDistribution)
      })),
      template: [],
      objectiveDistribution
    };
  }
  getChapterIds() {
    const selected = this.f.chapter.value;
    if (!selected) return [];
    const selectedArr = Array.isArray(selected) ? selected : [selected];
    const ids = selectedArr.map(topicName => {
      const found = this.chapterDropdownOptions.find(c => c.topics === topicName);
      return found && found._id ? String(found._id) : null;
    }).filter(id => id !== null && id !== '');
    return ids.filter(id => /^[a-fA-F0-9]{24}$/.test(String(id)));
  }
  onLanguageChange(_val) {}
  onSubtopicChange() {
    this.distributeMarks();
  }
  distributeMarks() {
    const subtopics = this.f.subTopic.value;
    const rawUnits = this.questionBankTypeValue === 'multiChapter' ? this.f.chapter.value : subtopics?.length ? subtopics : this.f.chapter.value;
    const units = Array.isArray(rawUnits) ? rawUnits : rawUnits ? [rawUnits] : [];
    if (!this.totalMarks || !units.length) {
      this.marksDistribution = [];
      this.totalDistributedMarks = 0;
      this.totalDistributedPercentage = 0;
      return;
    }
    const base = Math.floor(this.totalMarks / units.length);
    const remainder = this.totalMarks % units.length;
    this.marksDistribution = units.map((unit, index) => ({
      unitName: unit,
      marks: base + (index < remainder ? 1 : 0),
      percentageDistribution: Math.round((base + (index < remainder ? 1 : 0)) * 100 / this.totalMarks)
    }));
    this.calculateTotalDistribution();
  }
  updatePercentage(i) {
    const marks = Number(this.marksDistribution[i].marks);
    this.marksDistribution[i].marks = marks;
    this.marksDistribution[i].percentageDistribution = Math.round(marks * 100 / this.totalMarks);
    this.calculateTotalDistribution();
  }
  calculateTotalDistribution() {
    this.totalDistributedMarks = this.marksDistribution.reduce((acc, c) => acc + c.marks, 0);
    this.totalDistributedPercentage = Math.round(this.totalDistributedMarks * 100 / this.totalMarks);
  }
  calculateTotalPercentage(i) {
    this.totalPercentage = this.questionBankObjectives.reduce((acc, obj) => acc + Number(obj.percentageDistribution), 0);
  }
  resetQuestionDistribution() {
    this.questionBankObjectives = structuredClone(this.initialQuestionBankObjectives);
    this.calculateTotalPercentage(null);
    this.distributeMarks();
  }
  resetDistribution() {
    this.f.chapter.reset();
    this.f.subTopic.reset();
    this.chapterDropdownOptions = [];
    this.subtopicsDropdownOptions = [];
    this.hasSubtopics = false;
    this.marksDistribution = [];
    this.questionBankObjectives = [];
    this.initialQuestionBankObjectives = [];
    this.paperQuestionTypes = [];
    this.syncDependentDropdowns();
  }
  resetSubjectChange() {
    this.resetDistribution();
  }
  onQuestionTypeChange() {
    const currentVal = this.f.chapter.value;
    // Clear subtopic initially
    this.f.subTopic.reset();
    if (this.questionBankTypeValue === 'singleChapter') {
      // --- SINGLE MODE ---
      this.chapterDropdownconfig = {
        ...this.chapterDropdownconfig,
        multi: false,
        openOnSelect: false
      };
      // Convert Array -> Single value if needed
      if (Array.isArray(currentVal) && currentVal.length > 0) {
        const first = currentVal[0];
        this.f.chapter.setValue(first);
        this.onChapterChange(first); // LOAD SUBTOPICS NOW
      } else if (currentVal && !Array.isArray(currentVal)) {
        this.onChapterChange(currentVal); // LOAD SUBTOPICS NOW
      } else {
        this.f.chapter.reset();
        this.subtopicsDropdownOptions = [];
      }
    } else {
      // --- MULTI MODE ---
      this.chapterDropdownconfig = {
        ...this.chapterDropdownconfig,
        multi: true,
        openOnSelect: true
      };
      // Convert Single -> Array value if needed
      if (currentVal && !Array.isArray(currentVal)) {
        const arr = [currentVal];
        this.f.chapter.setValue(arr);
        this.onChapterChange(arr);
      } else if (Array.isArray(currentVal)) {
        this.onChapterChange(currentVal);
      } else {
        this.f.chapter.reset();
        this.subtopicsDropdownOptions = [];
      }
    }
    this.updateFormValidators();
    this.syncDependentDropdowns();
  }
  backNavigation() {
    this.router.navigate(['/question-papers']);
  }
  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
  ngOnDestroy() {
    this.idleService.resetIdler();
  }
  static {
    this.ɵfac = function QuestionBankGenerationComponent_Factory(t) {
      return new (t || QuestionBankGenerationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__.TranslateService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_question_bank_service__WEBPACK_IMPORTED_MODULE_4__.QuestionBankService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_19__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_5__.IdleService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: QuestionBankGenerationComponent,
      selectors: [["app-question-bank-generation"]],
      decls: 23,
      vars: 17,
      consts: [[1, "rounded-sm", "bg-shade-50", "p-4", "md:py-0", "md:px-2"], [1, "flex", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "Back", 1, "cursor-pointer", 3, "click"], [1, "text-xl", "md:text-3xl", "font-bold", "text-content", "leading-[48px]"], [1, "bg-primary-30", "px-2", "py-4", "md:px-4", "rounded-t", "border", "mt-0", "md:mt-4"], [1, "flex", "items-center", "w-full", "gap-2", "md:gap-4"], ["class", "flex items-center gap-2 min-w-0", 3, "flex-1", 4, "ngFor", "ngForOf"], ["aria-live", "polite", "aria-atomic", "true", "id", "step-announcement", 1, "sr-only"], [1, "rounded-b", "bg-white", "border", "border-t-0", "pb-4"], [3, "ngSwitch"], [4, "ngSwitchCase"], ["class", "p-4 md:p-8", 4, "ngSwitchCase"], ["class", "bg-white", 4, "ngSwitchCase"], [1, "flex", "justify-end", "gap-2", "py-4"], ["class", "btn-outline-primary px-6 py-2", 3, "click", 4, "ngIf"], ["data-testid", "wizard-next-btn", "class", "btn-primary px-8 py-2", 3, "disabled", "click", 4, "ngIf"], ["data-testid", "preview-questions", "class", "btn-primary px-8 py-2", 3, "disabled", "click", 4, "ngIf"], ["data-testid", "toggle-picker-preview-btn", "class", "btn-outline-primary px-6 py-2", 3, "click", 4, "ngIf"], ["data-testid", "generate-final-question-paper-btn", "class", "btn-primary px-8 py-2", 3, "disabled", "click", 4, "ngIf"], [1, "flex", "items-center", "gap-2", "min-w-0"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "border-2", "transition-all", "duration-300", 3, "ngClass"], [1, "hidden", "lg:block", "font-semibold", "text-content"], ["class", "flex-1 min-w-4 h-1 ml-1", 3, "ngClass", 4, "ngIf"], [1, "flex-1", "min-w-4", "h-1", "ml-1", 3, "ngClass"], [1, "px-4", "pt-4", "md:px-8", "md:pt-8"], ["data-testid", "wizard-step-header", 1, "text-base", "md:text-xl", "font-bold", "text-content"], [1, "text-sm", "md:text-base"], [1, "bg-white", "rounded-lg", "p-3", "md:p-8", 3, "formGroup"], [1, "grid", "lg:grid-cols-3", "gap-4"], ["data-testid", "dropdown-board", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], ["data-testid", "dropdown-grade", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], ["data-testid", "dropdown-subject", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], [1, "grid", "lg:grid-cols-2", "gap-4", "mt-7"], [1, "form-control-label"], [1, "text-error"], ["data-testid", "examination-name-input", "formControlName", "examinationName", 1, "form-control", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], ["data-testid", "total-marks-input", "formControlName", "totalMarks", "inputmode", "numeric", "maxlength", "3", "oninput", "this.value=this.value.replace(/[^0-9]/g, '').slice(0, 3)", 1, "form-control", 3, "placeholder"], [1, "form-control-label", "inline-flex", "items-center", "gap-1"], ["tabindex", "0", 1, "relative", "group", "cursor-help", 3, "focus", "blur", "click"], ["src", "assets/icons/info-primary.svg", "alt", "Source information", 1, "w-4", "h-4"], ["role", "tooltip", 1, "grid", "pointer-events-none", "opacity-0", "group-hover:opacity-100", "group-focus:opacity-100", "absolute", "top-5", "left-0", "z-50", "w-72", "gap-1", "rounded", "border", "bg-white", "p-3", "text-xs", "font-normal", "shadow-md"], [4, "ngFor", "ngForOf"], ["data-testid", "dropdown-source-generation", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], ["data-testid", "dropdown-language", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], [1, "grid", "lg:grid-cols-2", "gap-4", "mt-8", "border-t", "pt-6"], [1, "flex", "gap-4", "items-center", "mt-2"], ["class", "flex items-center gap-2", 4, "ngFor", "ngForOf"], ["data-testid", "dropdown-chapter", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], ["data-testid", "dropdown-sub-topic", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange", 4, "ngIf"], ["class", "mt-8", 4, "ngIf"], [1, "form-control-error"], [4, "ngIf"], [1, "flex", "items-center", "gap-2"], ["type", "radio", 3, "ngModel", "ngModelOptions", "id", "value", "ngModelChange", "change"], ["data-testid", "dropdown-sub-topic", 3, "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], [1, "mt-8"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "text-base", "font-bold", "text-content"], ["type", "button", 1, "btn-outline-primary", 3, "click"], [1, "overflow-x-auto"], [1, "table-auto", "w-full", "text-content", "border"], [1, "text-xs", "bg-[#edf6fe]"], ["class", "px-4 py-3 border", 4, "ngFor", "ngForOf"], ["class", "p-2 border", 4, "ngFor", "ngForOf"], ["class", "text-error", 4, "ngIf"], [1, "px-4", "py-3", "border"], [1, "p-2", "border"], [1, "w-full", "text-center", "border-none", "p-2", 3, "ngModel", "ngModelOptions", "ngModelChange"], [1, "text-base", "font-bold", "text-content", "mb-3"], [1, "px-4", "py-3", "border", "text-left"], [1, "p-3", "border"], [1, "p-3", "border", "text-center"], [1, "p-4", "md:p-8"], ["src", "assets/icons/back-arrow.svg", "alt", "Back", 1, "cursor-pointer", "w-5", 3, "click"], [1, "mb-6"], [1, "flex", "justify-between", "mb-3"], [1, "md:overflow-x-auto"], ["data-testid", "template-question-table", 1, "block", "w-full", "text-content", "md:table", "md:table-auto", "md:border"], [1, "hidden", "text-xs", "bg-[#edf6fe]", "md:table-header-group"], [1, "block", "md:table-row-group"], ["data-testid", "template-row", "class", "mb-3 grid grid-cols-2 gap-3 rounded border p-3 md:table-row md:p-0", 4, "ngFor", "ngForOf"], [1, "mt-2", "text-center", "text-sm", "md:text-right", "md:text-base"], ["data-testid", "template-row", 1, "mb-3", "grid", "grid-cols-2", "gap-3", "rounded", "border", "p-3", "md:table-row", "md:p-0"], ["data-testid", "template-row-type-cell", 1, "col-span-2", "md:table-cell", "md:border", "md:p-2"], [1, "mb-1", "block", "text-xs", "font-semibold", "md:hidden"], ["data-testid", "common-dropdown", 3, "dropDownValues", "config", "ngModel", "ngModelOptions", "ngModelChange"], [1, "md:table-cell", "md:border", "md:p-2"], ["data-testid", "template-row-count-input", 1, "form-control", 3, "ngModel", "ngModelOptions", "ngModelChange"], ["data-testid", "template-row-marks-input", 1, "form-control", 3, "ngModel", "ngModelOptions", "ngModelChange"], [1, "col-span-2", "md:table-cell", "md:border", "md:p-2"], [1, "flex", "justify-end", "gap-2", "md:justify-start"], ["data-testid", "template-row-delete-btn", "class", "btn-danger", 3, "click", 4, "ngIf"], ["class", "btn-primary", 3, "click", 4, "ngIf"], ["data-testid", "template-row-delete-btn", 1, "btn-danger", 3, "click"], ["src", "assets/icons/delete-icon.svg", "alt", "Delete"], [1, "btn-primary", 3, "click"], ["src", "assets/icons/add-icon.svg", "alt", "Add"], [1, "mt-4", "border", "rounded", "p-4"], [1, "flex", "justify-between", "mt-5", "font-bold"], ["class", "flex gap-3 mt-3 items-center", 4, "ngFor", "ngForOf"], [1, "flex", "gap-3", "mt-3", "items-center"], [1, "w-6", "shrink-0"], [1, "flex-1", "min-w-0"], [1, "bg-white"], [3, "currentStep", "totalSteps", "totalMarks", "availableQuestions", "preSelectedQuestions", "subject", "selectionChange", "backClick"], [3, "currentStep", "totalSteps", "fullWidth", "finalSelectedQuestions", "examName", "totalMarks", "selectedQuestionsMarks", "questionsReorder"], [1, "btn-outline-primary", "px-6", "py-2", 3, "click"], ["data-testid", "wizard-next-btn", 1, "btn-primary", "px-8", "py-2", 3, "disabled", "click"], ["data-testid", "preview-questions", 1, "btn-primary", "px-8", "py-2", 3, "disabled", "click"], ["data-testid", "toggle-picker-preview-btn", 1, "btn-outline-primary", "px-6", "py-2", 3, "click"], ["data-testid", "generate-final-question-paper-btn", 1, "btn-primary", "px-8", "py-2", 3, "disabled", "click"]],
      template: function QuestionBankGenerationComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_Template_img_click_2_listener() {
            return ctx.backNavigation();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 4)(7, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, QuestionBankGenerationComponent_div_8_Template, 7, 12, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](12, 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](13, QuestionBankGenerationComponent_div_13_Template, 60, 62, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](14, QuestionBankGenerationComponent_div_14_Template, 37, 32, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, QuestionBankGenerationComponent_div_15_Template, 11, 8, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](16, QuestionBankGenerationComponent_div_16_Template, 3, 3, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, QuestionBankGenerationComponent_button_18_Template, 3, 3, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, QuestionBankGenerationComponent_button_19_Template, 3, 4, "button", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](20, QuestionBankGenerationComponent_button_20_Template, 3, 4, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, QuestionBankGenerationComponent_button_21_Template, 3, 3, "button", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](22, QuestionBankGenerationComponent_button_22_Template, 3, 4, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 15, "Question Paper Generation"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.stepArray);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate3"](" Step ", ctx.currentStep, " of ", ctx.totalSteps, ": ", ctx.stepNames[ctx.currentStep - 1], " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngSwitch", ctx.currentStep);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngSwitchCase", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngSwitchCase", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngSwitchCase", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngSwitchCase", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep > 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep < 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep === 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep === 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep === 4);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_20__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgSwitchCase, _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.RadioControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormControlName, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_6__.DropdownComponent, _question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_7__.QuestionBankTemplateComponent, _question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_8__.QuestionBankBluePrintComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__.TranslatePipe],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXN0aW9uLWJhbmstZ2VuZXJhdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFRLGNBQUE7QUFFUiIsImZpbGUiOiJxdWVzdGlvbi1iYW5rLWdlbmVyYXRpb24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7IGRpc3BsYXk6IGJsb2NrOyB9XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1nZW5lcmF0aW9uL3F1ZXN0aW9uLWJhbmstZ2VuZXJhdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFRLGNBQUE7QUFFUjtBQUNBLDRVQUE0VSIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IH1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
      data: {
        animation: [src_app_shared_utility_animations_util__WEBPACK_IMPORTED_MODULE_1__.fadeInOutAnimation]
      }
    });
  }
}

/***/ }),

/***/ 50261:
/*!*****************************************************************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-generation/question-bank-template/question-bank-template.component.ts ***!
  \*****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankTemplateComponent: () => (/* binding */ QuestionBankTemplateComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/math-render.util */ 30084);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _question_tags_question_tags_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../question-tags/question-tags.component */ 72815);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ 90852);








const _c0 = ["questionSelectionContent"];
function QuestionBankTemplateComponent_div_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_39_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r9);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r8.toggleFilterMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function QuestionBankTemplateComponent_div_40_div_9_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_9_button_8_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r17);
      const s_r15 = restoredCtx.$implicit;
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r16.setFilter(s_r15));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r15 = ctx.$implicit;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r14.filterSource === s_r15 ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 2, s_r15), " ");
  }
}
function QuestionBankTemplateComponent_div_40_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 46)(1, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 48)(5, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_9_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r19);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r18.setFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, QuestionBankTemplateComponent_div_40_div_9_button_8_Template, 3, 4, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 4, "Source"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r10.filterSource === "ALL" ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 6, "All"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r10.availableSources);
  }
}
function QuestionBankTemplateComponent_div_40_div_10_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_10_button_8_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r23);
      const d_r21 = restoredCtx.$implicit;
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r22.setDifficultyFilter(d_r21));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const d_r21 = ctx.$implicit;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r20.filterDifficulty === d_r21 ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 2, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 4, d_r21)), " ");
  }
}
function QuestionBankTemplateComponent_div_40_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 46)(1, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 48)(5, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_10_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r25);
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r24.setDifficultyFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, QuestionBankTemplateComponent_div_40_div_10_button_8_Template, 4, 6, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 4, "Difficulty"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r11.filterDifficulty === "ALL" ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 6, "All"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r11.availableDifficulties);
  }
}
function QuestionBankTemplateComponent_div_40_div_11_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_11_button_8_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r29);
      const m_r27 = restoredCtx.$implicit;
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r28.setMarksFilter(m_r27));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const m_r27 = ctx.$implicit;
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r26.filterMarks === m_r27 ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r26.formatMarks(m_r27), " ");
  }
}
function QuestionBankTemplateComponent_div_40_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 46)(1, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 48)(5, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_11_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r31);
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r30.setMarksFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, QuestionBankTemplateComponent_div_40_div_11_button_8_Template, 2, 2, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 4, "Marks per Question"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r12.filterMarks === "ALL" ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 6, "All"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r12.availableMarks);
  }
}
function QuestionBankTemplateComponent_div_40_div_12_img_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "img", 55);
  }
}
function QuestionBankTemplateComponent_div_40_div_12_button_10_img_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "img", 55);
  }
}
function QuestionBankTemplateComponent_div_40_div_12_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_12_button_10_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r37);
      const head_r34 = restoredCtx.$implicit;
      const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r36.setTypeFilter(head_r34));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "span", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, QuestionBankTemplateComponent_div_40_div_12_button_10_img_4_Template, 1, 0, "img", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const head_r34 = ctx.$implicit;
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r33.filterQuestionType === head_r34 ? "bg-primary-5 text-primary font-bold" : "hover:bg-gray-50 text-gray-600");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 3, head_r34));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r33.filterQuestionType === head_r34);
  }
}
function QuestionBankTemplateComponent_div_40_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 46)(1, "label", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 51)(5, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_div_12_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r39);
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r38.setTypeFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, QuestionBankTemplateComponent_div_40_div_12_img_9_Template, 1, 0, "img", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, QuestionBankTemplateComponent_div_40_div_12_button_10_Template, 5, 5, "button", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 5, "Question Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r13.filterQuestionType === "ALL" ? "bg-primary-5 text-primary font-bold" : "hover:bg-gray-50 text-gray-600");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](8, 7, "All Types"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r13.filterQuestionType === "ALL");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r13.availableHeadings);
  }
}
function QuestionBankTemplateComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 40)(1, "div", 41)(2, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_40_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r41);
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      ctx_r40.resetFilters();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r40.toggleFilterMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, QuestionBankTemplateComponent_div_40_div_9_Template, 9, 8, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, QuestionBankTemplateComponent_div_40_div_10_Template, 9, 8, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](11, QuestionBankTemplateComponent_div_40_div_11_Template, 9, 8, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, QuestionBankTemplateComponent_div_40_div_12_Template, 11, 9, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 6, "Refine Results"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 8, "Clear All"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.availableSources.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.availableDifficulties.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.availableMarks.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.availableHeadings.length);
  }
}
const _c1 = function (a0) {
  return {
    marks: a0
  };
};
function QuestionBankTemplateComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "img", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](4, 1, "Only {{marks}} mark(s) remaining. Greyed questions would exceed the total \u2014 remove questions from Selected to free marks.", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](4, _c1, ctx_r3.formatMarks(ctx_r3.remainingMarks))), " ");
  }
}
function QuestionBankTemplateComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "No questions found."), " ");
  }
}
function QuestionBankTemplateComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_51_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r44);
      const q_r42 = restoredCtx.$implicit;
      const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r43.selectQuestion(q_r42));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div", 61)(3, "p", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "app-question-tags", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const q_r42 = ctx.$implicit;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("pool-item--disabled", ctx_r5.wouldExceedTotal(q_r42));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx_r5.sourceBorderClass(q_r42.source));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("title", ctx_r5.wouldExceedTotal(q_r42) ? _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 6, "Exceeds total marks \u2014 remove from Selected first") : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r5.questionText(q_r42));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("question", q_r42);
  }
}
function QuestionBankTemplateComponent_div_64_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "Choose questions from Available to add them here."), " ");
  }
}
function QuestionBankTemplateComponent_div_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 65)(1, "button", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_65_Template_button_click_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r48);
      const i_r46 = restoredCtx.index;
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r47.removeQuestion(i_r46));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 67)(4, "p", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "app-question-tags", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const q_r45 = ctx.$implicit;
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r7.questionText(q_r45));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("question", q_r45);
  }
}
const _c2 = function (a0) {
  return {
    "hidden xl:!flex": a0
  };
};
class QuestionBankTemplateComponent {
  constructor() {
    this.currentStep = 2;
    this.totalSteps = 3;
    this.totalMarks = 0; // Target marks
    // NEW INPUT: The merged pool from Parent
    this.availableQuestions = [];
    // Pre-selected questions passed from the parent to restore selections
    this.preSelectedQuestions = [];
    this.subject = '';
    this.backClick = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.nextClick = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter(); // Emits final selected questions
    this.selectionChange = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    // Pre-selected questions from parent (e.g. when navigating back to Step 2)
    // Local State
    this.filteredQuestions = [];
    this.selectedQuestions = [];
    this.activePane = 'POOL';
    // Filter State
    this.filterSource = 'ALL';
    this.filterDifficulty = 'ALL';
    this.filterMarks = 'ALL';
    this.filterQuestionType = 'ALL';
    this.searchText = '';
    this.isFilterMenuOpen = false;
    this.availableHeadings = [];
    this.availableSources = [];
    this.availableDifficulties = [];
    this.availableMarks = [];
    this.QUESTION_SOURCE = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE;
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.questionText = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.questionText;
    this.sourceBorderClass = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.sourceBorderClass;
  }
  ngOnInit() {
    // Initialize from pre-selected questions if any
    if (this.preSelectedQuestions && this.preSelectedQuestions.length > 0) {
      this.selectedQuestions = [...this.preSelectedQuestions];
      this.activePane = 'SELECTED';
    }
    // Initial load
    this.extractFilters();
    this.applyFilters();
  }
  ngAfterViewInit() {
    (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__.renderTexMath)(this.questionSelectionContent.nativeElement);
  }
  ngOnChanges(changes) {
    if (changes['preSelectedQuestions']) {
      this.syncPreSelectedQuestions();
    }
    this.extractFilters();
    this.applyFilters();
  }
  syncPreSelectedQuestions() {
    if (!this.preSelectedQuestions || this.preSelectedQuestions.length === 0) {
      this.selectedQuestions = [];
      return;
    }
    const byId = new Map();
    this.preSelectedQuestions.forEach(q => {
      const key = q?._id ? String(q._id) : `${q?.text || ''}__${q?.marks || 0}`;
      if (!byId.has(key)) byId.set(key, q);
    });
    this.selectedQuestions = Array.from(byId.values());
  }
  extractFilters() {
    if (!this.availableQuestions) return;
    const headings = new Set();
    const sources = new Set();
    const difficulties = new Set();
    const marks = new Set();
    this.availableQuestions.forEach(q => {
      if (q.heading) headings.add(q.heading);
      if (q.source) sources.add(q.source);
      if (q.difficulty) difficulties.add(q.difficulty);
      if (q.marks != null && q.marks !== '') marks.add(Number(q.marks));
    });
    this.availableHeadings = Array.from(headings).sort();
    this.availableSources = Array.from(sources).sort((a, b) => {
      if (a === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI) return -1;
      if (b === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI) return 1;
      return a.localeCompare(b);
    });
    // Sort difficulties logically
    const diffOrder = ['easy', 'average', 'difficult'];
    this.availableDifficulties = Array.from(difficulties).sort((a, b) => {
      const idxA = diffOrder.indexOf(a.toLowerCase());
      const idxB = diffOrder.indexOf(b.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });
    this.availableMarks = Array.from(marks).filter(m => !Number.isNaN(m)).sort((a, b) => a - b);
  }
  // --- FILTERING ---
  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }
  setFilter(source) {
    this.filterSource = source;
    this.applyFilters();
  }
  setDifficultyFilter(difficulty) {
    this.filterDifficulty = difficulty;
    this.applyFilters();
  }
  setMarksFilter(marks) {
    this.filterMarks = marks;
    this.applyFilters();
  }
  setTypeFilter(type) {
    this.filterQuestionType = type;
    this.applyFilters();
  }
  resetFilters() {
    this.filterSource = 'ALL';
    this.filterDifficulty = 'ALL';
    this.filterMarks = 'ALL';
    this.filterQuestionType = 'ALL';
    this.searchText = '';
    this.applyFilters();
  }
  applyFilters() {
    this.filteredQuestions = this.availableQuestions.filter(q => {
      // 1. Source Filter
      const matchSource = this.filterSource === 'ALL' || q.source === this.filterSource;
      // 2. Difficulty Filter
      const matchDifficulty = this.filterDifficulty === 'ALL' || q.difficulty && q.difficulty.toLowerCase() === this.filterDifficulty.toLowerCase();
      // 3. Marks Filter
      const matchMarks = this.filterMarks === 'ALL' || Number(q.marks) === Number(this.filterMarks);
      // 4. Question Type Filter
      const matchType = this.filterQuestionType === 'ALL' || q.heading === this.filterQuestionType;
      // 5. Search Filter
      const matchSearch = !this.searchText || this.questionText(q).toLowerCase().includes(this.searchText.toLowerCase());
      // 6. Exclude already selected
      const isSelected = this.selectedQuestions.some(sq => sq._id === q._id);
      return matchSource && matchDifficulty && matchMarks && matchType && matchSearch && !isSelected;
    });
    if (this.questionSelectionContent) (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__.renderTexMath)(this.questionSelectionContent.nativeElement);
  }
  onSearch(val) {
    this.searchText = val.target.value;
    this.applyFilters();
  }
  // --- SELECTION LOGIC ---
  wouldExceedTotal(q) {
    return this.currentTotalMarks + Number(q.marks) > this.totalMarks;
  }
  selectQuestion(q) {
    if (this.wouldExceedTotal(q)) return;
    this.selectedQuestions.push(q);
    this.selectionChange.emit(this.selectedQuestions);
    this.applyFilters(); // Remove from left list
  }

  removeQuestion(index) {
    this.selectedQuestions.splice(index, 1);
    this.selectionChange.emit(this.selectedQuestions);
    this.applyFilters(); // Add back to left list
  }
  // --- TOTALS ---
  get currentTotalMarks() {
    return this.selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
  }
  get isTotalMet() {
    return this.currentTotalMarks === this.totalMarks;
  }
  get remainingMarks() {
    return this.totalMarks - this.currentTotalMarks;
  }
  /** True when the pool has items greyed out because marks are full / insufficient. */
  get showCapacityHint() {
    return this.filteredQuestions.length > 0 && this.filteredQuestions.some(q => this.wouldExceedTotal(q));
  }
  // --- ACTIONS ---
  previousStep() {
    this.backClick.emit(true);
  }
  proceedToNext() {
    // We send the selected questions to the parent (Step 3)
    this.nextClick.emit(this.selectedQuestions);
  }
  static {
    this.ɵfac = function QuestionBankTemplateComponent_Factory(t) {
      return new (t || QuestionBankTemplateComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: QuestionBankTemplateComponent,
      selectors: [["app-question-bank-template"]],
      viewQuery: function QuestionBankTemplateComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.questionSelectionContent = _t.first);
        }
      },
      inputs: {
        currentStep: "currentStep",
        totalSteps: "totalSteps",
        totalMarks: "totalMarks",
        availableQuestions: "availableQuestions",
        preSelectedQuestions: "preSelectedQuestions",
        subject: "subject"
      },
      outputs: {
        backClick: "backClick",
        nextClick: "nextClick",
        selectionChange: "selectionChange"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵNgOnChangesFeature"]],
      decls: 66,
      vars: 65,
      consts: [[1, "px-4", "pt-4", "md:px-8"], [1, "flex", "items-center", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer", 3, "click"], [1, "text-base", "md:text-xl", "font-bold", "text-content"], [1, "text-sm", "md:text-base", "text-gray-500"], [1, "font-bold"], [1, "mx-4", "mt-4", "overflow-hidden", "rounded", "border", "md:mx-8", "xl:hidden"], [1, "p-3", "border-b", "bg-gray-50", "text-right", "text-sm"], [1, "font-bold", 3, "ngClass"], [1, "text-gray-500"], [1, "grid", "grid-cols-2"], [1, "p-2", "font-semibold", "border-r", 3, "ngClass", "click"], [1, "p-2", "font-semibold", 3, "ngClass", "click"], [1, "p-4", "md:p-8", "flex", "flex-col", "xl:flex-row", "gap-6", "xl:h-[70vh]"], ["questionSelectionContent", ""], [1, "w-full", "xl:flex-1", "min-h-[20rem]", "bg-white", "border", "rounded-lg", "flex", "flex-col", "shadow-sm", "overflow-visible", "xl:overflow-hidden", 3, "ngClass"], [1, "p-3", "border-b", "bg-white", "flex", "flex-wrap", "items-center", "gap-3", "relative"], [1, "sm:relative"], [1, "flex", "items-center", "gap-2", "px-3", "py-1.5", "rounded-lg", "border", "border-gray-200", "hover:border-primary", "active:bg-gray-50", "transition-all", "shadow-sm", "bg-white", 3, "click"], ["src", "assets/icons/ri--filter-line.svg", "alt", "Filter", 1, "w-4", "h-4", 2, "filter", "invert(1)"], [1, "text-sm", "font-semibold", "text-gray-700"], ["src", "assets/icons/down-arrow.svg", "alt", "", 1, "w-2.5", "h-2.5", "opacity-50", "transition-transform", 2, "filter", "invert(1)"], ["class", "fixed inset-0 z-20", 3, "click", 4, "ngIf"], ["class", "absolute top-full left-0 right-0 mt-2 w-auto bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-4 animate-in fade-in slide-in-from-top-1 duration-200 sm:left-0 sm:right-auto sm:w-72", 4, "ngIf"], [1, "relative", "group", "w-full", "sm:flex-1"], ["src", "assets/icons/search.svg", "alt", "", 1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "w-4", "h-4", "opacity-40", "group-focus-within:opacity-70", "transition-opacity"], ["type", "text", 1, "w-full", "pl-9", "pr-4", "py-1.5", "text-sm", "border", "border-gray-200", "rounded-lg", "outline-none", "focus:border-primary", "focus:ring-1", "focus:ring-primary/20", "bg-white", "shadow-sm", "transition-all", 3, "value", "placeholder", "input"], [1, "font-bold", "text-gray-400", "text-xs", "uppercase", "tracking-widest", "ml-auto", "hidden", "sm:block"], ["class", "shrink-0 flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900", 4, "ngIf"], [1, "p-2", "space-y-2", "bg-gray-50/50", "xl:flex-1", "xl:overflow-y-auto"], ["class", "text-center py-10 text-gray-400 text-sm", 4, "ngIf"], ["class", "pool-item bg-white p-3 rounded border transition-all border-l-4 group", 3, "pool-item--disabled", "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "w-full", "xl:flex-1", "min-h-[20rem]", "bg-white", "border", "rounded-lg", "flex", "flex-col", "shadow-sm", "overflow-hidden", "relative", 3, "ngClass"], [1, "p-3", "border-b", "bg-gray-50", "hidden", "xl:flex", "flex-wrap", "justify-between", "items-center", "gap-2"], [1, "font-bold", "text-gray-700"], [1, "text-sm"], [1, "p-2", "space-y-2", "xl:flex-1", "xl:overflow-y-auto"], ["class", "text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded m-4", 4, "ngIf"], ["class", "bg-white p-3 rounded border relative", 4, "ngFor", "ngForOf"], [1, "fixed", "inset-0", "z-20", 3, "click"], [1, "absolute", "top-full", "left-0", "right-0", "mt-2", "w-auto", "bg-white", "border", "border-gray-200", "rounded-xl", "shadow-xl", "z-30", "p-4", "animate-in", "fade-in", "slide-in-from-top-1", "duration-200", "sm:left-0", "sm:right-auto", "sm:w-72"], [1, "flex", "justify-between", "items-center", "mb-4", "pb-2", "border-b"], [1, "font-bold", "text-gray-800"], [1, "text-xs", "text-primary", "font-bold", "hover:underline", 3, "click"], [1, "space-y-4", "max-h-[50vh]", "overflow-y-auto", "pr-1", "custom-scrollbar"], ["class", "space-y-2", 4, "ngIf"], [1, "space-y-2"], [1, "text-[10px]", "font-bold", "text-gray-400", "uppercase", "tracking-widest"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "px-2.5", "py-1", "text-xs", "rounded-full", "border", "transition-all", 3, "ngClass", "click"], ["class", "px-2.5 py-1 text-xs rounded-full border transition-all", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "flex", "flex-col", "gap-1"], [1, "flex", "items-center", "justify-between", "px-2", "py-1.5", "text-xs", "rounded-lg", "transition-all", "text-left", 3, "ngClass", "click"], ["src", "assets/icons/check.svg", "class", "w-3 h-3", 4, "ngIf"], ["class", "flex items-center justify-between px-2 py-1.5 text-xs rounded-lg transition-all text-left", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], ["src", "assets/icons/check.svg", 1, "w-3", "h-3"], [1, "truncate"], [1, "shrink-0", "flex", "items-start", "gap-2", "border-b", "border-amber-200", "bg-amber-50", "px-3", "py-2", "text-xs", "text-amber-900"], ["src", "assets/icons/Info 2.svg", "alt", "", 1, "w-4", "h-4", "mt-0.5", "shrink-0", "opacity-70"], [1, "text-center", "py-10", "text-gray-400", "text-sm"], [1, "pool-item", "bg-white", "p-3", "rounded", "border", "transition-all", "border-l-4", "group", 3, "ngClass", "click"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:justify-between", "sm:items-start", "mb-1"], [1, "text-sm", "text-gray-800", "line-clamp-3", "flex-1", "sm:mr-2", "pool-item__text"], [3, "question"], [1, "text-center", "py-10", "text-gray-400", "text-sm", "border-2", "border-dashed", "rounded", "m-4"], [1, "bg-white", "p-3", "rounded", "border", "relative"], [1, "absolute", "top-2", "right-2", "text-gray-300", "hover:text-red-500", "font-bold", "text-xl", "leading-none", 3, "click"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:justify-between", "sm:items-start", "mb-1", "pr-6"], [1, "text-sm", "text-gray-800", "flex-1", "sm:mr-2"]],
      template: function QuestionBankTemplateComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_Template_img_click_2_listener() {
            return ctx.previousStep();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "h2", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](12, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, ". ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 6)(15, "div", 7)(16, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](20, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "div", 10)(22, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_Template_button_click_22_listener() {
            return ctx.activePane = "POOL";
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](24, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](25, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_Template_button_click_25_listener() {
            return ctx.activePane = "SELECTED";
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](27, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "div", 13, 14)(30, "div", 15)(31, "div", 16)(32, "div", 17)(33, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_Template_button_click_33_listener() {
            return ctx.toggleFilterMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](34, "img", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](35, "span", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](37, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](38, "img", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](39, QuestionBankTemplateComponent_div_39_Template, 1, 0, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](40, QuestionBankTemplateComponent_div_40_Template, 13, 10, "div", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](41, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](42, "img", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](43, "input", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("input", function QuestionBankTemplateComponent_Template_input_input_43_listener($event) {
            return ctx.onSearch($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](44, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](45, "h3", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](46);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](47, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](48, QuestionBankTemplateComponent_div_48_Template, 5, 6, "div", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](49, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](50, QuestionBankTemplateComponent_div_50_Template, 3, 3, "div", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](51, QuestionBankTemplateComponent_div_51_Template, 6, 8, "div", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](52, "div", 32)(53, "div", 33)(54, "h3", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](55);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](56, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](57, "div", 35)(58, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](59);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](60, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](61);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](62, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](63, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](64, QuestionBankTemplateComponent_div_64_Template, 3, 3, "div", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](65, QuestionBankTemplateComponent_div_65_Template, 7, 2, "div", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate4"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 37, "Step"), " ", ctx.currentStep, "/", ctx.totalSteps, ": ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](6, 39, "Select Questions"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](9, 41, "Mix and match questions to build your paper. Target:"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"]("", ctx.formatMarks(ctx.totalMarks), " ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](12, 43, "Marks"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.isTotalMet ? "text-green-600" : "text-red-600");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.formatMarks(ctx.currentTotalMarks));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" / ", ctx.formatMarks(ctx.totalMarks), " ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](20, 45, "Marks"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.activePane === "POOL" ? "bg-primary text-white" : "bg-white text-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](24, 47, "Available"), " (", ctx.filteredQuestions.length, ") ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.activePane === "SELECTED" ? "bg-primary text-white" : "bg-white text-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](27, 49, "Selected"), " (", ctx.selectedQuestions.length, ") ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](61, _c2, ctx.activePane !== "POOL"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](37, 51, "Filters"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("rotate-180", ctx.isFilterMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.isFilterMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.isFilterMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.searchText)("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](44, 53, "Search questions..."));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](47, 55, "Pool"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showCapacityHint);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.filteredQuestions.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.filteredQuestions);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](63, _c2, ctx.activePane !== "SELECTED"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](56, 57, "Selected Questions"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.isTotalMet ? "text-green-600" : "text-red-600");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.formatMarks(ctx.currentTotalMarks));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" / ", ctx.formatMarks(ctx.totalMarks), " ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](62, 59, "Marks"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.selectedQuestions.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.selectedQuestions);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _question_tags_question_tags_component__WEBPACK_IMPORTED_MODULE_3__.QuestionTagsComponent, _angular_common__WEBPACK_IMPORTED_MODULE_5__.TitleCasePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslatePipe],
      styles: [".pool-item[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.pool-item[_ngcontent-%COMP%]:hover:not(.pool-item--disabled) {\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}\n.pool-item[_ngcontent-%COMP%]:hover:not(.pool-item--disabled)   .pool-item__text[_ngcontent-%COMP%] {\n  color: var(--primary-DEFAULT);\n}\n\n.pool-item--disabled[_ngcontent-%COMP%] {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n\n.animate-in[_ngcontent-%COMP%] {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n}\n\n@keyframes _ngcontent-%COMP%_fadeInSlideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.fade-in.slide-in-from-top-1[_ngcontent-%COMP%] {\n  animation-name: _ngcontent-%COMP%_fadeInSlideDown;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXN0aW9uLWJhbmstdGVtcGxhdGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxlQUFBO0FBQ0Y7QUFDRTtFQUNFLDZDQUFBO0FBQ0o7QUFFRTtFQUNFLDZCQUFBO0FBQUo7O0FBSUE7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7QUFERjs7QUFLQTtFQUNFLHdCQUFBO0VBQ0EseUJBQUE7QUFGRjs7QUFLQTtFQUNFO0lBQ0UsVUFBQTtJQUNBLDJCQUFBO0VBRkY7RUFJQTtJQUNFLFVBQUE7SUFDQSx3QkFBQTtFQUZGO0FBQ0Y7QUFLQTtFQUNFLCtCQUFBO0FBSEYiLCJmaWxlIjoicXVlc3Rpb24tYmFuay10ZW1wbGF0ZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5wb29sLWl0ZW0ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgJjpob3Zlcjpub3QoLnBvb2wtaXRlbS0tZGlzYWJsZWQpIHtcbiAgICBib3gtc2hhZG93OiAwIDRweCA2cHggLTFweCByZ2IoMCAwIDAgLyAwLjEpO1xuICB9XG5cbiAgJjpob3Zlcjpub3QoLnBvb2wtaXRlbS0tZGlzYWJsZWQpIC5wb29sLWl0ZW1fX3RleHQge1xuICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICB9XG59XG5cbi5wb29sLWl0ZW0tLWRpc2FibGVkIHtcbiAgb3BhY2l0eTogMC40O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4vLyBGYWRlIGluIHNsaWRlIGRvd24gYW5pbWF0aW9uXG4uYW5pbWF0ZS1pbiB7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcbn1cblxuQGtleWZyYW1lcyBmYWRlSW5TbGlkZURvd24ge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KTtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbn1cblxuLmZhZGUtaW4uc2xpZGUtaW4tZnJvbS10b3AtMSB7XG4gIGFuaW1hdGlvbi1uYW1lOiBmYWRlSW5TbGlkZURvd247XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1nZW5lcmF0aW9uL3F1ZXN0aW9uLWJhbmstdGVtcGxhdGUvcXVlc3Rpb24tYmFuay10ZW1wbGF0ZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7QUFDRjtBQUNFO0VBQ0UsNkNBQUE7QUFDSjtBQUVFO0VBQ0UsNkJBQUE7QUFBSjs7QUFJQTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtBQURGOztBQUtBO0VBQ0Usd0JBQUE7RUFDQSx5QkFBQTtBQUZGOztBQUtBO0VBQ0U7SUFDRSxVQUFBO0lBQ0EsMkJBQUE7RUFGRjtFQUlBO0lBQ0UsVUFBQTtJQUNBLHdCQUFBO0VBRkY7QUFDRjtBQUtBO0VBQ0UsK0JBQUE7QUFIRjtBQUNBLGc1Q0FBZzVDIiwic291cmNlc0NvbnRlbnQiOlsiLnBvb2wtaXRlbSB7XG4gIGN1cnNvcjogcG9pbnRlcjtcblxuICAmOmhvdmVyOm5vdCgucG9vbC1pdGVtLS1kaXNhYmxlZCkge1xuICAgIGJveC1zaGFkb3c6IDAgNHB4IDZweCAtMXB4IHJnYigwIDAgMCAvIDAuMSk7XG4gIH1cblxuICAmOmhvdmVyOm5vdCgucG9vbC1pdGVtLS1kaXNhYmxlZCkgLnBvb2wtaXRlbV9fdGV4dCB7XG4gICAgY29sb3I6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gIH1cbn1cblxuLnBvb2wtaXRlbS0tZGlzYWJsZWQge1xuICBvcGFjaXR5OiAwLjQ7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi8vIEZhZGUgaW4gc2xpZGUgZG93biBhbmltYXRpb25cbi5hbmltYXRlLWluIHtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xufVxuXG5Aa2V5ZnJhbWVzIGZhZGVJblNsaWRlRG93biB7XG4gIGZyb20ge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04cHgpO1xuICB9XG4gIHRvIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxufVxuXG4uZmFkZS1pbi5zbGlkZS1pbi1mcm9tLXRvcC0xIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGZhZGVJblNsaWRlRG93bjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 72815:
/*!***********************************************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-generation/question-tags/question-tags.component.ts ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionTagsComponent: () => (/* binding */ QuestionTagsComponent)
/* harmony export */ });
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);





function QuestionTagsComponent_img_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("alt", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 2, "Contains image"))("title", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 4, "Contains image"));
  }
}
function QuestionTagsComponent_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r1.question.heading), " ");
  }
}
function QuestionTagsComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx_r2.difficultyColor(ctx_r2.question.difficulty));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 2, ctx_r2.question.difficulty), " ");
  }
}
class QuestionTagsComponent {
  constructor() {
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.hasQuestionImage = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.hasQuestionImage;
    this.difficultyColor = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.difficultyColor;
    this.sourceTagClass = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.sourceTagClass;
  }
  static {
    this.ɵfac = function QuestionTagsComponent_Factory(t) {
      return new (t || QuestionTagsComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: QuestionTagsComponent,
      selectors: [["app-question-tags"]],
      inputs: {
        question: "question"
      },
      decls: 9,
      vars: 8,
      consts: [[1, "flex", "flex-wrap", "items-center", "gap-1"], ["src", "assets/icons/image.svg", "class", "w-4 h-4 text-gray-500", 3, "alt", "title", 4, "ngIf"], ["class", "text-[10px] font-bold px-1 rounded uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200", 4, "ngIf"], ["class", "text-[10px] font-bold px-1 rounded uppercase tracking-wider border", 3, "ngClass", 4, "ngIf"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", "tracking-wider", 3, "ngClass"], [1, "text-xs", "font-bold", "text-gray-600"], ["src", "assets/icons/image.svg", 1, "w-4", "h-4", "text-gray-500", 3, "alt", "title"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", "tracking-wider", "bg-purple-100", "text-purple-700", "border", "border-purple-200"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", "tracking-wider", "border", 3, "ngClass"]],
      template: function QuestionTagsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, QuestionTagsComponent_img_1_Template, 3, 6, "img", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, QuestionTagsComponent_span_2_Template, 3, 3, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, QuestionTagsComponent_span_3_Template, 3, 4, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.hasQuestionImage(ctx.question));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.question.heading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.question.difficulty);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx.sourceTagClass(ctx.question.source));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](6, 6, ctx.question.source), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx.formatMarks(ctx.question.marks), "M");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslatePipe],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 90762:
/*!********************************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-list/question-bank-list.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankListComponent: () => (/* binding */ QuestionBankListComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _question_bank_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../question-bank.service */ 69542);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-translate/core */ 90852);









const _c0 = ["boardDropDown"];
const _c1 = ["mediumDropDown"];
const _c2 = ["classDropDown"];
const _c3 = ["subjectDropDown"];
function QuestionBankListComponent_ng_container_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainer"](0);
  }
}
function QuestionBankListComponent_div_28_span_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span")(1, "p", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const chapters_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", chapters_r7, " ");
  }
}
function QuestionBankListComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 21)(1, "div")(2, "div", 22)(3, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "img", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 25)(6, "p", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](11, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 27)(13, "p", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](15, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "div", 29)(19, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](21, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](26, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](28, QuestionBankListComponent_div_28_span_28_Template, 3, 1, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankListComponent_div_28_Template_button_click_29_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9);
      const item_r5 = restoredCtx.$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r8.viewQuestionPaper(item_r5._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](32, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](8, 10, "Generated On"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](11, 12, item_r5.createdAt, "MMM dd,yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](15, 15, "Subject"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r5.subject);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](21, 17, "Class"), " ", item_r5.grade, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", item_r5.examinationName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](26, 19, "Chapters"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", item_r5.topics);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](32, 21, "View Question Paper"), " ");
  }
}
function QuestionBankListComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 37)(1, "div", 38)(2, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "img", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "p", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](6, 1, "No items found"), " ");
  }
}
function QuestionBankListComponent_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42)(1, "div", 43)(2, "app-dropdown", 44, 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_dropdown_valueUpdate_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r14.onBoardChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 46)(5, "app-dropdown", 44, 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_dropdown_valueUpdate_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r16.onMediumChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 43)(8, "app-dropdown", 44, 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_dropdown_valueUpdate_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r17.onClassChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 43)(11, "app-dropdown", 44, 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_dropdown_valueUpdate_11_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r18.onSubjectChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dropDownValues", ctx_r4.boardDropdownOptions)("config", ctx_r4.boardDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dropDownValues", ctx_r4.mediumDropdownOptions)("config", ctx_r4.mediumDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dropDownValues", ctx_r4.classDropdownOptions)("config", ctx_r4.classDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dropDownValues", ctx_r4.subjectDropdownOptions)("config", ctx_r4.subjectDropdownconfig);
  }
}
class QuestionBankListComponent {
  /**
   * Class constructor
   * @param questionBankService QuestionBankService
   * @param utilityService UtilityService
   * @param router Router
   */
  constructor(questionBankService, utilityService, router) {
    this.questionBankService = questionBankService;
    this.utilityService = utilityService;
    this.router = router;
    this.list = [];
    this.boardDropdownOptions = [];
    this.mediumDropdownOptions = [];
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
    this.boardDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Board',
      bindLabel: 'board',
      bindValue: 'board',
      labelTxt: 'Board'
    };
    this.mediumDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Medium',
      bindLabel: 'medium',
      bindValue: 'medium',
      labelTxt: 'Medium'
    };
    this.classDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Class',
      bindLabel: 'class',
      bindValue: 'class',
      labelTxt: 'Class'
    };
    this.subjectDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Subject',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Subject'
    };
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
  }
  ngOnInit() {
    this.searchSubscription = this.searchTerms.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.debounceTime)(1000), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.distinctUntilChanged)()).subscribe(searchTerm => {
      this.searchText = searchTerm;
      const params = this.getListParams();
      this.getAllQuestionPapers(params);
    });
  }
  getListParams() {
    return {
      board: this.selectedBoard,
      medium: this.selectedMedium,
      grade: this.selectedClass,
      subject: this.selectedSubject,
      search: this.searchText
    };
  }
  searchInputChanged(e) {
    this.searchTerms.next(e.target.value);
  }
  ngAfterViewInit() {
    const loggedInUser = this.utilityService.loggedInUserData;
    this.boardDropdownOptions = this.utilityService.formatResponse(loggedInUser.profiles.teacher.classes);
    if (this.boardDropdownOptions.length === 1) {
      this.boarddropdown.selectedItem = this.boardDropdownOptions[0].board;
      this.selectedBoard = this.boardDropdownOptions[0].board;
      this.mediumDropdownOptions = this.filterMediumByBoard(this.boardDropdownOptions, this.boarddropdown.selectedItem)[0].mediums;
    }
    if (this.mediumDropdownOptions.length === 1) {
      this.mediumdropdown.selectedItem = this.mediumDropdownOptions[0].medium;
      this.selectedMedium = this.mediumDropdownOptions[0].medium;
      this.classDropdownOptions = this.filterClassByMedium(this.mediumDropdownOptions, this.mediumdropdown.selectedItem)[0].classes?.sort((a, b) => a.class - b.class);
    }
    if (this.classDropdownOptions.length === 1) {
      this.classdropdown.selectedItem = this.classDropdownOptions[0].class;
      this.selectedClass = this.classDropdownOptions[0].class;
      const subjectDropdownValue = this.filterSubjectByClass(this.classDropdownOptions, this.classdropdown.selectedItem)[0].data;
      this.subjectDropdownOptions = this.utilityService.formatSubjecter(subjectDropdownValue);
    }
    if (this.subjectDropdownOptions.length === 1) {
      this.subjectdropdown.selectedItem = this.subjectDropdownOptions[0].subject;
      this.selectedSubject = this.subjectDropdownOptions[0].subject;
    }
    const param = this.getListParams();
    this.getAllQuestionPapers(param);
  }
  filterMediumByBoard(dropdownValue, selecteItem) {
    return dropdownValue.filter(item => item.board === selecteItem);
  }
  filterClassByMedium(dropdownValue, selecteItem) {
    return dropdownValue.filter(item => item.medium === selecteItem);
  }
  filterSubjectByClass(dropdownValue, selecteItem) {
    return dropdownValue.filter(item => item.class === selecteItem);
  }
  onBoardChange(val) {
    this.selectedBoard = val;
    this.resetBoardChange();
    if (val) {
      const mediumFilter = this.boardDropdownOptions.filter(item => item.board === this.selectedBoard);
      this.mediumDropdownOptions = mediumFilter[0].mediums;
    }
    const params = this.getListParams();
    this.getAllQuestionPapers(params);
  }
  resetBoardChange() {
    this.mediumdropdown.selectedItem = null;
    this.selectedMedium = null;
    this.classdropdown.selectedItem = null;
    this.selectedClass = null;
    this.subjectdropdown.selectedItem = null;
    this.selectedSubject = null;
    this.mediumDropdownOptions = [];
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
  }
  onMediumChange(val) {
    this.selectedMedium = val;
    this.resetMediumChange();
    if (val) {
      const classFilter = this.mediumDropdownOptions.filter(item => item.medium === this.selectedMedium);
      this.classDropdownOptions = classFilter[0].classes.sort((a, b) => a.class - b.class);
    }
    const params = this.getListParams();
    this.getAllQuestionPapers(params);
  }
  resetMediumChange() {
    this.classdropdown.selectedItem = null;
    this.selectedClass = null;
    this.subjectdropdown.selectedItem = null;
    this.selectedSubject = null;
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
  }
  resetClassChange() {
    this.subjectdropdown.selectedItem = null;
    this.selectedSubject = null;
    this.subjectDropdownOptions = [];
  }
  onClassChange(val) {
    this.selectedClass = val;
    this.resetClassChange();
    if (val) {
      const subjectFilter = this.classDropdownOptions.filter(item => item.class === this.selectedClass);
      this.subjectDropdownOptions = this.utilityService.formatSubjecter(subjectFilter[0].data);
    }
    const params = this.getListParams();
    this.getAllQuestionPapers(params);
  }
  onSubjectChange(val) {
    this.selectedSubject = val;
    const params = this.getListParams();
    this.getAllQuestionPapers(params);
  }
  getAllQuestionPapers(params) {
    this.questionBankService.getAllQuestionBanks(params).subscribe({
      next: res => {
        this.list = res.data.results;
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  viewQuestionPaper(id) {
    this.router.navigate([`/question-papers/view/${id}`]);
  }
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  static {
    this.ɵfac = function QuestionBankListComponent_Factory(t) {
      return new (t || QuestionBankListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_question_bank_service__WEBPACK_IMPORTED_MODULE_0__.QuestionBankService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: QuestionBankListComponent,
      selectors: [["app-question-bank-list"]],
      viewQuery: function QuestionBankListComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c1, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c2, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c3, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.boarddropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.mediumdropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.classdropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.subjectdropdown = _t.first);
        }
      },
      decls: 32,
      vars: 18,
      consts: [[1, "p-8", "bg-white", "rounded-sm", "min-h-[90vh]"], [1, "flex", "justify-between", "items-center"], ["data-testid", "question-papers-heading", 1, "text-xl", "md:text-3xl", "font-bold", "text-content", "main-heading", "leading-[48px]"], [1, "rounded-lg", "border", "border-primary", "relative", "bg-[#E5EDF67D]", "text-sm", "md:text-[16px]", "p-4", "md:p-6", "mt-5", "text-content-100", "flex", "items-center", "gap-4", "md:gap-2"], ["src", "assets/icons/lesson-info.svg", "alt", "", 1, "align-text-top"], [1, "flex", "flex-col", "md:flex-row", "gap-2", "justify-between", "items-center", "mt-4"], [1, "flex", "flex-col", "md:flex-row", "gap-2", "w-full", "md:w-auto"], ["data-testid", "generate-question-paper-btn", "routerLink", "/question-papers/generate", 1, "btn-primary", "flex", "gap-2", "items-center", "justify-center", "md:justify-start", "w-full", "md:w-fit", "border", "border-primary"], ["src", "assets/icons/edit_light.svg", "alt", ""], [1, "text-sm", "md:text-base"], [1, "relative", "w-full", "md:w-72"], ["type", "text", 1, "appearance-none", "rounded", "pl-8", "px-3", "text-content", "leading-tight", "focus:outline-none", "w-full", "border", "border-[#ccc]", "h-9", 3, "ngModel", "placeholder", "ngModelChange", "input"], ["src", "assets/icons/Search (1).svg", "alt", "", 1, "absolute", "left-2", "top-1/2", "transform", "-translate-y-1/2", "w-5", "h-5"], [1, "right_boxes", "w-full", "md:w-auto", "mt-2", "border", "rounded-lg", "p-4", "bg-primary-30"], [4, "ngTemplateOutlet"], ["aria-label", "Question Papers"], ["aria-live", "polite", "aria-atomic", "true", 1, "sr-only"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4", "mt-5"], ["class", "card px-6 py-8 rounded-xl bg-white border flex flex-col justify-between", 4, "ngFor", "ngForOf"], ["class", "flex items-center justify-center", 4, "ngIf"], ["elementGroup", ""], [1, "card", "px-6", "py-8", "rounded-xl", "bg-white", "border", "flex", "flex-col", "justify-between"], [1, "flex", "justify-between"], [1, "icon", "flex", "justify-center", "items-center", "bg-purple-100"], ["src", "assets/icons/question-paper.svg", "alt", ""], [1, "flex", "flex-col", "items-end"], [1, "text-xs", "font-normal", "text-content-70"], [1, "mt-5"], [1, "text-sm", "font-medium"], [1, "flex", "items-center", "justify-start", "my-2"], [1, "px-2", "py-1", "rounded-full", "text-primary", "bg-[#F1F4FD]", "text-[11px]", "inline-block", "me-2"], [1, "px-2", "py-1", "rounded-full", "text-[#DE3B40]", "bg-[#FDF2F2]", "text-[11px]", "inline-block"], [1, "mt-2", "text-xs", "font-normal", "text-content-70"], [4, "ngFor", "ngForOf"], [1, "mt-7", "w-full", "py-2", "rounded", "bg-tertiary", 3, "click"], [1, "text-white", "text-sm", "font-semibold"], [1, "subtopic-chip", "px-2", "py-1", "my-1", "rounded-full", "text-[#3D8248]", "bg-[#F1FDF3]", "text-[11px]", "me-2", "inline-block"], [1, "flex", "items-center", "justify-center"], [1, "px-6", "py-8", "rounded-xl", "w-[460px]", "h-[300px]", "bg-white", "border", "flex", "flex-col", "items-center"], [1, "rounded-full", "bg-warn-50", "p-4", "my-8"], ["src", "assets/icons/no-file.svg", "alt", ""], [1, "text-base", "text-center", "font-medium"], [1, "flex", "gap-4", "md:gap-1", "flex-wrap"], [1, "w-full", "md:w-28", "cursor-pointer", "md:flex-1"], [3, "dropDownValues", "config", "valueUpdate"], ["boardDropDown", ""], [1, "w-full", "md:w-28", "cursor-pointer", "capitalize", "md:flex-1"], ["mediumDropDown", ""], ["classDropDown", ""], ["subjectDropDown", ""]],
      template: function QuestionBankListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "img", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div")(8, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 5)(12, "div", 6)(13, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "img", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](17, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "div", 10)(19, "input", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function QuestionBankListComponent_Template_input_ngModelChange_19_listener($event) {
            return ctx.searchText = $event;
          })("input", function QuestionBankListComponent_Template_input_input_19_listener($event) {
            return ctx.searchInputChanged($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](20, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "img", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](23, QuestionBankListComponent_ng_container_23_Template, 1, 0, "ng-container", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "section", 15)(25, "p", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](28, QuestionBankListComponent_div_28_Template, 33, 23, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, QuestionBankListComponent_div_29_Template, 7, 3, "div", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](30, QuestionBankListComponent_ng_template_30_Template, 13, 8, "ng-template", null, 20, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
        }
        if (rf & 2) {
          const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](31);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 10, "Question Papers"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](10, 12, "Generate customized question paper that assess students' learning"), ". ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](17, 14, "Generate Question Paper"));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](20, 16, "Search Question Paper"));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.searchText);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngTemplateOutlet", _r3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", ctx.list.length, " question paper", ctx.list.length !== 1 ? "s" : "", " found. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.list);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.list.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.DropdownComponent, _angular_common__WEBPACK_IMPORTED_MODULE_8__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslatePipe],
      styles: ["h1[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n\n.icon[_ngcontent-%COMP%] {\n  height: 52px;\n  width: 52px;\n  border-radius: 50%;\n}\n\n.card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXN0aW9uLWJhbmstbGlzdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSw4QkFBQTtBQUNGIiwiZmlsZSI6InF1ZXN0aW9uLWJhbmstbGlzdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImgxIHtcbiAgZm9udC13ZWlnaHQ6IDcwMDsgLy9vbmx5IHRvIHJlbW92ZSBmcm9tIHNvbmFyUXViZVxufVxuXG4uaWNvbiB7XG4gIGhlaWdodDogNTJweDtcbiAgd2lkdGg6IDUycHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cblxuLmNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1saXN0L3F1ZXN0aW9uLWJhbmstbGlzdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSw4QkFBQTtBQUNGO0FBQ0Esd3JCQUF3ckIiLCJzb3VyY2VzQ29udGVudCI6WyJoMSB7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7IC8vb25seSB0byByZW1vdmUgZnJvbSBzb25hclF1YmVcbn1cblxuLmljb24ge1xuICBoZWlnaHQ6IDUycHg7XG4gIHdpZHRoOiA1MnB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG5cbi5jYXJkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 78596:
/*!*************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-routing.module.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   questionBankRoutingModule: () => (/* binding */ questionBankRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./question-bank-list/question-bank-list.component */ 90762);
/* harmony import */ var _question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./question-bank-generation/question-bank-generation.component */ 96090);
/* harmony import */ var _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./question-bank-view/question-bank-view.component */ 48540);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);






const routes = [{
  path: '',
  component: _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_0__.QuestionBankListComponent,
  data: {
    trackingTag: 'question-paper-list',
    idleTracking: 'custom'
  }
}, {
  path: 'generate',
  component: _question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_1__.QuestionBankGenerationComponent,
  data: {
    trackingTag: 'question-paper-generate'
  }
}, {
  path: 'view/:id',
  component: _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__.QuestionBankViewComponent,
  data: {
    trackingTag: 'view-question-bank'
  }
}];
class questionBankRoutingModule {
  static {
    this.ɵfac = function questionBankRoutingModule_Factory(t) {
      return new (t || questionBankRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: questionBankRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](questionBankRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 48540:
/*!********************************************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank-view/question-bank-view.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankViewComponent: () => (/* binding */ QuestionBankViewComponent)
/* harmony export */ });
/* harmony import */ var src_app_shared_utility_animations_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/animations.util */ 29066);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/utility/math-render.util */ 30084);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _question_bank_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../question-bank.service */ 69542);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var src_app_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/services/idle.service */ 7628);
/* harmony import */ var src_app_shared_services_question_bank_download_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared/services/question-bank-download.service */ 73298);
/* harmony import */ var src_app_shared_services_blue_print_export_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/shared/services/blue-print.export.service */ 960);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/core */ 90852);














const _c0 = ["questionPaperContent"];
function QuestionBankViewComponent_div_15_ng_container_17_tr_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "td", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const objective_r11 = ctx.$implicit;
    const questionBankObjective_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", objective_r11.unitName, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 4, ctx_r10.questionTypeLabels[questionBankObjective_r8.type] || questionBankObjective_r8.type), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", objective_r11.objective, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r10.formatMarks(questionBankObjective_r8.marksPerQuestion), " ");
  }
}
function QuestionBankViewComponent_div_15_ng_container_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_15_ng_container_17_tr_1_Template, 10, 6, "tr", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const questionBankObjective_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", questionBankObjective_r8.questionDistribution);
  }
}
function QuestionBankViewComponent_div_15_span_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span", 38)(1, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 3, "Total"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"](" : ", ctx_r7.formatMarks(ctx_r7.generatedTotalMarks), " ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 5, "Marks"), "");
  }
}
function QuestionBankViewComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 31)(1, "table", 32)(2, "thead")(3, "tr")(4, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](15, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](17, QuestionBankViewComponent_div_15_ng_container_17_Template, 2, 1, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, QuestionBankViewComponent_div_15_span_19_Template, 6, 7, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@slideInOut", ctx_r0.isOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](6, 7, "Topic"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](9, 9, "Question Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](12, 11, "Objective"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](15, 13, "Marks"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r0.questionBankDetails.bluePrintTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r0.questionBankDetails);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ng_container_4_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r24.content);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ng_container_4_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 49);
  }
  if (rf & 2) {
    const item_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r26.mediaSrc(item_r24), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_7_div_1_ng_container_4_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_7_div_1_ng_container_4_img_2_Template, 1, 1, "img", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r24 = ctx.$implicit;
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r21.isTextContent(item_r24));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r21.isTextContent(item_r24));
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_ng_container_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r32.content);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_ng_container_1_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 52);
  }
  if (rf & 2) {
    const item_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r34.mediaSrc(item_r32), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_ng_container_1_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_ng_container_1_img_2_Template, 1, 1, "img", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r32 = ctx.$implicit;
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r31.isTextContent(item_r32));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r31.isTextContent(item_r32));
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_ng_container_1_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r30 = ctx.$implicit;
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r29.contentItems(option_r30.text));
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_ul_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ul", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_7_div_1_ul_5_li_1_Template, 2, 1, "li", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const questionData_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", questionData_r19.options);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_div_6_ng_container_5_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r39.content);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_div_6_ng_container_5_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 52);
  }
  if (rf & 2) {
    const item_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r41.mediaSrc(item_r39), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_div_6_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_7_div_1_div_6_ng_container_5_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_7_div_1_div_6_ng_container_5_img_2_Template, 1, 1, "img", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r39 = ctx.$implicit;
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r38.isTextContent(item_r39));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r38.isTextContent(item_r39));
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 53)(1, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "span", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, QuestionBankViewComponent_div_42_div_7_div_1_div_6_ng_container_5_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const questionData_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 2, "Hint"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r23.contentItems(questionData_r19.keyAnswer));
  }
}
function QuestionBankViewComponent_div_42_div_7_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "div", 44)(2, "p", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, QuestionBankViewComponent_div_42_div_7_div_1_ng_container_4_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, QuestionBankViewComponent_div_42_div_7_div_1_ul_5_Template, 2, 1, "ul", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, QuestionBankViewComponent_div_42_div_7_div_1_div_6_Template, 6, 4, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const questionData_r19 = ctx.$implicit;
    const i_r20 = ctx.index;
    const questionBankData_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", i_r20 + 1, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r18.questionContentItems(questionData_r19));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", questionBankData_r14.type === "MCQ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r18.showAnswerKeys && questionData_r19.keyAnswer);
  }
}
function QuestionBankViewComponent_div_42_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_7_div_1_Template, 7, 4, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const questionBankData_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", questionBankData_r14.questions);
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r53.content);
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_2_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 52);
  }
  if (rf & 2) {
    const item_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r55.mediaSrc(item_r53), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_2_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_2_img_2_Template, 1, 1, "img", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r53 = ctx.$implicit;
    const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r51.isTextContent(item_r53));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r51.isTextContent(item_r53));
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_4_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r58.content);
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_4_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 52);
  }
  if (rf & 2) {
    const item_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r60.mediaSrc(item_r58), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_4_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_4_img_2_Template, 1, 1, "img", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r58 = ctx.$implicit;
    const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r52.isTextContent(item_r58));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r52.isTextContent(item_r58));
  }
}
function QuestionBankViewComponent_div_42_div_8_tr_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_2_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, QuestionBankViewComponent_div_42_div_8_tr_3_ng_container_4_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r50 = ctx.index;
    const questionBankData_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r47.contentItems(questionBankData_r14.primaryColumn[i_r50]));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r47.contentItems(questionBankData_r14.shuffledColumns[i_r50]));
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r69.content);
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_2_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 63);
  }
  if (rf & 2) {
    const item_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r71 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r71.mediaSrc(item_r69), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_2_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_2_img_2_Template, 1, 1, "img", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r69 = ctx.$implicit;
    const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r67.isTextContent(item_r69));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r67.isTextContent(item_r69));
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_4_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r74.content);
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_4_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 63);
  }
  if (rf & 2) {
    const item_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r76.mediaSrc(item_r74), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_4_span_1_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_4_img_2_Template, 1, 1, "img", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r74 = ctx.$implicit;
    const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r68.isTextContent(item_r74));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r68.isTextContent(item_r74));
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "td", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_2_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_ng_container_4_Template, 3, 2, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r66 = ctx.index;
    const questionBankData_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3).$implicit;
    const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r64.contentItems(questionBankData_r14.primaryColumn[i_r66]));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r64.contentItems(questionBankData_r14.originalColumns[i_r66]));
  }
}
function QuestionBankViewComponent_div_42_div_8_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 57)(1, "p", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "table", 32)(5, "thead")(6, "tr")(7, "th", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "th", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](14, QuestionBankViewComponent_div_42_div_8_div_4_tr_14_Template, 5, 2, "tr", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const questionBankData_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 4, "Correct Mapping"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](9, 6, "Left"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](12, 8, "Right (Answer)"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", questionBankData_r14.questions);
  }
}
function QuestionBankViewComponent_div_42_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "table", 32)(2, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](3, QuestionBankViewComponent_div_42_div_8_tr_3_Template, 5, 2, "tr", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, QuestionBankViewComponent_div_42_div_8_div_4_Template, 15, 10, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const questionBankData_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", questionBankData_r14.questions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r17.showAnswerKeys);
  }
}
function QuestionBankViewComponent_div_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 39)(1, "div", 40)(2, "h2", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "b", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, QuestionBankViewComponent_div_42_div_7_Template, 2, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, QuestionBankViewComponent_div_42_div_8_Template, 5, 2, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const questionBankData_r14 = ctx.$implicit;
    const q_r15 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"](" ", ctx_r2.utilityService.intToRoman(q_r15 + 1), ". ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 7, ctx_r2.questionTypeLabels[questionBankData_r14.type] || questionBankData_r14.type), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate3"]("", questionBankData_r14.numberOfQuestions, " X ", ctx_r2.formatMarks(questionBankData_r14.marksPerQuestion), " = ", ctx_r2.formatMarks(questionBankData_r14.numberOfQuestions * questionBankData_r14.marksPerQuestion), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", questionBankData_r14.type !== "MATCHING");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", questionBankData_r14.type === "MATCHING");
  }
}
function QuestionBankViewComponent_div_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r85 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "input", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankViewComponent_div_52_Template_input_ngModelChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r85);
      const ctx_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r84.questionBankFeedback.feedback = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "label", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const feedbackType_r82 = ctx.$implicit;
    const i_r83 = ctx.index;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r3.questionBankDetails == null ? null : ctx_r3.questionBankDetails.questionBank == null ? null : ctx_r3.questionBankDetails.questionBank.feedback == null ? null : ctx_r3.questionBankDetails.questionBank.feedback.feedback)("id", feedbackType_r82.name + i_r83)("name", feedbackType_r82.name + i_r83)("value", feedbackType_r82.name)("ngModel", ctx_r3.questionBankFeedback.feedback);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("for", feedbackType_r82.name + i_r83);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 8, feedbackType_r82.name), " ", feedbackType_r82.symbol, "");
  }
}
function QuestionBankViewComponent_button_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r87 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankViewComponent_button_56_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r87);
      const ctx_r86 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r86.submitFeedback());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", !ctx_r4.questionBankFeedback.feedback);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 2, "Submit Feedback"), " ");
  }
}
function QuestionBankViewComponent_div_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r90 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "div", 67)(2, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "img", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div", 70)(5, "p", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "button", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankViewComponent_div_60_Template_button_click_8_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r90);
      const doc_r88 = restoredCtx.$implicit;
      const ctx_r89 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r89.download(doc_r88.type));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const doc_r88 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](7, 3, doc_r88.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](10, 5, "Download"), " ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](11, 7, doc_r88.name), "");
  }
}
class QuestionBankViewComponent {
  constructor(route, questionBankService, utilityService, router, idleService, questionBankDownloadService, bluePrintExportService) {
    this.route = route;
    this.questionBankService = questionBankService;
    this.utilityService = utilityService;
    this.router = router;
    this.idleService = idleService;
    this.questionBankDownloadService = questionBankDownloadService;
    this.bluePrintExportService = bluePrintExportService;
    this.isOpen = false;
    this.questionBankFeedbackQuestion = 'Do you feel that the questions in this paper are relevant to your specified configuration and requirements?';
    this.questionBankFeedback = {
      feedback: '',
      overallFeedback: ''
    };
    this.questionBankFeedbackValues = [{
      name: 'Strongly Disagree',
      symbol: '😠'
    }, {
      name: 'Disagree',
      symbol: '😕'
    }, {
      name: 'Neutral',
      symbol: '😐'
    }, {
      name: 'Agree',
      symbol: '🙂'
    }, {
      name: 'Strongly Agree',
      symbol: '😃'
    }];
    this.shuffledColumns = [];
    this.primaryColumn = [];
    this.showAnswerKeys = false;
    this.questionTypeLabels = {};
    this.generatedTotalMarks = 0;
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.formatMarks;
    this.contentItems = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__.contentItems;
    this.questionContentItems = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__.questionContentItems;
    this.docTypes = [{
      name: 'Question Paper',
      type: 'qp'
    }, {
      name: 'Blueprint',
      type: 'bp'
    }, {
      name: 'Question paper + Answer Key',
      type: 'ak'
    }];
    this.route.params.subscribe(params => {
      this.questionBankId = params['id'];
    });
  }
  ngOnInit() {
    this.getQuestionBankDetails();
  }
  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }
  getQuestionBankDetails() {
    this.questionBankService.getQuestionBankDetails(this.questionBankId).subscribe({
      next: val => {
        this.questionBankDetails = val.data;
        this.questionBank = this.questionBankDetails.questionBank;
        this.generatedTotalMarks = this.questionBank.questions.reduce((sum, section) => sum + Number(section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0), 0);
        this.questionBankService.getPaperConfig({
          board: this.questionBankDetails.board,
          grade: String(this.questionBankDetails.grade),
          subjectName: this.questionBankDetails.subject
        }).subscribe(config => {
          this.questionTypeLabels = Object.fromEntries(config.questionTypes.map(type => [type.key, type.label]));
        });
        if (this.questionBank.questions.length) {
          this.questionBank.questions.forEach(section => {
            if (section.type === 'MATCHING' && section.questions?.length) {
              const colTwoVal = section.questions.map(ele => ele.value2);
              section.primaryColumn = section.questions.map(ele => ele.value1);
              section.originalColumns = [...colTwoVal];
              section.shuffledColumns = this.utilityService.shuffleOptions(colTwoVal);
            }
          });
        }
        if (this.questionBankDetails?.questionBank?.feedback) {
          this.questionBankFeedback = this.questionBankDetails?.questionBank?.feedback;
        }
        this.idleService.planId = this.questionBankDetails?.questionBank?._id;
        this.questionBankBluePrintData = this.flattenQuestionData(val.data.bluePrintTemplate);
        (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_3__.renderTexMath)(this.questionPaperContent.nativeElement);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  flattenQuestionData(data) {
    const result = [];
    data.forEach(section => {
      const {
        type,
        marksPerQuestion,
        questionDistribution
      } = section;
      questionDistribution.forEach(entry => {
        result.push({
          unitName: entry.unitName,
          type,
          objective: entry.objective,
          marks: marksPerQuestion
        });
      });
    });
    return result;
  }
  isTextContent(item) {
    return item.contentType === 'text/plain';
  }
  mediaSrc(item) {
    return `data:${item.contentType};base64,${item.content}`;
  }
  download(type) {
    if (type === 'qp') {
      this.downloadQp();
    } else if (type === 'ak') {
      this.downloadAnswerKey();
    } else {
      this.downloadBluePrint();
    }
  }
  downloadQp() {
    this.questionBankDownloadService.downloadQuestionBank({
      ...this.questionBankDetails,
      questionTypeLabels: this.questionTypeLabels
    });
    this.utilityService.showSuccess('Question paper downloaded successfully!');
  }
  downloadAnswerKey() {
    this.questionBankDownloadService.downloadAnswerKey({
      ...this.questionBankDetails,
      questionTypeLabels: this.questionTypeLabels
    });
    this.utilityService.showSuccess('Answer key downloaded successfully!');
  }
  toggleAnswerKeys() {
    this.showAnswerKeys = !this.showAnswerKeys;
    (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_3__.renderTexMath)(this.questionPaperContent.nativeElement);
  }
  downloadBluePrint() {
    const metaData = {
      schoolName: this.questionBankDetails?.questionBank?.metadata?.schoolName,
      medium: this.questionBankDetails?.medium,
      class: this.questionBankDetails?.grade,
      subject: this.questionBankDetails?.subject,
      examinationName: this.questionBankDetails?.examinationName,
      totalMarks: this.questionBankDetails?.totalMarks
    };
    this.bluePrintExportService.exportToWord(this.questionBankBluePrintData.map(item => ({
      ...item,
      type: this.questionTypeLabels[item.type] || item.type
    })), metaData);
  }
  backNavigation() {
    this.router.navigate(['/question-papers']);
  }
  submitFeedback() {
    const questionBankId = this.questionBankId;
    const feedback = {
      question: this.questionBankFeedbackQuestion,
      ...this.questionBankFeedback
    };
    this.questionBankService.updateQuestionBankFeedback(questionBankId, feedback).subscribe({
      next: res => {
        this.utilityService.handleResponse(res);
        this.getQuestionBankDetails();
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  static {
    this.ɵfac = function QuestionBankViewComponent_Factory(t) {
      return new (t || QuestionBankViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_question_bank_service__WEBPACK_IMPORTED_MODULE_4__.QuestionBankService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_5__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_6__.IdleService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_shared_services_question_bank_download_service__WEBPACK_IMPORTED_MODULE_7__.QuestionBankDownloadService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_shared_services_blue_print_export_service__WEBPACK_IMPORTED_MODULE_8__.BluePrintExportService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: QuestionBankViewComponent,
      selectors: [["app-question-bank-view"]],
      viewQuery: function QuestionBankViewComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵloadQuery"]()) && (ctx.questionPaperContent = _t.first);
        }
      },
      decls: 61,
      vars: 47,
      consts: [[1, "rounded-sm", "bg-shade-50", "p-5"], [1, "flex", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer", 3, "click"], ["data-testid", "question-paper-heading", 1, "text-lg", "md:text-xl", "font-bold", "text-content", "leading-[48px]"], [1, "max-w-full", "mx-auto", "py-4"], [1, "space-y-4"], [1, "bg-white", "shadow-md", "rounded-lg"], [1, "w-full", "text-left", "px-4", "py-2", "text-white", "text-sm", "bg-primary", "rounded-sm", 3, "click"], [1, "flex", "items-center", "justify-between"], ["alt", "", 3, "src"], ["class", "p-4 overflow-x-auto", 4, "ngIf"], [1, "grid", "gap-8", "mt-4", "grid-cols-1", "md:grid-cols-3"], [1, "w-full", "md:col-span-2"], [1, "mb-4"], [1, "flex", "w-full", "items-center", "justify-center", "gap-2", "px-6", "py-2", "rounded-lg", "font-semibold", "transition-all", 3, "ngClass", "click"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], ["tabindex", "0", "role", "region", 1, "question-bank-container", "p-4", "md:px-12", "rounded-md", "border", "h-[88vh]", "bg-white", "overflow-y-auto"], ["questionPaperContent", ""], [1, "text-center", "text-base", "font-bold", "text-content"], [1, "text-center", "text-sm", "mt-1", "font-bold", "text-content"], [1, "flex", "justify-between", "my-4"], ["class", "mt-5", "data-testid", "question-section", 4, "ngFor", "ngForOf"], ["data-testid", "feedback-section", 1, "p-4", "bg-white", "border", "rounded-lg"], [1, "font-semibold", "text-content", "mb-2"], [1, "mt-3", "gap-4", "flex", "text-[14px]", "flex-col"], [1, "font-semibold", "text-content"], [4, "ngFor", "ngForOf"], ["rows", "3", 1, "form-control", "mt-2", 3, "disabled", "ngModel", "placeholder", "ngModelChange"], ["type", "button", "class", "btn-primary w-full", "data-testid", "submit-feedback-btn", 3, "disabled", "click", 4, "ngIf"], [1, "font-semibold", "text-content", "mt-4"], [1, "p-4", "overflow-x-auto"], [1, "min-w-full", "table-auto", "border-collapse"], [1, "border", "px-2", "py-2"], [1, "flex", "justify-end"], ["class", "mr-4 mt-2", 4, "ngIf"], [1, "border", "px-2", "py-2", "capitalize", "text-sm"], [1, "border", "px-2", "py-2", "text-sm"], [1, "mr-4", "mt-2"], ["data-testid", "question-section", 1, "mt-5"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "font-bold", "text-content"], [1, "text-content", "flex", "items-center", "justify-end", "gap-1", "min-w-[15vw]", "md:min-w-[7vw]"], [4, "ngIf"], ["data-testid", "question-item", 1, "flex", "justify-between", "items-start", "mt-2", "gap-2"], [1, "text-content"], ["class", "list-alpha", 4, "ngIf"], ["class", "mt-1 mb-3 ml-4 px-3 py-2 bg-green-50 border border-green-200 rounded-md", 4, "ngIf"], ["class", "mt-2 max-h-64 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-2", "max-h-64", "max-w-full", 3, "src"], [1, "list-alpha"], ["class", "mt-1 max-h-32 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-1", "max-h-32", "max-w-full", 3, "src"], [1, "mt-1", "mb-3", "ml-4", "px-3", "py-2", "bg-green-50", "border", "border-green-200", "rounded-md"], [1, "text-xs", "font-bold", "text-green-700", "uppercase", "tracking-wider"], [1, "ml-2", "text-sm", "text-green-800", "font-medium"], ["class", "mt-2 mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-md", 4, "ngIf"], [1, "mt-2", "mb-3", "px-3", "py-2", "bg-green-50", "border", "border-green-200", "rounded-md"], [1, "text-xs", "font-bold", "text-green-700", "uppercase", "tracking-wider", "mb-1"], [1, "border", "border-green-200", "px-2", "py-1", "text-xs", "text-green-700", "bg-green-100"], [1, "border", "border-green-200", "px-2", "py-1", "text-sm", "text-green-800"], [1, "border", "border-green-200", "px-2", "py-1", "text-sm", "text-green-800", "font-medium"], ["class", "mt-1 max-h-24 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-1", "max-h-24", "max-w-full", 3, "src"], ["type", "radio", "data-testid", "feedback-radio", 1, "mt-[3px]", "md:mt-0", 3, "disabled", "id", "name", "value", "ngModel", "ngModelChange"], [1, "ms-1", 3, "for"], ["type", "button", "data-testid", "submit-feedback-btn", 1, "btn-primary", "w-full", 3, "disabled", "click"], [1, "flex", "bg-primary-50", "p-4", "rounded", "items-center", "mt-2"], [1, "flex", "items-center", "justify-center", "bg-primary", "p-2", "rounded-full"], ["src", "assets/icons/white-docx.svg", "alt", "", 1, "w-10"], [1, "ml-4", "w-full"], [1, "text-content", "text-sm", "font-semibold"], ["data-testid", "download-btn", 1, "btn-outline-primary", "mt-2", "w-full", "h-8", "text-xs", "hover:text-white", "hover:bg-primary", "transition-all", "font-semibold", 3, "click"]],
      template: function QuestionBankViewComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankViewComponent_Template_img_click_2_listener() {
            return ctx.backNavigation();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 4)(7, "div", 5)(8, "div", 6)(9, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankViewComponent_Template_button_click_9_listener() {
            return ctx.toggleAccordion();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 8)(11, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](13, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](14, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, QuestionBankViewComponent_div_15_Template, 20, 15, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "div", 11)(17, "div", 12)(18, "div", 13)(19, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankViewComponent_Template_button_click_19_listener() {
            return ctx.toggleAnswerKeys();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "svg", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](21, "path", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](23, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](24, "div", 17, 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](26, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "h2", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](28);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "h2", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "div", 21)(32, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](34, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](35, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](37, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](38, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](39);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](40, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](41, "hr");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](42, QuestionBankViewComponent_div_42_Template, 9, 9, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](43, "div", 23)(44, "div")(45, "h2", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](46);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](47, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](48, "div", 25)(49, "p", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](50);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](51, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](52, QuestionBankViewComponent_div_52_Template, 5, 10, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](53, "div")(54, "textarea", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankViewComponent_Template_textarea_ngModelChange_54_listener($event) {
            return ctx.questionBankFeedback.overallFeedback = $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](55, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](56, QuestionBankViewComponent_button_56_Template, 3, 4, "button", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](57, "h2", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](58);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](59, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](60, QuestionBankViewComponent_div_60_Template, 12, 9, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 25, "Question Paper"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](13, 27, "Click here to view question paper blue print"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("src", ctx.isOpen ? "assets/icons/up-arrow.svg" : "assets/icons/down-arrow.svg", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.isOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", ctx.showAnswerKeys ? "bg-primary text-white shadow-md" : "bg-white text-primary border border-primary hover:bg-primary-50");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](23, 29, ctx.showAnswerKeys ? "Hide Answer Keys" : "Show Answer Keys"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](26, 31, "Question paper content \u2014 scroll to read all questions"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx.questionBankDetails == null ? null : ctx.questionBankDetails.questionBank == null ? null : ctx.questionBankDetails.questionBank.metadata == null ? null : ctx.questionBankDetails.questionBank.metadata.schoolName, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx.questionBankDetails == null ? null : ctx.questionBankDetails.examinationName, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](34, 33, "Subject"), " : ", ctx.questionBankDetails == null ? null : ctx.questionBankDetails.subject, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](37, 35, "Class"), " : ", ctx.questionBankDetails == null ? null : ctx.questionBankDetails.grade, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](40, 37, "Marks"), " : ", ctx.formatMarks(ctx.generatedTotalMarks), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.questionBank == null ? null : ctx.questionBank.questions);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](47, 39, "Question Paper Feedback"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](51, 41, ctx.questionBankFeedbackQuestion), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.questionBankFeedbackValues);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](55, 43, "Leave your comments here"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx.questionBankDetails == null ? null : ctx.questionBankDetails.questionBank == null ? null : ctx.questionBankDetails.questionBank.feedback == null ? null : ctx.questionBankDetails.questionBank.feedback.feedback)("ngModel", ctx.questionBankFeedback.overallFeedback);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !(ctx.questionBankDetails == null ? null : ctx.questionBankDetails.questionBank == null ? null : ctx.questionBankDetails.questionBank.feedback == null ? null : ctx.questionBankDetails.questionBank.feedback.feedback));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](59, 45, "Download Documents"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.docTypes);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.RadioControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgModel, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslatePipe],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJxdWVzdGlvbi1iYW5rLXZpZXcuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay12aWV3L3F1ZXN0aW9uLWJhbmstdmlldy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esb0xBQW9MIiwic291cmNlUm9vdCI6IiJ9 */"],
      data: {
        animation: [src_app_shared_utility_animations_util__WEBPACK_IMPORTED_MODULE_0__.slideInOutAnimation]
      }
    });
  }
}

/***/ }),

/***/ 7845:
/*!*****************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank.module.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankModule: () => (/* binding */ QuestionBankModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/cdk/drag-drop */ 50854);
/* harmony import */ var _question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./question-bank-generation/question-bank-generation.component */ 96090);
/* harmony import */ var _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./question-bank-list/question-bank-list.component */ 90762);
/* harmony import */ var _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./question-bank-view/question-bank-view.component */ 48540);
/* harmony import */ var _question_bank_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./question-bank-routing.module */ 78596);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ng2-charts */ 57839);
/* harmony import */ var _question_bank_generation_question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./question-bank-generation/question-bank-template/question-bank-template.component */ 50261);
/* harmony import */ var _question_bank_generation_question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./question-bank-generation/question-bank-blue-print/question-bank-blue-print.component */ 67589);
/* harmony import */ var _question_bank_generation_question_tags_question_tags_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./question-bank-generation/question-tags/question-tags.component */ 72815);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);















class QuestionBankModule {
  static {
    this.ɵfac = function QuestionBankModule_Factory(t) {
      return new (t || QuestionBankModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({
      type: QuestionBankModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.ReactiveFormsModule, _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_12__.DragDropModule, _question_bank_routing_module__WEBPACK_IMPORTED_MODULE_3__.questionBankRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslateModule, src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.DropdownComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__.DeleteDetailComponent, ng2_charts__WEBPACK_IMPORTED_MODULE_14__.NgChartsModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](QuestionBankModule, {
    declarations: [_question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_0__.QuestionBankGenerationComponent, _question_bank_generation_question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_6__.QuestionBankTemplateComponent, _question_bank_generation_question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_7__.QuestionBankBluePrintComponent, _question_bank_generation_question_tags_question_tags_component__WEBPACK_IMPORTED_MODULE_8__.QuestionTagsComponent, _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_1__.QuestionBankListComponent, _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__.QuestionBankViewComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.ReactiveFormsModule, _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_12__.DragDropModule, _question_bank_routing_module__WEBPACK_IMPORTED_MODULE_3__.questionBankRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslateModule, src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.DropdownComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__.DeleteDetailComponent, ng2_charts__WEBPACK_IMPORTED_MODULE_14__.NgChartsModule]
  });
})();

/***/ }),

/***/ 69542:
/*!******************************************************************!*\
  !*** ./src/app/view/user/question-bank/question-bank.service.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuestionBankService: () => (/* binding */ QuestionBankService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 98764);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 61318);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_app_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/loader-message.service */ 79365);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);








class QuestionBankService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * Class constructor
   * @param http HttpClient
   */
  constructor(http) {
    super(http);
    this._questionTypesCache = {};
    this.setUri('question-bank');
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.apiUrl;
  }
  /**
   * Function to get chapter by semester
   * @param filters
   * @returns
   */
  getChaptersBySem(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          if (key === 'subject') {
            params = params.set(`filter[${key}]`, JSON.stringify(filters[key]));
          } else {
            params = params.set(`filter[${key}]`, filters[key]);
          }
        }
      });
    }
    return this.http.get(`${this.baseUrl}/chapter/get-by-sem`, {
      params
    });
  }
  /**
   * Function to get all question banks
   * @param filters
   * @param search
   * @returns
   */
  getAllQuestionBanks(filters, search) {
    const fields = ['_id', 'createdAt', 'subject', 'grade', 'examinationName', 'topics'];
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams({
      fromObject: {
        page: 1,
        limit: 999,
        fields
      }
    });
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          if (key === 'semester') {
            params = params.set(`filter[${key}]`, JSON.stringify(filters[key]));
          } else if (key === 'search') {
            params = params.set('search', filters[key]);
          } else {
            params = params.set(`filter[${key}]`, filters[key]);
          }
        }
      });
    }
    return this.get('list', params);
  }
  /**
   * Function to get question bank by id
   * @param id
   * @returns
   */
  getQuestionBankDetails(id) {
    return this.get(id);
  }
  generateQuestionBankBluePrint(data) {
    return this.http.post(`${this.getUrl()}generate-blue-print`, data);
  }
  /**
   * Function to generate question bank
   * @param data
   * @returns
   */
  generateQuestionBank(data) {
    return this.http.post(`${this.getUrl()}generate`, data, {
      context: new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpContext().set(src_app_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_1__.LOADER_MESSAGE, data.isPreview ? 'Generating AI questions...' : 'Creating question paper...')
    });
  }
  /**
   * Function to get question types for a subject
   * @param subject
   * @returns
   */
  getQuestionTypes(subject) {
    const key = subject.toLowerCase();
    if (this._questionTypesCache[key]) {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)({
        success: true,
        message: '',
        data: this._questionTypesCache[key]
      });
    }
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('subject', subject);
    return this.get('question-types', params).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.tap)(res => {
      if (Array.isArray(res.data)) {
        this._questionTypesCache[key] = res.data;
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(err => {
      console.error('[QuestionBankService] getQuestionTypes failed', err);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)({
        success: false,
        message: err?.message ?? 'Unknown error',
        data: []
      });
    }));
  }
  /**
   * Function to update question bank feedback
   * @param id
   * @param data
   * @returns
   */
  updateQuestionBankFeedback(id, data) {
    return this.patch(`feedback/${id}`, data);
  }
  // LBA Question Paper Generation Methods
  /**
   * Function to get classes for LBA QP
   * @returns Observable<string[]>
   */
  getClasses() {
    return this.http.get(`${this.baseUrl}/question-bank/meta/classes`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  /**
   * Function to get media for LBA QP
   * @param filters
   * @returns Observable<string[]>
   */
  getMedia(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (filters.class) {
      params = params.set('class', filters.class);
    }
    return this.http.get(`${this.baseUrl}/question-bank/meta/media`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  updateQuestionPaper(id, data) {
    // Use PUT or PATCH so the backend knows to update the existing record
    return this.http.put(`${this.baseUrl}/question-bank/${id}`, data);
  }
  /**
   * Function to get chapters for LBA QP
   * @param filters
   * @returns Observable<any[]>
   */
  getChapters(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (filters.class) {
      params = params.set('class', filters.class);
    }
    if (filters.medium) {
      params = params.set('medium', filters.medium);
    }
    if (filters.subject) {
      params = params.set('subject', filters.subject);
    }
    return this.http.get(`${this.baseUrl}/question-bank/meta/chapters`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  /**
   * Function to get difficulties for LBA QP
   * @returns Observable<string[]>
   */
  getDifficulties() {
    return this.http.get(`${this.baseUrl}/question-bank/meta/difficulties`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  /**
   * Function to get answer types for LBA QP
   * @returns Observable<string[]>
   */
  getAnswerTypes() {
    return this.http.get(`${this.baseUrl}/question-bank/meta/answer-types`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  getPaperConfig(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    params = params.set('board', filters.board);
    params = params.set('grade', filters.grade);
    params = params.set('subjectName', filters.subjectName);
    return this.http.get(`${this.baseUrl}/question-bank/meta/paper-config`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  /**
   * Function to get questions for LBA QP
   * @param filters
   * @returns Observable<any[]>
   */
  getLBAQuestions(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    const context = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpContext().set(src_app_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_1__.LOADER_MESSAGE, 'Retrieving textbook questions...');
    return this.http.get(`${this.baseUrl}/question-bank/questions`, {
      params,
      context
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(resp => resp.data));
  }
  /**
   * Function to generate LBA question paper
   * @param data
   * @returns Observable<any>
   */
  generateLBAQuestionPaper(data) {
    return this.http.post(`${this.baseUrl}/question-bank/generate`, data, {
      context: new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpContext().set(src_app_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_1__.LOADER_MESSAGE, 'Creating question paper...')
    });
  }
  getGrammarTopics(grade) {
    return this.http.get(`${this.baseUrl}/question-bank/meta/grammar-topics?grade=${grade}`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(res => res.data));
  }
  static {
    this.ɵfac = function QuestionBankService_Factory(t) {
      return new (t || QuestionBankService)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjectable"]({
      token: QuestionBankService,
      factory: QuestionBankService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 50854:
/*!**********************************************************!*\
  !*** ./node_modules/@angular/cdk/fesm2022/drag-drop.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CDK_DRAG_CONFIG: () => (/* binding */ CDK_DRAG_CONFIG),
/* harmony export */   CDK_DRAG_HANDLE: () => (/* binding */ CDK_DRAG_HANDLE),
/* harmony export */   CDK_DRAG_PARENT: () => (/* binding */ CDK_DRAG_PARENT),
/* harmony export */   CDK_DRAG_PLACEHOLDER: () => (/* binding */ CDK_DRAG_PLACEHOLDER),
/* harmony export */   CDK_DRAG_PREVIEW: () => (/* binding */ CDK_DRAG_PREVIEW),
/* harmony export */   CDK_DROP_LIST: () => (/* binding */ CDK_DROP_LIST),
/* harmony export */   CDK_DROP_LIST_GROUP: () => (/* binding */ CDK_DROP_LIST_GROUP),
/* harmony export */   CdkDrag: () => (/* binding */ CdkDrag),
/* harmony export */   CdkDragHandle: () => (/* binding */ CdkDragHandle),
/* harmony export */   CdkDragPlaceholder: () => (/* binding */ CdkDragPlaceholder),
/* harmony export */   CdkDragPreview: () => (/* binding */ CdkDragPreview),
/* harmony export */   CdkDropList: () => (/* binding */ CdkDropList),
/* harmony export */   CdkDropListGroup: () => (/* binding */ CdkDropListGroup),
/* harmony export */   DragDrop: () => (/* binding */ DragDrop),
/* harmony export */   DragDropModule: () => (/* binding */ DragDropModule),
/* harmony export */   DragDropRegistry: () => (/* binding */ DragDropRegistry),
/* harmony export */   DragRef: () => (/* binding */ DragRef),
/* harmony export */   DropListRef: () => (/* binding */ DropListRef),
/* harmony export */   copyArrayItem: () => (/* binding */ copyArrayItem),
/* harmony export */   moveItemInArray: () => (/* binding */ moveItemInArray),
/* harmony export */   transferArrayItem: () => (/* binding */ transferArrayItem)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/cdk/scrolling */ 79975);
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/cdk/platform */ 17699);
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/coercion */ 2814);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 2510);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 19240);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 20614);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 43942);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 63617);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 33900);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 64334);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 63037);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 98764);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs/operators */ 36647);
/* harmony import */ var _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/cdk/bidi */ 63680);












/**
 * Shallow-extends a stylesheet object with another stylesheet-like object.
 * Note that the keys in `source` have to be dash-cased.
 * @docs-private
 */
function extendStyles(dest, source, importantProperties) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      const value = source[key];
      if (value) {
        dest.setProperty(key, value, importantProperties?.has(key) ? 'important' : '');
      } else {
        dest.removeProperty(key);
      }
    }
  }
  return dest;
}
/**
 * Toggles whether the native drag interactions should be enabled for an element.
 * @param element Element on which to toggle the drag interactions.
 * @param enable Whether the drag interactions should be enabled.
 * @docs-private
 */
function toggleNativeDragInteractions(element, enable) {
  const userSelect = enable ? '' : 'none';
  extendStyles(element.style, {
    'touch-action': enable ? '' : 'none',
    '-webkit-user-drag': enable ? '' : 'none',
    '-webkit-tap-highlight-color': enable ? '' : 'transparent',
    'user-select': userSelect,
    '-ms-user-select': userSelect,
    '-webkit-user-select': userSelect,
    '-moz-user-select': userSelect
  });
}
/**
 * Toggles whether an element is visible while preserving its dimensions.
 * @param element Element whose visibility to toggle
 * @param enable Whether the element should be visible.
 * @param importantProperties Properties to be set as `!important`.
 * @docs-private
 */
function toggleVisibility(element, enable, importantProperties) {
  extendStyles(element.style, {
    position: enable ? '' : 'fixed',
    top: enable ? '' : '0',
    opacity: enable ? '' : '0',
    left: enable ? '' : '-999em'
  }, importantProperties);
}
/**
 * Combines a transform string with an optional other transform
 * that exited before the base transform was applied.
 */
function combineTransforms(transform, initialTransform) {
  return initialTransform && initialTransform != 'none' ? transform + ' ' + initialTransform : transform;
}

/** Parses a CSS time value to milliseconds. */
function parseCssTimeUnitsToMs(value) {
  // Some browsers will return it in seconds, whereas others will return milliseconds.
  const multiplier = value.toLowerCase().indexOf('ms') > -1 ? 1 : 1000;
  return parseFloat(value) * multiplier;
}
/** Gets the transform transition duration, including the delay, of an element in milliseconds. */
function getTransformTransitionDurationInMs(element) {
  const computedStyle = getComputedStyle(element);
  const transitionedProperties = parseCssPropertyValue(computedStyle, 'transition-property');
  const property = transitionedProperties.find(prop => prop === 'transform' || prop === 'all');
  // If there's no transition for `all` or `transform`, we shouldn't do anything.
  if (!property) {
    return 0;
  }
  // Get the index of the property that we're interested in and match
  // it up to the same index in `transition-delay` and `transition-duration`.
  const propertyIndex = transitionedProperties.indexOf(property);
  const rawDurations = parseCssPropertyValue(computedStyle, 'transition-duration');
  const rawDelays = parseCssPropertyValue(computedStyle, 'transition-delay');
  return parseCssTimeUnitsToMs(rawDurations[propertyIndex]) + parseCssTimeUnitsToMs(rawDelays[propertyIndex]);
}
/** Parses out multiple values from a computed style into an array. */
function parseCssPropertyValue(computedStyle, name) {
  const value = computedStyle.getPropertyValue(name);
  return value.split(',').map(part => part.trim());
}

/** Gets a mutable version of an element's bounding `ClientRect`. */
function getMutableClientRect(element) {
  const clientRect = element.getBoundingClientRect();
  // We need to clone the `clientRect` here, because all the values on it are readonly
  // and we need to be able to update them. Also we can't use a spread here, because
  // the values on a `ClientRect` aren't own properties. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
  return {
    top: clientRect.top,
    right: clientRect.right,
    bottom: clientRect.bottom,
    left: clientRect.left,
    width: clientRect.width,
    height: clientRect.height,
    x: clientRect.x,
    y: clientRect.y
  };
}
/**
 * Checks whether some coordinates are within a `ClientRect`.
 * @param clientRect ClientRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
function isInsideClientRect(clientRect, x, y) {
  const {
    top,
    bottom,
    left,
    right
  } = clientRect;
  return y >= top && y <= bottom && x >= left && x <= right;
}
/**
 * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
 * @param clientRect `ClientRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
function adjustClientRect(clientRect, top, left) {
  clientRect.top += top;
  clientRect.bottom = clientRect.top + clientRect.height;
  clientRect.left += left;
  clientRect.right = clientRect.left + clientRect.width;
}
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
function isPointerNearClientRect(rect, threshold, pointerX, pointerY) {
  const {
    top,
    right,
    bottom,
    left,
    width,
    height
  } = rect;
  const xThreshold = width * threshold;
  const yThreshold = height * threshold;
  return pointerY > top - yThreshold && pointerY < bottom + yThreshold && pointerX > left - xThreshold && pointerX < right + xThreshold;
}

/** Keeps track of the scroll position and dimensions of the parents of an element. */
class ParentPositionTracker {
  constructor(_document) {
    this._document = _document;
    /** Cached positions of the scrollable parent elements. */
    this.positions = new Map();
  }
  /** Clears the cached positions. */
  clear() {
    this.positions.clear();
  }
  /** Caches the positions. Should be called at the beginning of a drag sequence. */
  cache(elements) {
    this.clear();
    this.positions.set(this._document, {
      scrollPosition: this.getViewportScrollPosition()
    });
    elements.forEach(element => {
      this.positions.set(element, {
        scrollPosition: {
          top: element.scrollTop,
          left: element.scrollLeft
        },
        clientRect: getMutableClientRect(element)
      });
    });
  }
  /** Handles scrolling while a drag is taking place. */
  handleScroll(event) {
    const target = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__._getEventTarget)(event);
    const cachedPosition = this.positions.get(target);
    if (!cachedPosition) {
      return null;
    }
    const scrollPosition = cachedPosition.scrollPosition;
    let newTop;
    let newLeft;
    if (target === this._document) {
      const viewportScrollPosition = this.getViewportScrollPosition();
      newTop = viewportScrollPosition.top;
      newLeft = viewportScrollPosition.left;
    } else {
      newTop = target.scrollTop;
      newLeft = target.scrollLeft;
    }
    const topDifference = scrollPosition.top - newTop;
    const leftDifference = scrollPosition.left - newLeft;
    // Go through and update the cached positions of the scroll
    // parents that are inside the element that was scrolled.
    this.positions.forEach((position, node) => {
      if (position.clientRect && target !== node && target.contains(node)) {
        adjustClientRect(position.clientRect, topDifference, leftDifference);
      }
    });
    scrollPosition.top = newTop;
    scrollPosition.left = newLeft;
    return {
      top: topDifference,
      left: leftDifference
    };
  }
  /**
   * Gets the scroll position of the viewport. Note that we use the scrollX and scrollY directly,
   * instead of going through the `ViewportRuler`, because the first value the ruler looks at is
   * the top/left offset of the `document.documentElement` which works for most cases, but breaks
   * if the element is offset by something like the `BlockScrollStrategy`.
   */
  getViewportScrollPosition() {
    return {
      top: window.scrollY,
      left: window.scrollX
    };
  }
}

/** Creates a deep clone of an element. */
function deepCloneNode(node) {
  const clone = node.cloneNode(true);
  const descendantsWithId = clone.querySelectorAll('[id]');
  const nodeName = node.nodeName.toLowerCase();
  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  for (let i = 0; i < descendantsWithId.length; i++) {
    descendantsWithId[i].removeAttribute('id');
  }
  if (nodeName === 'canvas') {
    transferCanvasData(node, clone);
  } else if (nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea') {
    transferInputData(node, clone);
  }
  transferData('canvas', node, clone, transferCanvasData);
  transferData('input, textarea, select', node, clone, transferInputData);
  return clone;
}
/** Matches elements between an element and its clone and allows for their data to be cloned. */
function transferData(selector, node, clone, callback) {
  const descendantElements = node.querySelectorAll(selector);
  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll(selector);
    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[i], cloneElements[i]);
    }
  }
}
// Counter for unique cloned radio button names.
let cloneUniqueId = 0;
/** Transfers the data of one input element to another. */
function transferInputData(source, clone) {
  // Browsers throw an error when assigning the value of a file input programmatically.
  if (clone.type !== 'file') {
    clone.value = source.value;
  }
  // Radio button `name` attributes must be unique for radio button groups
  // otherwise original radio buttons can lose their checked state
  // once the clone is inserted in the DOM.
  if (clone.type === 'radio' && clone.name) {
    clone.name = `mat-clone-${clone.name}-${cloneUniqueId++}`;
  }
}
/** Transfers the data of one canvas element to another. */
function transferCanvasData(source, clone) {
  const context = clone.getContext('2d');
  if (context) {
    // In some cases `drawImage` can throw (e.g. if the canvas size is 0x0).
    // We can't do much about it so just ignore the error.
    try {
      context.drawImage(source, 0, 0);
    } catch {}
  }
}

/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__.normalizePassiveListenerOptions)({
  passive: true
});
/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__.normalizePassiveListenerOptions)({
  passive: false
});
/**
 * Time in milliseconds for which to ignore mouse events, after
 * receiving a touch event. Used to avoid doing double work for
 * touch devices where the browser fires fake mouse events, in
 * addition to touch events.
 */
const MOUSE_EVENT_IGNORE_TIME = 800;
/** Inline styles to be set as `!important` while dragging. */
const dragImportantProperties = new Set([
// Needs to be important, because some `mat-table` sets `position: sticky !important`. See #22781.
'position']);
/**
 * Reference to a draggable item. Used to manipulate or dispose of the item.
 */
class DragRef {
  /** Whether starting to drag this element is disabled. */
  get disabled() {
    return this._disabled || !!(this._dropContainer && this._dropContainer.disabled);
  }
  set disabled(value) {
    const newValue = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(value);
    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._toggleNativeDragInteractions();
      this._handles.forEach(handle => toggleNativeDragInteractions(handle, newValue));
    }
  }
  constructor(element, _config, _document, _ngZone, _viewportRuler, _dragDropRegistry) {
    this._config = _config;
    this._document = _document;
    this._ngZone = _ngZone;
    this._viewportRuler = _viewportRuler;
    this._dragDropRegistry = _dragDropRegistry;
    /**
     * CSS `transform` applied to the element when it isn't being dragged. We need a
     * passive transform in order for the dragged element to retain its new position
     * after the user has stopped dragging and because we need to know the relative
     * position in case they start dragging again. This corresponds to `element.style.transform`.
     */
    this._passiveTransform = {
      x: 0,
      y: 0
    };
    /** CSS `transform` that is applied to the element while it's being dragged. */
    this._activeTransform = {
      x: 0,
      y: 0
    };
    /**
     * Whether the dragging sequence has been started. Doesn't
     * necessarily mean that the element has been moved.
     */
    this._hasStartedDragging = false;
    /** Emits when the item is being moved. */
    this._moveEvents = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Subscription to pointer movement events. */
    this._pointerMoveSubscription = rxjs__WEBPACK_IMPORTED_MODULE_3__.Subscription.EMPTY;
    /** Subscription to the event that is dispatched when the user lifts their pointer. */
    this._pointerUpSubscription = rxjs__WEBPACK_IMPORTED_MODULE_3__.Subscription.EMPTY;
    /** Subscription to the viewport being scrolled. */
    this._scrollSubscription = rxjs__WEBPACK_IMPORTED_MODULE_3__.Subscription.EMPTY;
    /** Subscription to the viewport being resized. */
    this._resizeSubscription = rxjs__WEBPACK_IMPORTED_MODULE_3__.Subscription.EMPTY;
    /** Cached reference to the boundary element. */
    this._boundaryElement = null;
    /** Whether the native dragging interactions have been enabled on the root element. */
    this._nativeInteractionsEnabled = true;
    /** Elements that can be used to drag the draggable item. */
    this._handles = [];
    /** Registered handles that are currently disabled. */
    this._disabledHandles = new Set();
    /** Layout direction of the item. */
    this._direction = 'ltr';
    /**
     * Amount of milliseconds to wait after the user has put their
     * pointer down before starting to drag the element.
     */
    this.dragStartDelay = 0;
    this._disabled = false;
    /** Emits as the drag sequence is being prepared. */
    this.beforeStarted = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user starts dragging the item. */
    this.started = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user has released a drag item, before any animations have started. */
    this.released = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user stops dragging an item in the container. */
    this.ended = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user has moved the item into a new container. */
    this.entered = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user removes the item its container by dragging it into another container. */
    this.exited = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user drops the item inside a container. */
    this.dropped = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Emits as the user is dragging the item. Use with caution,
     * because this event will fire for every pixel that the user has dragged.
     */
    this.moved = this._moveEvents;
    /** Handler for the `mousedown`/`touchstart` events. */
    this._pointerDown = event => {
      this.beforeStarted.next();
      // Delegate the event based on whether it started from a handle or the element itself.
      if (this._handles.length) {
        const targetHandle = this._getTargetHandle(event);
        if (targetHandle && !this._disabledHandles.has(targetHandle) && !this.disabled) {
          this._initializeDragSequence(targetHandle, event);
        }
      } else if (!this.disabled) {
        this._initializeDragSequence(this._rootElement, event);
      }
    };
    /** Handler that is invoked when the user moves their pointer after they've initiated a drag. */
    this._pointerMove = event => {
      const pointerPosition = this._getPointerPositionOnPage(event);
      if (!this._hasStartedDragging) {
        const distanceX = Math.abs(pointerPosition.x - this._pickupPositionOnPage.x);
        const distanceY = Math.abs(pointerPosition.y - this._pickupPositionOnPage.y);
        const isOverThreshold = distanceX + distanceY >= this._config.dragStartThreshold;
        // Only start dragging after the user has moved more than the minimum distance in either
        // direction. Note that this is preferable over doing something like `skip(minimumDistance)`
        // in the `pointerMove` subscription, because we're not guaranteed to have one move event
        // per pixel of movement (e.g. if the user moves their pointer quickly).
        if (isOverThreshold) {
          const isDelayElapsed = Date.now() >= this._dragStartTime + this._getDragStartDelay(event);
          const container = this._dropContainer;
          if (!isDelayElapsed) {
            this._endDragSequence(event);
            return;
          }
          // Prevent other drag sequences from starting while something in the container is still
          // being dragged. This can happen while we're waiting for the drop animation to finish
          // and can cause errors, because some elements might still be moving around.
          if (!container || !container.isDragging() && !container.isReceiving()) {
            // Prevent the default action as soon as the dragging sequence is considered as
            // "started" since waiting for the next event can allow the device to begin scrolling.
            event.preventDefault();
            this._hasStartedDragging = true;
            this._ngZone.run(() => this._startDragSequence(event));
          }
        }
        return;
      }
      // We prevent the default action down here so that we know that dragging has started. This is
      // important for touch devices where doing this too early can unnecessarily block scrolling,
      // if there's a dragging delay.
      event.preventDefault();
      const constrainedPointerPosition = this._getConstrainedPointerPosition(pointerPosition);
      this._hasMoved = true;
      this._lastKnownPointerPosition = pointerPosition;
      this._updatePointerDirectionDelta(constrainedPointerPosition);
      if (this._dropContainer) {
        this._updateActiveDropContainer(constrainedPointerPosition, pointerPosition);
      } else {
        // If there's a position constraint function, we want the element's top/left to be at the
        // specific position on the page. Use the initial position as a reference if that's the case.
        const offset = this.constrainPosition ? this._initialClientRect : this._pickupPositionOnPage;
        const activeTransform = this._activeTransform;
        activeTransform.x = constrainedPointerPosition.x - offset.x + this._passiveTransform.x;
        activeTransform.y = constrainedPointerPosition.y - offset.y + this._passiveTransform.y;
        this._applyRootElementTransform(activeTransform.x, activeTransform.y);
      }
      // Since this event gets fired for every pixel while dragging, we only
      // want to fire it if the consumer opted into it. Also we have to
      // re-enter the zone because we run all of the events on the outside.
      if (this._moveEvents.observers.length) {
        this._ngZone.run(() => {
          this._moveEvents.next({
            source: this,
            pointerPosition: constrainedPointerPosition,
            event,
            distance: this._getDragDistance(constrainedPointerPosition),
            delta: this._pointerDirectionDelta
          });
        });
      }
    };
    /** Handler that is invoked when the user lifts their pointer up, after initiating a drag. */
    this._pointerUp = event => {
      this._endDragSequence(event);
    };
    /** Handles a native `dragstart` event. */
    this._nativeDragStart = event => {
      if (this._handles.length) {
        const targetHandle = this._getTargetHandle(event);
        if (targetHandle && !this._disabledHandles.has(targetHandle) && !this.disabled) {
          event.preventDefault();
        }
      } else if (!this.disabled) {
        // Usually this isn't necessary since the we prevent the default action in `pointerDown`,
        // but some cases like dragging of links can slip through (see #24403).
        event.preventDefault();
      }
    };
    this.withRootElement(element).withParent(_config.parentDragRef || null);
    this._parentPositions = new ParentPositionTracker(_document);
    _dragDropRegistry.registerDragItem(this);
  }
  /**
   * Returns the element that is being used as a placeholder
   * while the current element is being dragged.
   */
  getPlaceholderElement() {
    return this._placeholder;
  }
  /** Returns the root draggable element. */
  getRootElement() {
    return this._rootElement;
  }
  /**
   * Gets the currently-visible element that represents the drag item.
   * While dragging this is the placeholder, otherwise it's the root element.
   */
  getVisibleElement() {
    return this.isDragging() ? this.getPlaceholderElement() : this.getRootElement();
  }
  /** Registers the handles that can be used to drag the element. */
  withHandles(handles) {
    this._handles = handles.map(handle => (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(handle));
    this._handles.forEach(handle => toggleNativeDragInteractions(handle, this.disabled));
    this._toggleNativeDragInteractions();
    // Delete any lingering disabled handles that may have been destroyed. Note that we re-create
    // the set, rather than iterate over it and filter out the destroyed handles, because while
    // the ES spec allows for sets to be modified while they're being iterated over, some polyfills
    // use an array internally which may throw an error.
    const disabledHandles = new Set();
    this._disabledHandles.forEach(handle => {
      if (this._handles.indexOf(handle) > -1) {
        disabledHandles.add(handle);
      }
    });
    this._disabledHandles = disabledHandles;
    return this;
  }
  /**
   * Registers the template that should be used for the drag preview.
   * @param template Template that from which to stamp out the preview.
   */
  withPreviewTemplate(template) {
    this._previewTemplate = template;
    return this;
  }
  /**
   * Registers the template that should be used for the drag placeholder.
   * @param template Template that from which to stamp out the placeholder.
   */
  withPlaceholderTemplate(template) {
    this._placeholderTemplate = template;
    return this;
  }
  /**
   * Sets an alternate drag root element. The root element is the element that will be moved as
   * the user is dragging. Passing an alternate root element is useful when trying to enable
   * dragging on an element that you might not have access to.
   */
  withRootElement(rootElement) {
    const element = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(rootElement);
    if (element !== this._rootElement) {
      if (this._rootElement) {
        this._removeRootElementListeners(this._rootElement);
      }
      this._ngZone.runOutsideAngular(() => {
        element.addEventListener('mousedown', this._pointerDown, activeEventListenerOptions);
        element.addEventListener('touchstart', this._pointerDown, passiveEventListenerOptions);
        element.addEventListener('dragstart', this._nativeDragStart, activeEventListenerOptions);
      });
      this._initialTransform = undefined;
      this._rootElement = element;
    }
    if (typeof SVGElement !== 'undefined' && this._rootElement instanceof SVGElement) {
      this._ownerSVGElement = this._rootElement.ownerSVGElement;
    }
    return this;
  }
  /**
   * Element to which the draggable's position will be constrained.
   */
  withBoundaryElement(boundaryElement) {
    this._boundaryElement = boundaryElement ? (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(boundaryElement) : null;
    this._resizeSubscription.unsubscribe();
    if (boundaryElement) {
      this._resizeSubscription = this._viewportRuler.change(10).subscribe(() => this._containInsideBoundaryOnResize());
    }
    return this;
  }
  /** Sets the parent ref that the ref is nested in.  */
  withParent(parent) {
    this._parentDragRef = parent;
    return this;
  }
  /** Removes the dragging functionality from the DOM element. */
  dispose() {
    this._removeRootElementListeners(this._rootElement);
    // Do this check before removing from the registry since it'll
    // stop being considered as dragged once it is removed.
    if (this.isDragging()) {
      // Since we move out the element to the end of the body while it's being
      // dragged, we have to make sure that it's removed if it gets destroyed.
      this._rootElement?.remove();
    }
    this._anchor?.remove();
    this._destroyPreview();
    this._destroyPlaceholder();
    this._dragDropRegistry.removeDragItem(this);
    this._removeSubscriptions();
    this.beforeStarted.complete();
    this.started.complete();
    this.released.complete();
    this.ended.complete();
    this.entered.complete();
    this.exited.complete();
    this.dropped.complete();
    this._moveEvents.complete();
    this._handles = [];
    this._disabledHandles.clear();
    this._dropContainer = undefined;
    this._resizeSubscription.unsubscribe();
    this._parentPositions.clear();
    this._boundaryElement = this._rootElement = this._ownerSVGElement = this._placeholderTemplate = this._previewTemplate = this._anchor = this._parentDragRef = null;
  }
  /** Checks whether the element is currently being dragged. */
  isDragging() {
    return this._hasStartedDragging && this._dragDropRegistry.isDragging(this);
  }
  /** Resets a standalone drag item to its initial position. */
  reset() {
    this._rootElement.style.transform = this._initialTransform || '';
    this._activeTransform = {
      x: 0,
      y: 0
    };
    this._passiveTransform = {
      x: 0,
      y: 0
    };
  }
  /**
   * Sets a handle as disabled. While a handle is disabled, it'll capture and interrupt dragging.
   * @param handle Handle element that should be disabled.
   */
  disableHandle(handle) {
    if (!this._disabledHandles.has(handle) && this._handles.indexOf(handle) > -1) {
      this._disabledHandles.add(handle);
      toggleNativeDragInteractions(handle, true);
    }
  }
  /**
   * Enables a handle, if it has been disabled.
   * @param handle Handle element to be enabled.
   */
  enableHandle(handle) {
    if (this._disabledHandles.has(handle)) {
      this._disabledHandles.delete(handle);
      toggleNativeDragInteractions(handle, this.disabled);
    }
  }
  /** Sets the layout direction of the draggable item. */
  withDirection(direction) {
    this._direction = direction;
    return this;
  }
  /** Sets the container that the item is part of. */
  _withDropContainer(container) {
    this._dropContainer = container;
  }
  /**
   * Gets the current position in pixels the draggable outside of a drop container.
   */
  getFreeDragPosition() {
    const position = this.isDragging() ? this._activeTransform : this._passiveTransform;
    return {
      x: position.x,
      y: position.y
    };
  }
  /**
   * Sets the current position in pixels the draggable outside of a drop container.
   * @param value New position to be set.
   */
  setFreeDragPosition(value) {
    this._activeTransform = {
      x: 0,
      y: 0
    };
    this._passiveTransform.x = value.x;
    this._passiveTransform.y = value.y;
    if (!this._dropContainer) {
      this._applyRootElementTransform(value.x, value.y);
    }
    return this;
  }
  /**
   * Sets the container into which to insert the preview element.
   * @param value Container into which to insert the preview.
   */
  withPreviewContainer(value) {
    this._previewContainer = value;
    return this;
  }
  /** Updates the item's sort order based on the last-known pointer position. */
  _sortFromLastPointerPosition() {
    const position = this._lastKnownPointerPosition;
    if (position && this._dropContainer) {
      this._updateActiveDropContainer(this._getConstrainedPointerPosition(position), position);
    }
  }
  /** Unsubscribes from the global subscriptions. */
  _removeSubscriptions() {
    this._pointerMoveSubscription.unsubscribe();
    this._pointerUpSubscription.unsubscribe();
    this._scrollSubscription.unsubscribe();
  }
  /** Destroys the preview element and its ViewRef. */
  _destroyPreview() {
    this._preview?.remove();
    this._previewRef?.destroy();
    this._preview = this._previewRef = null;
  }
  /** Destroys the placeholder element and its ViewRef. */
  _destroyPlaceholder() {
    this._placeholder?.remove();
    this._placeholderRef?.destroy();
    this._placeholder = this._placeholderRef = null;
  }
  /**
   * Clears subscriptions and stops the dragging sequence.
   * @param event Browser event object that ended the sequence.
   */
  _endDragSequence(event) {
    // Note that here we use `isDragging` from the service, rather than from `this`.
    // The difference is that the one from the service reflects whether a dragging sequence
    // has been initiated, whereas the one on `this` includes whether the user has passed
    // the minimum dragging threshold.
    if (!this._dragDropRegistry.isDragging(this)) {
      return;
    }
    this._removeSubscriptions();
    this._dragDropRegistry.stopDragging(this);
    this._toggleNativeDragInteractions();
    if (this._handles) {
      this._rootElement.style.webkitTapHighlightColor = this._rootElementTapHighlight;
    }
    if (!this._hasStartedDragging) {
      return;
    }
    this.released.next({
      source: this,
      event
    });
    if (this._dropContainer) {
      // Stop scrolling immediately, instead of waiting for the animation to finish.
      this._dropContainer._stopScrolling();
      this._animatePreviewToPlaceholder().then(() => {
        this._cleanupDragArtifacts(event);
        this._cleanupCachedDimensions();
        this._dragDropRegistry.stopDragging(this);
      });
    } else {
      // Convert the active transform into a passive one. This means that next time
      // the user starts dragging the item, its position will be calculated relatively
      // to the new passive transform.
      this._passiveTransform.x = this._activeTransform.x;
      const pointerPosition = this._getPointerPositionOnPage(event);
      this._passiveTransform.y = this._activeTransform.y;
      this._ngZone.run(() => {
        this.ended.next({
          source: this,
          distance: this._getDragDistance(pointerPosition),
          dropPoint: pointerPosition,
          event
        });
      });
      this._cleanupCachedDimensions();
      this._dragDropRegistry.stopDragging(this);
    }
  }
  /** Starts the dragging sequence. */
  _startDragSequence(event) {
    if (isTouchEvent(event)) {
      this._lastTouchEventTime = Date.now();
    }
    this._toggleNativeDragInteractions();
    const dropContainer = this._dropContainer;
    if (dropContainer) {
      const element = this._rootElement;
      const parent = element.parentNode;
      const placeholder = this._placeholder = this._createPlaceholderElement();
      const anchor = this._anchor = this._anchor || this._document.createComment('');
      // Needs to happen before the root element is moved.
      const shadowRoot = this._getShadowRoot();
      // Insert an anchor node so that we can restore the element's position in the DOM.
      parent.insertBefore(anchor, element);
      // There's no risk of transforms stacking when inside a drop container so
      // we can keep the initial transform up to date any time dragging starts.
      this._initialTransform = element.style.transform || '';
      // Create the preview after the initial transform has
      // been cached, because it can be affected by the transform.
      this._preview = this._createPreviewElement();
      // We move the element out at the end of the body and we make it hidden, because keeping it in
      // place will throw off the consumer's `:last-child` selectors. We can't remove the element
      // from the DOM completely, because iOS will stop firing all subsequent events in the chain.
      toggleVisibility(element, false, dragImportantProperties);
      this._document.body.appendChild(parent.replaceChild(placeholder, element));
      this._getPreviewInsertionPoint(parent, shadowRoot).appendChild(this._preview);
      this.started.next({
        source: this,
        event
      }); // Emit before notifying the container.
      dropContainer.start();
      this._initialContainer = dropContainer;
      this._initialIndex = dropContainer.getItemIndex(this);
    } else {
      this.started.next({
        source: this,
        event
      });
      this._initialContainer = this._initialIndex = undefined;
    }
    // Important to run after we've called `start` on the parent container
    // so that it has had time to resolve its scrollable parents.
    this._parentPositions.cache(dropContainer ? dropContainer.getScrollableParents() : []);
  }
  /**
   * Sets up the different variables and subscriptions
   * that will be necessary for the dragging sequence.
   * @param referenceElement Element that started the drag sequence.
   * @param event Browser event object that started the sequence.
   */
  _initializeDragSequence(referenceElement, event) {
    // Stop propagation if the item is inside another
    // draggable so we don't start multiple drag sequences.
    if (this._parentDragRef) {
      event.stopPropagation();
    }
    const isDragging = this.isDragging();
    const isTouchSequence = isTouchEvent(event);
    const isAuxiliaryMouseButton = !isTouchSequence && event.button !== 0;
    const rootElement = this._rootElement;
    const target = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__._getEventTarget)(event);
    const isSyntheticEvent = !isTouchSequence && this._lastTouchEventTime && this._lastTouchEventTime + MOUSE_EVENT_IGNORE_TIME > Date.now();
    const isFakeEvent = isTouchSequence ? (0,_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__.isFakeTouchstartFromScreenReader)(event) : (0,_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__.isFakeMousedownFromScreenReader)(event);
    // If the event started from an element with the native HTML drag&drop, it'll interfere
    // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
    // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
    // it's flaky and it fails if the user drags it away quickly. Also note that we only want
    // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
    // events from firing on touch devices.
    if (target && target.draggable && event.type === 'mousedown') {
      event.preventDefault();
    }
    // Abort if the user is already dragging or is using a mouse button other than the primary one.
    if (isDragging || isAuxiliaryMouseButton || isSyntheticEvent || isFakeEvent) {
      return;
    }
    // If we've got handles, we need to disable the tap highlight on the entire root element,
    // otherwise iOS will still add it, even though all the drag interactions on the handle
    // are disabled.
    if (this._handles.length) {
      const rootStyles = rootElement.style;
      this._rootElementTapHighlight = rootStyles.webkitTapHighlightColor || '';
      rootStyles.webkitTapHighlightColor = 'transparent';
    }
    this._hasStartedDragging = this._hasMoved = false;
    // Avoid multiple subscriptions and memory leaks when multi touch
    // (isDragging check above isn't enough because of possible temporal and/or dimensional delays)
    this._removeSubscriptions();
    this._initialClientRect = this._rootElement.getBoundingClientRect();
    this._pointerMoveSubscription = this._dragDropRegistry.pointerMove.subscribe(this._pointerMove);
    this._pointerUpSubscription = this._dragDropRegistry.pointerUp.subscribe(this._pointerUp);
    this._scrollSubscription = this._dragDropRegistry.scrolled(this._getShadowRoot()).subscribe(scrollEvent => this._updateOnScroll(scrollEvent));
    if (this._boundaryElement) {
      this._boundaryRect = getMutableClientRect(this._boundaryElement);
    }
    // If we have a custom preview we can't know ahead of time how large it'll be so we position
    // it next to the cursor. The exception is when the consumer has opted into making the preview
    // the same size as the root element, in which case we do know the size.
    const previewTemplate = this._previewTemplate;
    this._pickupPositionInElement = previewTemplate && previewTemplate.template && !previewTemplate.matchSize ? {
      x: 0,
      y: 0
    } : this._getPointerPositionInElement(this._initialClientRect, referenceElement, event);
    const pointerPosition = this._pickupPositionOnPage = this._lastKnownPointerPosition = this._getPointerPositionOnPage(event);
    this._pointerDirectionDelta = {
      x: 0,
      y: 0
    };
    this._pointerPositionAtLastDirectionChange = {
      x: pointerPosition.x,
      y: pointerPosition.y
    };
    this._dragStartTime = Date.now();
    this._dragDropRegistry.startDragging(this, event);
  }
  /** Cleans up the DOM artifacts that were added to facilitate the element being dragged. */
  _cleanupDragArtifacts(event) {
    // Restore the element's visibility and insert it at its old position in the DOM.
    // It's important that we maintain the position, because moving the element around in the DOM
    // can throw off `NgFor` which does smart diffing and re-creates elements only when necessary,
    // while moving the existing elements in all other cases.
    toggleVisibility(this._rootElement, true, dragImportantProperties);
    this._anchor.parentNode.replaceChild(this._rootElement, this._anchor);
    this._destroyPreview();
    this._destroyPlaceholder();
    this._initialClientRect = this._boundaryRect = this._previewRect = this._initialTransform = undefined;
    // Re-enter the NgZone since we bound `document` events on the outside.
    this._ngZone.run(() => {
      const container = this._dropContainer;
      const currentIndex = container.getItemIndex(this);
      const pointerPosition = this._getPointerPositionOnPage(event);
      const distance = this._getDragDistance(pointerPosition);
      const isPointerOverContainer = container._isOverContainer(pointerPosition.x, pointerPosition.y);
      this.ended.next({
        source: this,
        distance,
        dropPoint: pointerPosition,
        event
      });
      this.dropped.next({
        item: this,
        currentIndex,
        previousIndex: this._initialIndex,
        container: container,
        previousContainer: this._initialContainer,
        isPointerOverContainer,
        distance,
        dropPoint: pointerPosition,
        event
      });
      container.drop(this, currentIndex, this._initialIndex, this._initialContainer, isPointerOverContainer, distance, pointerPosition, event);
      this._dropContainer = this._initialContainer;
    });
  }
  /**
   * Updates the item's position in its drop container, or moves it
   * into a new one, depending on its current drag position.
   */
  _updateActiveDropContainer({
    x,
    y
  }, {
    x: rawX,
    y: rawY
  }) {
    // Drop container that draggable has been moved into.
    let newContainer = this._initialContainer._getSiblingContainerFromPosition(this, x, y);
    // If we couldn't find a new container to move the item into, and the item has left its
    // initial container, check whether the it's over the initial container. This handles the
    // case where two containers are connected one way and the user tries to undo dragging an
    // item into a new container.
    if (!newContainer && this._dropContainer !== this._initialContainer && this._initialContainer._isOverContainer(x, y)) {
      newContainer = this._initialContainer;
    }
    if (newContainer && newContainer !== this._dropContainer) {
      this._ngZone.run(() => {
        // Notify the old container that the item has left.
        this.exited.next({
          item: this,
          container: this._dropContainer
        });
        this._dropContainer.exit(this);
        // Notify the new container that the item has entered.
        this._dropContainer = newContainer;
        this._dropContainer.enter(this, x, y, newContainer === this._initialContainer &&
        // If we're re-entering the initial container and sorting is disabled,
        // put item the into its starting index to begin with.
        newContainer.sortingDisabled ? this._initialIndex : undefined);
        this.entered.next({
          item: this,
          container: newContainer,
          currentIndex: newContainer.getItemIndex(this)
        });
      });
    }
    // Dragging may have been interrupted as a result of the events above.
    if (this.isDragging()) {
      this._dropContainer._startScrollingIfNecessary(rawX, rawY);
      this._dropContainer._sortItem(this, x, y, this._pointerDirectionDelta);
      if (this.constrainPosition) {
        this._applyPreviewTransform(x, y);
      } else {
        this._applyPreviewTransform(x - this._pickupPositionInElement.x, y - this._pickupPositionInElement.y);
      }
    }
  }
  /**
   * Creates the element that will be rendered next to the user's pointer
   * and will be used as a preview of the element that is being dragged.
   */
  _createPreviewElement() {
    const previewConfig = this._previewTemplate;
    const previewClass = this.previewClass;
    const previewTemplate = previewConfig ? previewConfig.template : null;
    let preview;
    if (previewTemplate && previewConfig) {
      // Measure the element before we've inserted the preview
      // since the insertion could throw off the measurement.
      const rootRect = previewConfig.matchSize ? this._initialClientRect : null;
      const viewRef = previewConfig.viewContainer.createEmbeddedView(previewTemplate, previewConfig.context);
      viewRef.detectChanges();
      preview = getRootNode(viewRef, this._document);
      this._previewRef = viewRef;
      if (previewConfig.matchSize) {
        matchElementSize(preview, rootRect);
      } else {
        preview.style.transform = getTransform(this._pickupPositionOnPage.x, this._pickupPositionOnPage.y);
      }
    } else {
      preview = deepCloneNode(this._rootElement);
      matchElementSize(preview, this._initialClientRect);
      if (this._initialTransform) {
        preview.style.transform = this._initialTransform;
      }
    }
    extendStyles(preview.style, {
      // It's important that we disable the pointer events on the preview, because
      // it can throw off the `document.elementFromPoint` calls in the `CdkDropList`.
      'pointer-events': 'none',
      // We have to reset the margin, because it can throw off positioning relative to the viewport.
      'margin': '0',
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'z-index': `${this._config.zIndex || 1000}`
    }, dragImportantProperties);
    toggleNativeDragInteractions(preview, false);
    preview.classList.add('cdk-drag-preview');
    preview.setAttribute('dir', this._direction);
    if (previewClass) {
      if (Array.isArray(previewClass)) {
        previewClass.forEach(className => preview.classList.add(className));
      } else {
        preview.classList.add(previewClass);
      }
    }
    return preview;
  }
  /**
   * Animates the preview element from its current position to the location of the drop placeholder.
   * @returns Promise that resolves when the animation completes.
   */
  _animatePreviewToPlaceholder() {
    // If the user hasn't moved yet, the transitionend event won't fire.
    if (!this._hasMoved) {
      return Promise.resolve();
    }
    const placeholderRect = this._placeholder.getBoundingClientRect();
    // Apply the class that adds a transition to the preview.
    this._preview.classList.add('cdk-drag-animating');
    // Move the preview to the placeholder position.
    this._applyPreviewTransform(placeholderRect.left, placeholderRect.top);
    // If the element doesn't have a `transition`, the `transitionend` event won't fire. Since
    // we need to trigger a style recalculation in order for the `cdk-drag-animating` class to
    // apply its style, we take advantage of the available info to figure out whether we need to
    // bind the event in the first place.
    const duration = getTransformTransitionDurationInMs(this._preview);
    if (duration === 0) {
      return Promise.resolve();
    }
    return this._ngZone.runOutsideAngular(() => {
      return new Promise(resolve => {
        const handler = event => {
          if (!event || (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__._getEventTarget)(event) === this._preview && event.propertyName === 'transform') {
            this._preview?.removeEventListener('transitionend', handler);
            resolve();
            clearTimeout(timeout);
          }
        };
        // If a transition is short enough, the browser might not fire the `transitionend` event.
        // Since we know how long it's supposed to take, add a timeout with a 50% buffer that'll
        // fire if the transition hasn't completed when it was supposed to.
        const timeout = setTimeout(handler, duration * 1.5);
        this._preview.addEventListener('transitionend', handler);
      });
    });
  }
  /** Creates an element that will be shown instead of the current element while dragging. */
  _createPlaceholderElement() {
    const placeholderConfig = this._placeholderTemplate;
    const placeholderTemplate = placeholderConfig ? placeholderConfig.template : null;
    let placeholder;
    if (placeholderTemplate) {
      this._placeholderRef = placeholderConfig.viewContainer.createEmbeddedView(placeholderTemplate, placeholderConfig.context);
      this._placeholderRef.detectChanges();
      placeholder = getRootNode(this._placeholderRef, this._document);
    } else {
      placeholder = deepCloneNode(this._rootElement);
    }
    // Stop pointer events on the preview so the user can't
    // interact with it while the preview is animating.
    placeholder.style.pointerEvents = 'none';
    placeholder.classList.add('cdk-drag-placeholder');
    return placeholder;
  }
  /**
   * Figures out the coordinates at which an element was picked up.
   * @param referenceElement Element that initiated the dragging.
   * @param event Event that initiated the dragging.
   */
  _getPointerPositionInElement(elementRect, referenceElement, event) {
    const handleElement = referenceElement === this._rootElement ? null : referenceElement;
    const referenceRect = handleElement ? handleElement.getBoundingClientRect() : elementRect;
    const point = isTouchEvent(event) ? event.targetTouches[0] : event;
    const scrollPosition = this._getViewportScrollPosition();
    const x = point.pageX - referenceRect.left - scrollPosition.left;
    const y = point.pageY - referenceRect.top - scrollPosition.top;
    return {
      x: referenceRect.left - elementRect.left + x,
      y: referenceRect.top - elementRect.top + y
    };
  }
  /** Determines the point of the page that was touched by the user. */
  _getPointerPositionOnPage(event) {
    const scrollPosition = this._getViewportScrollPosition();
    const point = isTouchEvent(event) ?
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    // Also note that on real devices we're guaranteed for either `touches` or `changedTouches`
    // to have a value, but Firefox in device emulation mode has a bug where both can be empty
    // for `touchstart` and `touchend` so we fall back to a dummy object in order to avoid
    // throwing an error. The value returned here will be incorrect, but since this only
    // breaks inside a developer tool and the value is only used for secondary information,
    // we can get away with it. See https://bugzilla.mozilla.org/show_bug.cgi?id=1615824.
    event.touches[0] || event.changedTouches[0] || {
      pageX: 0,
      pageY: 0
    } : event;
    const x = point.pageX - scrollPosition.left;
    const y = point.pageY - scrollPosition.top;
    // if dragging SVG element, try to convert from the screen coordinate system to the SVG
    // coordinate system
    if (this._ownerSVGElement) {
      const svgMatrix = this._ownerSVGElement.getScreenCTM();
      if (svgMatrix) {
        const svgPoint = this._ownerSVGElement.createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        return svgPoint.matrixTransform(svgMatrix.inverse());
      }
    }
    return {
      x,
      y
    };
  }
  /** Gets the pointer position on the page, accounting for any position constraints. */
  _getConstrainedPointerPosition(point) {
    const dropContainerLock = this._dropContainer ? this._dropContainer.lockAxis : null;
    let {
      x,
      y
    } = this.constrainPosition ? this.constrainPosition(point, this, this._initialClientRect, this._pickupPositionInElement) : point;
    if (this.lockAxis === 'x' || dropContainerLock === 'x') {
      y = this._pickupPositionOnPage.y - (this.constrainPosition ? this._pickupPositionInElement.y : 0);
    } else if (this.lockAxis === 'y' || dropContainerLock === 'y') {
      x = this._pickupPositionOnPage.x - (this.constrainPosition ? this._pickupPositionInElement.x : 0);
    }
    if (this._boundaryRect) {
      // If not using a custom constrain we need to account for the pickup position in the element
      // otherwise we do not need to do this, as it has already been accounted for
      const {
        x: pickupX,
        y: pickupY
      } = !this.constrainPosition ? this._pickupPositionInElement : {
        x: 0,
        y: 0
      };
      const boundaryRect = this._boundaryRect;
      const {
        width: previewWidth,
        height: previewHeight
      } = this._getPreviewRect();
      const minY = boundaryRect.top + pickupY;
      const maxY = boundaryRect.bottom - (previewHeight - pickupY);
      const minX = boundaryRect.left + pickupX;
      const maxX = boundaryRect.right - (previewWidth - pickupX);
      x = clamp$1(x, minX, maxX);
      y = clamp$1(y, minY, maxY);
    }
    return {
      x,
      y
    };
  }
  /** Updates the current drag delta, based on the user's current pointer position on the page. */
  _updatePointerDirectionDelta(pointerPositionOnPage) {
    const {
      x,
      y
    } = pointerPositionOnPage;
    const delta = this._pointerDirectionDelta;
    const positionSinceLastChange = this._pointerPositionAtLastDirectionChange;
    // Amount of pixels the user has dragged since the last time the direction changed.
    const changeX = Math.abs(x - positionSinceLastChange.x);
    const changeY = Math.abs(y - positionSinceLastChange.y);
    // Because we handle pointer events on a per-pixel basis, we don't want the delta
    // to change for every pixel, otherwise anything that depends on it can look erratic.
    // To make the delta more consistent, we track how much the user has moved since the last
    // delta change and we only update it after it has reached a certain threshold.
    if (changeX > this._config.pointerDirectionChangeThreshold) {
      delta.x = x > positionSinceLastChange.x ? 1 : -1;
      positionSinceLastChange.x = x;
    }
    if (changeY > this._config.pointerDirectionChangeThreshold) {
      delta.y = y > positionSinceLastChange.y ? 1 : -1;
      positionSinceLastChange.y = y;
    }
    return delta;
  }
  /** Toggles the native drag interactions, based on how many handles are registered. */
  _toggleNativeDragInteractions() {
    if (!this._rootElement || !this._handles) {
      return;
    }
    const shouldEnable = this._handles.length > 0 || !this.isDragging();
    if (shouldEnable !== this._nativeInteractionsEnabled) {
      this._nativeInteractionsEnabled = shouldEnable;
      toggleNativeDragInteractions(this._rootElement, shouldEnable);
    }
  }
  /** Removes the manually-added event listeners from the root element. */
  _removeRootElementListeners(element) {
    element.removeEventListener('mousedown', this._pointerDown, activeEventListenerOptions);
    element.removeEventListener('touchstart', this._pointerDown, passiveEventListenerOptions);
    element.removeEventListener('dragstart', this._nativeDragStart, activeEventListenerOptions);
  }
  /**
   * Applies a `transform` to the root element, taking into account any existing transforms on it.
   * @param x New transform value along the X axis.
   * @param y New transform value along the Y axis.
   */
  _applyRootElementTransform(x, y) {
    const transform = getTransform(x, y);
    const styles = this._rootElement.style;
    // Cache the previous transform amount only after the first drag sequence, because
    // we don't want our own transforms to stack on top of each other.
    // Should be excluded none because none + translate3d(x, y, x) is invalid css
    if (this._initialTransform == null) {
      this._initialTransform = styles.transform && styles.transform != 'none' ? styles.transform : '';
    }
    // Preserve the previous `transform` value, if there was one. Note that we apply our own
    // transform before the user's, because things like rotation can affect which direction
    // the element will be translated towards.
    styles.transform = combineTransforms(transform, this._initialTransform);
  }
  /**
   * Applies a `transform` to the preview, taking into account any existing transforms on it.
   * @param x New transform value along the X axis.
   * @param y New transform value along the Y axis.
   */
  _applyPreviewTransform(x, y) {
    // Only apply the initial transform if the preview is a clone of the original element, otherwise
    // it could be completely different and the transform might not make sense anymore.
    const initialTransform = this._previewTemplate?.template ? undefined : this._initialTransform;
    const transform = getTransform(x, y);
    this._preview.style.transform = combineTransforms(transform, initialTransform);
  }
  /**
   * Gets the distance that the user has dragged during the current drag sequence.
   * @param currentPosition Current position of the user's pointer.
   */
  _getDragDistance(currentPosition) {
    const pickupPosition = this._pickupPositionOnPage;
    if (pickupPosition) {
      return {
        x: currentPosition.x - pickupPosition.x,
        y: currentPosition.y - pickupPosition.y
      };
    }
    return {
      x: 0,
      y: 0
    };
  }
  /** Cleans up any cached element dimensions that we don't need after dragging has stopped. */
  _cleanupCachedDimensions() {
    this._boundaryRect = this._previewRect = undefined;
    this._parentPositions.clear();
  }
  /**
   * Checks whether the element is still inside its boundary after the viewport has been resized.
   * If not, the position is adjusted so that the element fits again.
   */
  _containInsideBoundaryOnResize() {
    let {
      x,
      y
    } = this._passiveTransform;
    if (x === 0 && y === 0 || this.isDragging() || !this._boundaryElement) {
      return;
    }
    // Note: don't use `_clientRectAtStart` here, because we want the latest position.
    const elementRect = this._rootElement.getBoundingClientRect();
    const boundaryRect = this._boundaryElement.getBoundingClientRect();
    // It's possible that the element got hidden away after dragging (e.g. by switching to a
    // different tab). Don't do anything in this case so we don't clear the user's position.
    if (boundaryRect.width === 0 && boundaryRect.height === 0 || elementRect.width === 0 && elementRect.height === 0) {
      return;
    }
    const leftOverflow = boundaryRect.left - elementRect.left;
    const rightOverflow = elementRect.right - boundaryRect.right;
    const topOverflow = boundaryRect.top - elementRect.top;
    const bottomOverflow = elementRect.bottom - boundaryRect.bottom;
    // If the element has become wider than the boundary, we can't
    // do much to make it fit so we just anchor it to the left.
    if (boundaryRect.width > elementRect.width) {
      if (leftOverflow > 0) {
        x += leftOverflow;
      }
      if (rightOverflow > 0) {
        x -= rightOverflow;
      }
    } else {
      x = 0;
    }
    // If the element has become taller than the boundary, we can't
    // do much to make it fit so we just anchor it to the top.
    if (boundaryRect.height > elementRect.height) {
      if (topOverflow > 0) {
        y += topOverflow;
      }
      if (bottomOverflow > 0) {
        y -= bottomOverflow;
      }
    } else {
      y = 0;
    }
    if (x !== this._passiveTransform.x || y !== this._passiveTransform.y) {
      this.setFreeDragPosition({
        y,
        x
      });
    }
  }
  /** Gets the drag start delay, based on the event type. */
  _getDragStartDelay(event) {
    const value = this.dragStartDelay;
    if (typeof value === 'number') {
      return value;
    } else if (isTouchEvent(event)) {
      return value.touch;
    }
    return value ? value.mouse : 0;
  }
  /** Updates the internal state of the draggable element when scrolling has occurred. */
  _updateOnScroll(event) {
    const scrollDifference = this._parentPositions.handleScroll(event);
    if (scrollDifference) {
      const target = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__._getEventTarget)(event);
      // ClientRect dimensions are based on the scroll position of the page and its parent
      // node so we have to update the cached boundary ClientRect if the user has scrolled.
      if (this._boundaryRect && target !== this._boundaryElement && target.contains(this._boundaryElement)) {
        adjustClientRect(this._boundaryRect, scrollDifference.top, scrollDifference.left);
      }
      this._pickupPositionOnPage.x += scrollDifference.left;
      this._pickupPositionOnPage.y += scrollDifference.top;
      // If we're in free drag mode, we have to update the active transform, because
      // it isn't relative to the viewport like the preview inside a drop list.
      if (!this._dropContainer) {
        this._activeTransform.x -= scrollDifference.left;
        this._activeTransform.y -= scrollDifference.top;
        this._applyRootElementTransform(this._activeTransform.x, this._activeTransform.y);
      }
    }
  }
  /** Gets the scroll position of the viewport. */
  _getViewportScrollPosition() {
    return this._parentPositions.positions.get(this._document)?.scrollPosition || this._parentPositions.getViewportScrollPosition();
  }
  /**
   * Lazily resolves and returns the shadow root of the element. We do this in a function, rather
   * than saving it in property directly on init, because we want to resolve it as late as possible
   * in order to ensure that the element has been moved into the shadow DOM. Doing it inside the
   * constructor might be too early if the element is inside of something like `ngFor` or `ngIf`.
   */
  _getShadowRoot() {
    if (this._cachedShadowRoot === undefined) {
      this._cachedShadowRoot = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__._getShadowRoot)(this._rootElement);
    }
    return this._cachedShadowRoot;
  }
  /** Gets the element into which the drag preview should be inserted. */
  _getPreviewInsertionPoint(initialParent, shadowRoot) {
    const previewContainer = this._previewContainer || 'global';
    if (previewContainer === 'parent') {
      return initialParent;
    }
    if (previewContainer === 'global') {
      const documentRef = this._document;
      // We can't use the body if the user is in fullscreen mode,
      // because the preview will render under the fullscreen element.
      // TODO(crisbeto): dedupe this with the `FullscreenOverlayContainer` eventually.
      return shadowRoot || documentRef.fullscreenElement || documentRef.webkitFullscreenElement || documentRef.mozFullScreenElement || documentRef.msFullscreenElement || documentRef.body;
    }
    return (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(previewContainer);
  }
  /** Lazily resolves and returns the dimensions of the preview. */
  _getPreviewRect() {
    // Cache the preview element rect if we haven't cached it already or if
    // we cached it too early before the element dimensions were computed.
    if (!this._previewRect || !this._previewRect.width && !this._previewRect.height) {
      this._previewRect = this._preview ? this._preview.getBoundingClientRect() : this._initialClientRect;
    }
    return this._previewRect;
  }
  /** Gets a handle that is the target of an event. */
  _getTargetHandle(event) {
    return this._handles.find(handle => {
      return event.target && (event.target === handle || handle.contains(event.target));
    });
  }
}
/**
 * Gets a 3d `transform` that can be applied to an element.
 * @param x Desired position of the element along the X axis.
 * @param y Desired position of the element along the Y axis.
 */
function getTransform(x, y) {
  // Round the transforms since some browsers will
  // blur the elements for sub-pixel transforms.
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}
/** Clamps a value between a minimum and a maximum. */
function clamp$1(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
/** Determines whether an event is a touch event. */
function isTouchEvent(event) {
  // This function is called for every pixel that the user has dragged so we need it to be
  // as fast as possible. Since we only bind mouse events and touch events, we can assume
  // that if the event's name starts with `t`, it's a touch event.
  return event.type[0] === 't';
}
/**
 * Gets the root HTML element of an embedded view.
 * If the root is not an HTML element it gets wrapped in one.
 */
function getRootNode(viewRef, _document) {
  const rootNodes = viewRef.rootNodes;
  if (rootNodes.length === 1 && rootNodes[0].nodeType === _document.ELEMENT_NODE) {
    return rootNodes[0];
  }
  const wrapper = _document.createElement('div');
  rootNodes.forEach(node => wrapper.appendChild(node));
  return wrapper;
}
/**
 * Matches the target element's size to the source's size.
 * @param target Element that needs to be resized.
 * @param sourceRect Dimensions of the source element.
 */
function matchElementSize(target, sourceRect) {
  target.style.width = `${sourceRect.width}px`;
  target.style.height = `${sourceRect.height}px`;
  target.style.transform = getTransform(sourceRect.left, sourceRect.top);
}

/**
 * Moves an item one index in an array to another.
 * @param array Array in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which the item should be moved.
 */
function moveItemInArray(array, fromIndex, toIndex) {
  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);
  if (from === to) {
    return;
  }
  const target = array[from];
  const delta = to < from ? -1 : 1;
  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }
  array[to] = target;
}
/**
 * Moves an item from one array to another.
 * @param currentArray Array from which to transfer the item.
 * @param targetArray Array into which to put the item.
 * @param currentIndex Index of the item in its current array.
 * @param targetIndex Index at which to insert the item.
 */
function transferArrayItem(currentArray, targetArray, currentIndex, targetIndex) {
  const from = clamp(currentIndex, currentArray.length - 1);
  const to = clamp(targetIndex, targetArray.length);
  if (currentArray.length) {
    targetArray.splice(to, 0, currentArray.splice(from, 1)[0]);
  }
}
/**
 * Copies an item from one array to another, leaving it in its
 * original position in current array.
 * @param currentArray Array from which to copy the item.
 * @param targetArray Array into which is copy the item.
 * @param currentIndex Index of the item in its current array.
 * @param targetIndex Index at which to insert the item.
 *
 */
function copyArrayItem(currentArray, targetArray, currentIndex, targetIndex) {
  const to = clamp(targetIndex, targetArray.length);
  if (currentArray.length) {
    targetArray.splice(to, 0, currentArray[currentIndex]);
  }
}
/** Clamps a number between zero and a maximum. */
function clamp(value, max) {
  return Math.max(0, Math.min(max, value));
}

/**
 * Strategy that only supports sorting along a single axis.
 * Items are reordered using CSS transforms which allows for sorting to be animated.
 * @docs-private
 */
class SingleAxisSortStrategy {
  constructor(_element, _dragDropRegistry) {
    this._element = _element;
    this._dragDropRegistry = _dragDropRegistry;
    /** Cache of the dimensions of all the items inside the container. */
    this._itemPositions = [];
    /** Direction in which the list is oriented. */
    this.orientation = 'vertical';
    /**
     * Keeps track of the item that was last swapped with the dragged item, as well as what direction
     * the pointer was moving in when the swap occurred and whether the user's pointer continued to
     * overlap with the swapped item after the swapping occurred.
     */
    this._previousSwap = {
      drag: null,
      delta: 0,
      overlaps: false
    };
  }
  /**
   * To be called when the drag sequence starts.
   * @param items Items that are currently in the list.
   */
  start(items) {
    this.withItems(items);
  }
  /**
   * To be called when an item is being sorted.
   * @param item Item to be sorted.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   * @param pointerDelta Direction in which the pointer is moving along each axis.
   */
  sort(item, pointerX, pointerY, pointerDelta) {
    const siblings = this._itemPositions;
    const newIndex = this._getItemIndexFromPointerPosition(item, pointerX, pointerY, pointerDelta);
    if (newIndex === -1 && siblings.length > 0) {
      return null;
    }
    const isHorizontal = this.orientation === 'horizontal';
    const currentIndex = siblings.findIndex(currentItem => currentItem.drag === item);
    const siblingAtNewPosition = siblings[newIndex];
    const currentPosition = siblings[currentIndex].clientRect;
    const newPosition = siblingAtNewPosition.clientRect;
    const delta = currentIndex > newIndex ? 1 : -1;
    // How many pixels the item's placeholder should be offset.
    const itemOffset = this._getItemOffsetPx(currentPosition, newPosition, delta);
    // How many pixels all the other items should be offset.
    const siblingOffset = this._getSiblingOffsetPx(currentIndex, siblings, delta);
    // Save the previous order of the items before moving the item to its new index.
    // We use this to check whether an item has been moved as a result of the sorting.
    const oldOrder = siblings.slice();
    // Shuffle the array in place.
    moveItemInArray(siblings, currentIndex, newIndex);
    siblings.forEach((sibling, index) => {
      // Don't do anything if the position hasn't changed.
      if (oldOrder[index] === sibling) {
        return;
      }
      const isDraggedItem = sibling.drag === item;
      const offset = isDraggedItem ? itemOffset : siblingOffset;
      const elementToOffset = isDraggedItem ? item.getPlaceholderElement() : sibling.drag.getRootElement();
      // Update the offset to reflect the new position.
      sibling.offset += offset;
      // Since we're moving the items with a `transform`, we need to adjust their cached
      // client rects to reflect their new position, as well as swap their positions in the cache.
      // Note that we shouldn't use `getBoundingClientRect` here to update the cache, because the
      // elements may be mid-animation which will give us a wrong result.
      if (isHorizontal) {
        // Round the transforms since some browsers will
        // blur the elements, for sub-pixel transforms.
        elementToOffset.style.transform = combineTransforms(`translate3d(${Math.round(sibling.offset)}px, 0, 0)`, sibling.initialTransform);
        adjustClientRect(sibling.clientRect, 0, offset);
      } else {
        elementToOffset.style.transform = combineTransforms(`translate3d(0, ${Math.round(sibling.offset)}px, 0)`, sibling.initialTransform);
        adjustClientRect(sibling.clientRect, offset, 0);
      }
    });
    // Note that it's important that we do this after the client rects have been adjusted.
    this._previousSwap.overlaps = isInsideClientRect(newPosition, pointerX, pointerY);
    this._previousSwap.drag = siblingAtNewPosition.drag;
    this._previousSwap.delta = isHorizontal ? pointerDelta.x : pointerDelta.y;
    return {
      previousIndex: currentIndex,
      currentIndex: newIndex
    };
  }
  /**
   * Called when an item is being moved into the container.
   * @param item Item that was moved into the container.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   * @param index Index at which the item entered. If omitted, the container will try to figure it
   *   out automatically.
   */
  enter(item, pointerX, pointerY, index) {
    const newIndex = index == null || index < 0 ?
    // We use the coordinates of where the item entered the drop
    // zone to figure out at which index it should be inserted.
    this._getItemIndexFromPointerPosition(item, pointerX, pointerY) : index;
    const activeDraggables = this._activeDraggables;
    const currentIndex = activeDraggables.indexOf(item);
    const placeholder = item.getPlaceholderElement();
    let newPositionReference = activeDraggables[newIndex];
    // If the item at the new position is the same as the item that is being dragged,
    // it means that we're trying to restore the item to its initial position. In this
    // case we should use the next item from the list as the reference.
    if (newPositionReference === item) {
      newPositionReference = activeDraggables[newIndex + 1];
    }
    // If we didn't find a new position reference, it means that either the item didn't start off
    // in this container, or that the item requested to be inserted at the end of the list.
    if (!newPositionReference && (newIndex == null || newIndex === -1 || newIndex < activeDraggables.length - 1) && this._shouldEnterAsFirstChild(pointerX, pointerY)) {
      newPositionReference = activeDraggables[0];
    }
    // Since the item may be in the `activeDraggables` already (e.g. if the user dragged it
    // into another container and back again), we have to ensure that it isn't duplicated.
    if (currentIndex > -1) {
      activeDraggables.splice(currentIndex, 1);
    }
    // Don't use items that are being dragged as a reference, because
    // their element has been moved down to the bottom of the body.
    if (newPositionReference && !this._dragDropRegistry.isDragging(newPositionReference)) {
      const element = newPositionReference.getRootElement();
      element.parentElement.insertBefore(placeholder, element);
      activeDraggables.splice(newIndex, 0, item);
    } else {
      (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this._element).appendChild(placeholder);
      activeDraggables.push(item);
    }
    // The transform needs to be cleared so it doesn't throw off the measurements.
    placeholder.style.transform = '';
    // Note that usually `start` is called together with `enter` when an item goes into a new
    // container. This will cache item positions, but we need to refresh them since the amount
    // of items has changed.
    this._cacheItemPositions();
  }
  /** Sets the items that are currently part of the list. */
  withItems(items) {
    this._activeDraggables = items.slice();
    this._cacheItemPositions();
  }
  /** Assigns a sort predicate to the strategy. */
  withSortPredicate(predicate) {
    this._sortPredicate = predicate;
  }
  /** Resets the strategy to its initial state before dragging was started. */
  reset() {
    // TODO(crisbeto): may have to wait for the animations to finish.
    this._activeDraggables.forEach(item => {
      const rootElement = item.getRootElement();
      if (rootElement) {
        const initialTransform = this._itemPositions.find(p => p.drag === item)?.initialTransform;
        rootElement.style.transform = initialTransform || '';
      }
    });
    this._itemPositions = [];
    this._activeDraggables = [];
    this._previousSwap.drag = null;
    this._previousSwap.delta = 0;
    this._previousSwap.overlaps = false;
  }
  /**
   * Gets a snapshot of items currently in the list.
   * Can include items that we dragged in from another list.
   */
  getActiveItemsSnapshot() {
    return this._activeDraggables;
  }
  /** Gets the index of a specific item. */
  getItemIndex(item) {
    // Items are sorted always by top/left in the cache, however they flow differently in RTL.
    // The rest of the logic still stands no matter what orientation we're in, however
    // we need to invert the array when determining the index.
    const items = this.orientation === 'horizontal' && this.direction === 'rtl' ? this._itemPositions.slice().reverse() : this._itemPositions;
    return items.findIndex(currentItem => currentItem.drag === item);
  }
  /** Used to notify the strategy that the scroll position has changed. */
  updateOnScroll(topDifference, leftDifference) {
    // Since we know the amount that the user has scrolled we can shift all of the
    // client rectangles ourselves. This is cheaper than re-measuring everything and
    // we can avoid inconsistent behavior where we might be measuring the element before
    // its position has changed.
    this._itemPositions.forEach(({
      clientRect
    }) => {
      adjustClientRect(clientRect, topDifference, leftDifference);
    });
    // We need two loops for this, because we want all of the cached
    // positions to be up-to-date before we re-sort the item.
    this._itemPositions.forEach(({
      drag
    }) => {
      if (this._dragDropRegistry.isDragging(drag)) {
        // We need to re-sort the item manually, because the pointer move
        // events won't be dispatched while the user is scrolling.
        drag._sortFromLastPointerPosition();
      }
    });
  }
  /** Refreshes the position cache of the items and sibling containers. */
  _cacheItemPositions() {
    const isHorizontal = this.orientation === 'horizontal';
    this._itemPositions = this._activeDraggables.map(drag => {
      const elementToMeasure = drag.getVisibleElement();
      return {
        drag,
        offset: 0,
        initialTransform: elementToMeasure.style.transform || '',
        clientRect: getMutableClientRect(elementToMeasure)
      };
    }).sort((a, b) => {
      return isHorizontal ? a.clientRect.left - b.clientRect.left : a.clientRect.top - b.clientRect.top;
    });
  }
  /**
   * Gets the offset in pixels by which the item that is being dragged should be moved.
   * @param currentPosition Current position of the item.
   * @param newPosition Position of the item where the current item should be moved.
   * @param delta Direction in which the user is moving.
   */
  _getItemOffsetPx(currentPosition, newPosition, delta) {
    const isHorizontal = this.orientation === 'horizontal';
    let itemOffset = isHorizontal ? newPosition.left - currentPosition.left : newPosition.top - currentPosition.top;
    // Account for differences in the item width/height.
    if (delta === -1) {
      itemOffset += isHorizontal ? newPosition.width - currentPosition.width : newPosition.height - currentPosition.height;
    }
    return itemOffset;
  }
  /**
   * Gets the offset in pixels by which the items that aren't being dragged should be moved.
   * @param currentIndex Index of the item currently being dragged.
   * @param siblings All of the items in the list.
   * @param delta Direction in which the user is moving.
   */
  _getSiblingOffsetPx(currentIndex, siblings, delta) {
    const isHorizontal = this.orientation === 'horizontal';
    const currentPosition = siblings[currentIndex].clientRect;
    const immediateSibling = siblings[currentIndex + delta * -1];
    let siblingOffset = currentPosition[isHorizontal ? 'width' : 'height'] * delta;
    if (immediateSibling) {
      const start = isHorizontal ? 'left' : 'top';
      const end = isHorizontal ? 'right' : 'bottom';
      // Get the spacing between the start of the current item and the end of the one immediately
      // after it in the direction in which the user is dragging, or vice versa. We add it to the
      // offset in order to push the element to where it will be when it's inline and is influenced
      // by the `margin` of its siblings.
      if (delta === -1) {
        siblingOffset -= immediateSibling.clientRect[start] - currentPosition[end];
      } else {
        siblingOffset += currentPosition[start] - immediateSibling.clientRect[end];
      }
    }
    return siblingOffset;
  }
  /**
   * Checks if pointer is entering in the first position
   * @param pointerX Position of the user's pointer along the X axis.
   * @param pointerY Position of the user's pointer along the Y axis.
   */
  _shouldEnterAsFirstChild(pointerX, pointerY) {
    if (!this._activeDraggables.length) {
      return false;
    }
    const itemPositions = this._itemPositions;
    const isHorizontal = this.orientation === 'horizontal';
    // `itemPositions` are sorted by position while `activeDraggables` are sorted by child index
    // check if container is using some sort of "reverse" ordering (eg: flex-direction: row-reverse)
    const reversed = itemPositions[0].drag !== this._activeDraggables[0];
    if (reversed) {
      const lastItemRect = itemPositions[itemPositions.length - 1].clientRect;
      return isHorizontal ? pointerX >= lastItemRect.right : pointerY >= lastItemRect.bottom;
    } else {
      const firstItemRect = itemPositions[0].clientRect;
      return isHorizontal ? pointerX <= firstItemRect.left : pointerY <= firstItemRect.top;
    }
  }
  /**
   * Gets the index of an item in the drop container, based on the position of the user's pointer.
   * @param item Item that is being sorted.
   * @param pointerX Position of the user's pointer along the X axis.
   * @param pointerY Position of the user's pointer along the Y axis.
   * @param delta Direction in which the user is moving their pointer.
   */
  _getItemIndexFromPointerPosition(item, pointerX, pointerY, delta) {
    const isHorizontal = this.orientation === 'horizontal';
    const index = this._itemPositions.findIndex(({
      drag,
      clientRect
    }) => {
      // Skip the item itself.
      if (drag === item) {
        return false;
      }
      if (delta) {
        const direction = isHorizontal ? delta.x : delta.y;
        // If the user is still hovering over the same item as last time, their cursor hasn't left
        // the item after we made the swap, and they didn't change the direction in which they're
        // dragging, we don't consider it a direction swap.
        if (drag === this._previousSwap.drag && this._previousSwap.overlaps && direction === this._previousSwap.delta) {
          return false;
        }
      }
      return isHorizontal ?
      // Round these down since most browsers report client rects with
      // sub-pixel precision, whereas the pointer coordinates are rounded to pixels.
      pointerX >= Math.floor(clientRect.left) && pointerX < Math.floor(clientRect.right) : pointerY >= Math.floor(clientRect.top) && pointerY < Math.floor(clientRect.bottom);
    });
    return index === -1 || !this._sortPredicate(index, item) ? -1 : index;
  }
}

/**
 * Proximity, as a ratio to width/height, at which a
 * dragged item will affect the drop container.
 */
const DROP_PROXIMITY_THRESHOLD = 0.05;
/**
 * Proximity, as a ratio to width/height at which to start auto-scrolling the drop list or the
 * viewport. The value comes from trying it out manually until it feels right.
 */
const SCROLL_PROXIMITY_THRESHOLD = 0.05;
/**
 * Reference to a drop list. Used to manipulate or dispose of the container.
 */
class DropListRef {
  constructor(element, _dragDropRegistry, _document, _ngZone, _viewportRuler) {
    this._dragDropRegistry = _dragDropRegistry;
    this._ngZone = _ngZone;
    this._viewportRuler = _viewportRuler;
    /** Whether starting a dragging sequence from this container is disabled. */
    this.disabled = false;
    /** Whether sorting items within the list is disabled. */
    this.sortingDisabled = false;
    /**
     * Whether auto-scrolling the view when the user
     * moves their pointer close to the edges is disabled.
     */
    this.autoScrollDisabled = false;
    /** Number of pixels to scroll for each frame when auto-scrolling an element. */
    this.autoScrollStep = 2;
    /**
     * Function that is used to determine whether an item
     * is allowed to be moved into a drop container.
     */
    this.enterPredicate = () => true;
    /** Function that is used to determine whether an item can be sorted into a particular index. */
    this.sortPredicate = () => true;
    /** Emits right before dragging has started. */
    this.beforeStarted = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Emits when the user has moved a new drag item into this container.
     */
    this.entered = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Emits when the user removes an item from the container
     * by dragging it into another container.
     */
    this.exited = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user drops an item inside the container. */
    this.dropped = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits as the user is swapping items while actively dragging. */
    this.sorted = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when a dragging sequence is started in a list connected to the current one. */
    this.receivingStarted = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when a dragging sequence is stopped from a list connected to the current one. */
    this.receivingStopped = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Whether an item in the list is being dragged. */
    this._isDragging = false;
    /** Draggable items in the container. */
    this._draggables = [];
    /** Drop lists that are connected to the current one. */
    this._siblings = [];
    /** Connected siblings that currently have a dragged item. */
    this._activeSiblings = new Set();
    /** Subscription to the window being scrolled. */
    this._viewportScrollSubscription = rxjs__WEBPACK_IMPORTED_MODULE_3__.Subscription.EMPTY;
    /** Vertical direction in which the list is currently scrolling. */
    this._verticalScrollDirection = 0 /* AutoScrollVerticalDirection.NONE */;
    /** Horizontal direction in which the list is currently scrolling. */
    this._horizontalScrollDirection = 0 /* AutoScrollHorizontalDirection.NONE */;
    /** Used to signal to the current auto-scroll sequence when to stop. */
    this._stopScrollTimers = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Shadow root of the current element. Necessary for `elementFromPoint` to resolve correctly. */
    this._cachedShadowRoot = null;
    /** Starts the interval that'll auto-scroll the element. */
    this._startScrollInterval = () => {
      this._stopScrolling();
      (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.interval)(0, rxjs__WEBPACK_IMPORTED_MODULE_6__.animationFrameScheduler).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this._stopScrollTimers)).subscribe(() => {
        const node = this._scrollNode;
        const scrollStep = this.autoScrollStep;
        if (this._verticalScrollDirection === 1 /* AutoScrollVerticalDirection.UP */) {
          node.scrollBy(0, -scrollStep);
        } else if (this._verticalScrollDirection === 2 /* AutoScrollVerticalDirection.DOWN */) {
          node.scrollBy(0, scrollStep);
        }
        if (this._horizontalScrollDirection === 1 /* AutoScrollHorizontalDirection.LEFT */) {
          node.scrollBy(-scrollStep, 0);
        } else if (this._horizontalScrollDirection === 2 /* AutoScrollHorizontalDirection.RIGHT */) {
          node.scrollBy(scrollStep, 0);
        }
      });
    };
    this.element = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(element);
    this._document = _document;
    this.withScrollableParents([this.element]);
    _dragDropRegistry.registerDropContainer(this);
    this._parentPositions = new ParentPositionTracker(_document);
    this._sortStrategy = new SingleAxisSortStrategy(this.element, _dragDropRegistry);
    this._sortStrategy.withSortPredicate((index, item) => this.sortPredicate(index, item, this));
  }
  /** Removes the drop list functionality from the DOM element. */
  dispose() {
    this._stopScrolling();
    this._stopScrollTimers.complete();
    this._viewportScrollSubscription.unsubscribe();
    this.beforeStarted.complete();
    this.entered.complete();
    this.exited.complete();
    this.dropped.complete();
    this.sorted.complete();
    this.receivingStarted.complete();
    this.receivingStopped.complete();
    this._activeSiblings.clear();
    this._scrollNode = null;
    this._parentPositions.clear();
    this._dragDropRegistry.removeDropContainer(this);
  }
  /** Whether an item from this list is currently being dragged. */
  isDragging() {
    return this._isDragging;
  }
  /** Starts dragging an item. */
  start() {
    this._draggingStarted();
    this._notifyReceivingSiblings();
  }
  /**
   * Attempts to move an item into the container.
   * @param item Item that was moved into the container.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   * @param index Index at which the item entered. If omitted, the container will try to figure it
   *   out automatically.
   */
  enter(item, pointerX, pointerY, index) {
    this._draggingStarted();
    // If sorting is disabled, we want the item to return to its starting
    // position if the user is returning it to its initial container.
    if (index == null && this.sortingDisabled) {
      index = this._draggables.indexOf(item);
    }
    this._sortStrategy.enter(item, pointerX, pointerY, index);
    // Note that this usually happens inside `_draggingStarted` as well, but the dimensions
    // can change when the sort strategy moves the item around inside `enter`.
    this._cacheParentPositions();
    // Notify siblings at the end so that the item has been inserted into the `activeDraggables`.
    this._notifyReceivingSiblings();
    this.entered.next({
      item,
      container: this,
      currentIndex: this.getItemIndex(item)
    });
  }
  /**
   * Removes an item from the container after it was dragged into another container by the user.
   * @param item Item that was dragged out.
   */
  exit(item) {
    this._reset();
    this.exited.next({
      item,
      container: this
    });
  }
  /**
   * Drops an item into this container.
   * @param item Item being dropped into the container.
   * @param currentIndex Index at which the item should be inserted.
   * @param previousIndex Index of the item when dragging started.
   * @param previousContainer Container from which the item got dragged in.
   * @param isPointerOverContainer Whether the user's pointer was over the
   *    container when the item was dropped.
   * @param distance Distance the user has dragged since the start of the dragging sequence.
   * @param event Event that triggered the dropping sequence.
   *
   * @breaking-change 15.0.0 `previousIndex` and `event` parameters to become required.
   */
  drop(item, currentIndex, previousIndex, previousContainer, isPointerOverContainer, distance, dropPoint, event = {}) {
    this._reset();
    this.dropped.next({
      item,
      currentIndex,
      previousIndex,
      container: this,
      previousContainer,
      isPointerOverContainer,
      distance,
      dropPoint,
      event
    });
  }
  /**
   * Sets the draggable items that are a part of this list.
   * @param items Items that are a part of this list.
   */
  withItems(items) {
    const previousItems = this._draggables;
    this._draggables = items;
    items.forEach(item => item._withDropContainer(this));
    if (this.isDragging()) {
      const draggedItems = previousItems.filter(item => item.isDragging());
      // If all of the items being dragged were removed
      // from the list, abort the current drag sequence.
      if (draggedItems.every(item => items.indexOf(item) === -1)) {
        this._reset();
      } else {
        this._sortStrategy.withItems(this._draggables);
      }
    }
    return this;
  }
  /** Sets the layout direction of the drop list. */
  withDirection(direction) {
    this._sortStrategy.direction = direction;
    return this;
  }
  /**
   * Sets the containers that are connected to this one. When two or more containers are
   * connected, the user will be allowed to transfer items between them.
   * @param connectedTo Other containers that the current containers should be connected to.
   */
  connectedTo(connectedTo) {
    this._siblings = connectedTo.slice();
    return this;
  }
  /**
   * Sets the orientation of the container.
   * @param orientation New orientation for the container.
   */
  withOrientation(orientation) {
    // TODO(crisbeto): eventually we should be constructing the new sort strategy here based on
    // the new orientation. For now we can assume that it'll always be `SingleAxisSortStrategy`.
    this._sortStrategy.orientation = orientation;
    return this;
  }
  /**
   * Sets which parent elements are can be scrolled while the user is dragging.
   * @param elements Elements that can be scrolled.
   */
  withScrollableParents(elements) {
    const element = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this.element);
    // We always allow the current element to be scrollable
    // so we need to ensure that it's in the array.
    this._scrollableElements = elements.indexOf(element) === -1 ? [element, ...elements] : elements.slice();
    return this;
  }
  /** Gets the scrollable parents that are registered with this drop container. */
  getScrollableParents() {
    return this._scrollableElements;
  }
  /**
   * Figures out the index of an item in the container.
   * @param item Item whose index should be determined.
   */
  getItemIndex(item) {
    return this._isDragging ? this._sortStrategy.getItemIndex(item) : this._draggables.indexOf(item);
  }
  /**
   * Whether the list is able to receive the item that
   * is currently being dragged inside a connected drop list.
   */
  isReceiving() {
    return this._activeSiblings.size > 0;
  }
  /**
   * Sorts an item inside the container based on its position.
   * @param item Item to be sorted.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   * @param pointerDelta Direction in which the pointer is moving along each axis.
   */
  _sortItem(item, pointerX, pointerY, pointerDelta) {
    // Don't sort the item if sorting is disabled or it's out of range.
    if (this.sortingDisabled || !this._clientRect || !isPointerNearClientRect(this._clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY)) {
      return;
    }
    const result = this._sortStrategy.sort(item, pointerX, pointerY, pointerDelta);
    if (result) {
      this.sorted.next({
        previousIndex: result.previousIndex,
        currentIndex: result.currentIndex,
        container: this,
        item
      });
    }
  }
  /**
   * Checks whether the user's pointer is close to the edges of either the
   * viewport or the drop list and starts the auto-scroll sequence.
   * @param pointerX User's pointer position along the x axis.
   * @param pointerY User's pointer position along the y axis.
   */
  _startScrollingIfNecessary(pointerX, pointerY) {
    if (this.autoScrollDisabled) {
      return;
    }
    let scrollNode;
    let verticalScrollDirection = 0 /* AutoScrollVerticalDirection.NONE */;
    let horizontalScrollDirection = 0 /* AutoScrollHorizontalDirection.NONE */;
    // Check whether we should start scrolling any of the parent containers.
    this._parentPositions.positions.forEach((position, element) => {
      // We have special handling for the `document` below. Also this would be
      // nicer with a  for...of loop, but it requires changing a compiler flag.
      if (element === this._document || !position.clientRect || scrollNode) {
        return;
      }
      if (isPointerNearClientRect(position.clientRect, DROP_PROXIMITY_THRESHOLD, pointerX, pointerY)) {
        [verticalScrollDirection, horizontalScrollDirection] = getElementScrollDirections(element, position.clientRect, pointerX, pointerY);
        if (verticalScrollDirection || horizontalScrollDirection) {
          scrollNode = element;
        }
      }
    });
    // Otherwise check if we can start scrolling the viewport.
    if (!verticalScrollDirection && !horizontalScrollDirection) {
      const {
        width,
        height
      } = this._viewportRuler.getViewportSize();
      const clientRect = {
        width,
        height,
        top: 0,
        right: width,
        bottom: height,
        left: 0
      };
      verticalScrollDirection = getVerticalScrollDirection(clientRect, pointerY);
      horizontalScrollDirection = getHorizontalScrollDirection(clientRect, pointerX);
      scrollNode = window;
    }
    if (scrollNode && (verticalScrollDirection !== this._verticalScrollDirection || horizontalScrollDirection !== this._horizontalScrollDirection || scrollNode !== this._scrollNode)) {
      this._verticalScrollDirection = verticalScrollDirection;
      this._horizontalScrollDirection = horizontalScrollDirection;
      this._scrollNode = scrollNode;
      if ((verticalScrollDirection || horizontalScrollDirection) && scrollNode) {
        this._ngZone.runOutsideAngular(this._startScrollInterval);
      } else {
        this._stopScrolling();
      }
    }
  }
  /** Stops any currently-running auto-scroll sequences. */
  _stopScrolling() {
    this._stopScrollTimers.next();
  }
  /** Starts the dragging sequence within the list. */
  _draggingStarted() {
    const styles = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this.element).style;
    this.beforeStarted.next();
    this._isDragging = true;
    // We need to disable scroll snapping while the user is dragging, because it breaks automatic
    // scrolling. The browser seems to round the value based on the snapping points which means
    // that we can't increment/decrement the scroll position.
    this._initialScrollSnap = styles.msScrollSnapType || styles.scrollSnapType || '';
    styles.scrollSnapType = styles.msScrollSnapType = 'none';
    this._sortStrategy.start(this._draggables);
    this._cacheParentPositions();
    this._viewportScrollSubscription.unsubscribe();
    this._listenToScrollEvents();
  }
  /** Caches the positions of the configured scrollable parents. */
  _cacheParentPositions() {
    const element = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this.element);
    this._parentPositions.cache(this._scrollableElements);
    // The list element is always in the `scrollableElements`
    // so we can take advantage of the cached `ClientRect`.
    this._clientRect = this._parentPositions.positions.get(element).clientRect;
  }
  /** Resets the container to its initial state. */
  _reset() {
    this._isDragging = false;
    const styles = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this.element).style;
    styles.scrollSnapType = styles.msScrollSnapType = this._initialScrollSnap;
    this._siblings.forEach(sibling => sibling._stopReceiving(this));
    this._sortStrategy.reset();
    this._stopScrolling();
    this._viewportScrollSubscription.unsubscribe();
    this._parentPositions.clear();
  }
  /**
   * Checks whether the user's pointer is positioned over the container.
   * @param x Pointer position along the X axis.
   * @param y Pointer position along the Y axis.
   */
  _isOverContainer(x, y) {
    return this._clientRect != null && isInsideClientRect(this._clientRect, x, y);
  }
  /**
   * Figures out whether an item should be moved into a sibling
   * drop container, based on its current position.
   * @param item Drag item that is being moved.
   * @param x Position of the item along the X axis.
   * @param y Position of the item along the Y axis.
   */
  _getSiblingContainerFromPosition(item, x, y) {
    return this._siblings.find(sibling => sibling._canReceive(item, x, y));
  }
  /**
   * Checks whether the drop list can receive the passed-in item.
   * @param item Item that is being dragged into the list.
   * @param x Position of the item along the X axis.
   * @param y Position of the item along the Y axis.
   */
  _canReceive(item, x, y) {
    if (!this._clientRect || !isInsideClientRect(this._clientRect, x, y) || !this.enterPredicate(item, this)) {
      return false;
    }
    const elementFromPoint = this._getShadowRoot().elementFromPoint(x, y);
    // If there's no element at the pointer position, then
    // the client rect is probably scrolled out of the view.
    if (!elementFromPoint) {
      return false;
    }
    const nativeElement = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this.element);
    // The `ClientRect`, that we're using to find the container over which the user is
    // hovering, doesn't give us any information on whether the element has been scrolled
    // out of the view or whether it's overlapping with other containers. This means that
    // we could end up transferring the item into a container that's invisible or is positioned
    // below another one. We use the result from `elementFromPoint` to get the top-most element
    // at the pointer position and to find whether it's one of the intersecting drop containers.
    return elementFromPoint === nativeElement || nativeElement.contains(elementFromPoint);
  }
  /**
   * Called by one of the connected drop lists when a dragging sequence has started.
   * @param sibling Sibling in which dragging has started.
   */
  _startReceiving(sibling, items) {
    const activeSiblings = this._activeSiblings;
    if (!activeSiblings.has(sibling) && items.every(item => {
      // Note that we have to add an exception to the `enterPredicate` for items that started off
      // in this drop list. The drag ref has logic that allows an item to return to its initial
      // container, if it has left the initial container and none of the connected containers
      // allow it to enter. See `DragRef._updateActiveDropContainer` for more context.
      return this.enterPredicate(item, this) || this._draggables.indexOf(item) > -1;
    })) {
      activeSiblings.add(sibling);
      this._cacheParentPositions();
      this._listenToScrollEvents();
      this.receivingStarted.next({
        initiator: sibling,
        receiver: this,
        items
      });
    }
  }
  /**
   * Called by a connected drop list when dragging has stopped.
   * @param sibling Sibling whose dragging has stopped.
   */
  _stopReceiving(sibling) {
    this._activeSiblings.delete(sibling);
    this._viewportScrollSubscription.unsubscribe();
    this.receivingStopped.next({
      initiator: sibling,
      receiver: this
    });
  }
  /**
   * Starts listening to scroll events on the viewport.
   * Used for updating the internal state of the list.
   */
  _listenToScrollEvents() {
    this._viewportScrollSubscription = this._dragDropRegistry.scrolled(this._getShadowRoot()).subscribe(event => {
      if (this.isDragging()) {
        const scrollDifference = this._parentPositions.handleScroll(event);
        if (scrollDifference) {
          this._sortStrategy.updateOnScroll(scrollDifference.top, scrollDifference.left);
        }
      } else if (this.isReceiving()) {
        this._cacheParentPositions();
      }
    });
  }
  /**
   * Lazily resolves and returns the shadow root of the element. We do this in a function, rather
   * than saving it in property directly on init, because we want to resolve it as late as possible
   * in order to ensure that the element has been moved into the shadow DOM. Doing it inside the
   * constructor might be too early if the element is inside of something like `ngFor` or `ngIf`.
   */
  _getShadowRoot() {
    if (!this._cachedShadowRoot) {
      const shadowRoot = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__._getShadowRoot)((0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(this.element));
      this._cachedShadowRoot = shadowRoot || this._document;
    }
    return this._cachedShadowRoot;
  }
  /** Notifies any siblings that may potentially receive the item. */
  _notifyReceivingSiblings() {
    const draggedItems = this._sortStrategy.getActiveItemsSnapshot().filter(item => item.isDragging());
    this._siblings.forEach(sibling => sibling._startReceiving(this, draggedItems));
  }
}
/**
 * Gets whether the vertical auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerY Position of the user's pointer along the y axis.
 */
function getVerticalScrollDirection(clientRect, pointerY) {
  const {
    top,
    bottom,
    height
  } = clientRect;
  const yThreshold = height * SCROLL_PROXIMITY_THRESHOLD;
  if (pointerY >= top - yThreshold && pointerY <= top + yThreshold) {
    return 1 /* AutoScrollVerticalDirection.UP */;
  } else if (pointerY >= bottom - yThreshold && pointerY <= bottom + yThreshold) {
    return 2 /* AutoScrollVerticalDirection.DOWN */;
  }

  return 0 /* AutoScrollVerticalDirection.NONE */;
}
/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
function getHorizontalScrollDirection(clientRect, pointerX) {
  const {
    left,
    right,
    width
  } = clientRect;
  const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;
  if (pointerX >= left - xThreshold && pointerX <= left + xThreshold) {
    return 1 /* AutoScrollHorizontalDirection.LEFT */;
  } else if (pointerX >= right - xThreshold && pointerX <= right + xThreshold) {
    return 2 /* AutoScrollHorizontalDirection.RIGHT */;
  }

  return 0 /* AutoScrollHorizontalDirection.NONE */;
}
/**
 * Gets the directions in which an element node should be scrolled,
 * assuming that the user's pointer is already within it scrollable region.
 * @param element Element for which we should calculate the scroll direction.
 * @param clientRect Bounding client rectangle of the element.
 * @param pointerX Position of the user's pointer along the x axis.
 * @param pointerY Position of the user's pointer along the y axis.
 */
function getElementScrollDirections(element, clientRect, pointerX, pointerY) {
  const computedVertical = getVerticalScrollDirection(clientRect, pointerY);
  const computedHorizontal = getHorizontalScrollDirection(clientRect, pointerX);
  let verticalScrollDirection = 0 /* AutoScrollVerticalDirection.NONE */;
  let horizontalScrollDirection = 0 /* AutoScrollHorizontalDirection.NONE */;
  // Note that we here we do some extra checks for whether the element is actually scrollable in
  // a certain direction and we only assign the scroll direction if it is. We do this so that we
  // can allow other elements to be scrolled, if the current element can't be scrolled anymore.
  // This allows us to handle cases where the scroll regions of two scrollable elements overlap.
  if (computedVertical) {
    const scrollTop = element.scrollTop;
    if (computedVertical === 1 /* AutoScrollVerticalDirection.UP */) {
      if (scrollTop > 0) {
        verticalScrollDirection = 1 /* AutoScrollVerticalDirection.UP */;
      }
    } else if (element.scrollHeight - scrollTop > element.clientHeight) {
      verticalScrollDirection = 2 /* AutoScrollVerticalDirection.DOWN */;
    }
  }

  if (computedHorizontal) {
    const scrollLeft = element.scrollLeft;
    if (computedHorizontal === 1 /* AutoScrollHorizontalDirection.LEFT */) {
      if (scrollLeft > 0) {
        horizontalScrollDirection = 1 /* AutoScrollHorizontalDirection.LEFT */;
      }
    } else if (element.scrollWidth - scrollLeft > element.clientWidth) {
      horizontalScrollDirection = 2 /* AutoScrollHorizontalDirection.RIGHT */;
    }
  }

  return [verticalScrollDirection, horizontalScrollDirection];
}

/** Event options that can be used to bind an active, capturing event. */
const activeCapturingEventOptions = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_0__.normalizePassiveListenerOptions)({
  passive: false,
  capture: true
});
/**
 * Service that keeps track of all the drag item and drop container
 * instances, and manages global event listeners on the `document`.
 * @docs-private
 */
// Note: this class is generic, rather than referencing CdkDrag and CdkDropList directly, in order
// to avoid circular imports. If we were to reference them here, importing the registry into the
// classes that are registering themselves will introduce a circular import.
class DragDropRegistry {
  constructor(_ngZone, _document) {
    this._ngZone = _ngZone;
    /** Registered drop container instances. */
    this._dropInstances = new Set();
    /** Registered drag item instances. */
    this._dragInstances = new Set();
    /** Drag item instances that are currently being dragged. */
    this._activeDragInstances = [];
    /** Keeps track of the event listeners that we've bound to the `document`. */
    this._globalListeners = new Map();
    /**
     * Predicate function to check if an item is being dragged.  Moved out into a property,
     * because it'll be called a lot and we don't want to create a new function every time.
     */
    this._draggingPredicate = item => item.isDragging();
    /**
     * Emits the `touchmove` or `mousemove` events that are dispatched
     * while the user is dragging a drag item instance.
     */
    this.pointerMove = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Emits the `touchend` or `mouseup` events that are dispatched
     * while the user is dragging a drag item instance.
     */
    this.pointerUp = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Emits when the viewport has been scrolled while the user is dragging an item.
     * @deprecated To be turned into a private member. Use the `scrolled` method instead.
     * @breaking-change 13.0.0
     */
    this.scroll = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Event listener that will prevent the default browser action while the user is dragging.
     * @param event Event whose default action should be prevented.
     */
    this._preventDefaultWhileDragging = event => {
      if (this._activeDragInstances.length > 0) {
        event.preventDefault();
      }
    };
    /** Event listener for `touchmove` that is bound even if no dragging is happening. */
    this._persistentTouchmoveListener = event => {
      if (this._activeDragInstances.length > 0) {
        // Note that we only want to prevent the default action after dragging has actually started.
        // Usually this is the same time at which the item is added to the `_activeDragInstances`,
        // but it could be pushed back if the user has set up a drag delay or threshold.
        if (this._activeDragInstances.some(this._draggingPredicate)) {
          event.preventDefault();
        }
        this.pointerMove.next(event);
      }
    };
    this._document = _document;
  }
  /** Adds a drop container to the registry. */
  registerDropContainer(drop) {
    if (!this._dropInstances.has(drop)) {
      this._dropInstances.add(drop);
    }
  }
  /** Adds a drag item instance to the registry. */
  registerDragItem(drag) {
    this._dragInstances.add(drag);
    // The `touchmove` event gets bound once, ahead of time, because WebKit
    // won't preventDefault on a dynamically-added `touchmove` listener.
    // See https://bugs.webkit.org/show_bug.cgi?id=184250.
    if (this._dragInstances.size === 1) {
      this._ngZone.runOutsideAngular(() => {
        // The event handler has to be explicitly active,
        // because newer browsers make it passive by default.
        this._document.addEventListener('touchmove', this._persistentTouchmoveListener, activeCapturingEventOptions);
      });
    }
  }
  /** Removes a drop container from the registry. */
  removeDropContainer(drop) {
    this._dropInstances.delete(drop);
  }
  /** Removes a drag item instance from the registry. */
  removeDragItem(drag) {
    this._dragInstances.delete(drag);
    this.stopDragging(drag);
    if (this._dragInstances.size === 0) {
      this._document.removeEventListener('touchmove', this._persistentTouchmoveListener, activeCapturingEventOptions);
    }
  }
  /**
   * Starts the dragging sequence for a drag instance.
   * @param drag Drag instance which is being dragged.
   * @param event Event that initiated the dragging.
   */
  startDragging(drag, event) {
    // Do not process the same drag twice to avoid memory leaks and redundant listeners
    if (this._activeDragInstances.indexOf(drag) > -1) {
      return;
    }
    this._activeDragInstances.push(drag);
    if (this._activeDragInstances.length === 1) {
      const isTouchEvent = event.type.startsWith('touch');
      // We explicitly bind __active__ listeners here, because newer browsers will default to
      // passive ones for `mousemove` and `touchmove`. The events need to be active, because we
      // use `preventDefault` to prevent the page from scrolling while the user is dragging.
      this._globalListeners.set(isTouchEvent ? 'touchend' : 'mouseup', {
        handler: e => this.pointerUp.next(e),
        options: true
      }).set('scroll', {
        handler: e => this.scroll.next(e),
        // Use capturing so that we pick up scroll changes in any scrollable nodes that aren't
        // the document. See https://github.com/angular/components/issues/17144.
        options: true
      })
      // Preventing the default action on `mousemove` isn't enough to disable text selection
      // on Safari so we need to prevent the selection event as well. Alternatively this can
      // be done by setting `user-select: none` on the `body`, however it has causes a style
      // recalculation which can be expensive on pages with a lot of elements.
      .set('selectstart', {
        handler: this._preventDefaultWhileDragging,
        options: activeCapturingEventOptions
      });
      // We don't have to bind a move event for touch drag sequences, because
      // we already have a persistent global one bound from `registerDragItem`.
      if (!isTouchEvent) {
        this._globalListeners.set('mousemove', {
          handler: e => this.pointerMove.next(e),
          options: activeCapturingEventOptions
        });
      }
      this._ngZone.runOutsideAngular(() => {
        this._globalListeners.forEach((config, name) => {
          this._document.addEventListener(name, config.handler, config.options);
        });
      });
    }
  }
  /** Stops dragging a drag item instance. */
  stopDragging(drag) {
    const index = this._activeDragInstances.indexOf(drag);
    if (index > -1) {
      this._activeDragInstances.splice(index, 1);
      if (this._activeDragInstances.length === 0) {
        this._clearGlobalListeners();
      }
    }
  }
  /** Gets whether a drag item instance is currently being dragged. */
  isDragging(drag) {
    return this._activeDragInstances.indexOf(drag) > -1;
  }
  /**
   * Gets a stream that will emit when any element on the page is scrolled while an item is being
   * dragged.
   * @param shadowRoot Optional shadow root that the current dragging sequence started from.
   *   Top-level listeners won't pick up events coming from the shadow DOM so this parameter can
   *   be used to include an additional top-level listener at the shadow root level.
   */
  scrolled(shadowRoot) {
    const streams = [this.scroll];
    if (shadowRoot && shadowRoot !== this._document) {
      // Note that this is basically the same as `fromEvent` from rxjs, but we do it ourselves,
      // because we want to guarantee that the event is bound outside of the `NgZone`. With
      // `fromEvent` it'll only happen if the subscription is outside the `NgZone`.
      streams.push(new rxjs__WEBPACK_IMPORTED_MODULE_8__.Observable(observer => {
        return this._ngZone.runOutsideAngular(() => {
          const eventOptions = true;
          const callback = event => {
            if (this._activeDragInstances.length) {
              observer.next(event);
            }
          };
          shadowRoot.addEventListener('scroll', callback, eventOptions);
          return () => {
            shadowRoot.removeEventListener('scroll', callback, eventOptions);
          };
        });
      }));
    }
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(...streams);
  }
  ngOnDestroy() {
    this._dragInstances.forEach(instance => this.removeDragItem(instance));
    this._dropInstances.forEach(instance => this.removeDropContainer(instance));
    this._clearGlobalListeners();
    this.pointerMove.complete();
    this.pointerUp.complete();
  }
  /** Clears out the global event listeners from the `document`. */
  _clearGlobalListeners() {
    this._globalListeners.forEach((config, name) => {
      this._document.removeEventListener(name, config.handler, config.options);
    });
    this._globalListeners.clear();
  }
  static {
    this.ɵfac = function DragDropRegistry_Factory(t) {
      return new (t || DragDropRegistry)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT));
    };
  }
  static {
    this.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineInjectable"]({
      token: DragDropRegistry,
      factory: DragDropRegistry.ɵfac,
      providedIn: 'root'
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](DragDropRegistry, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Injectable,
    args: [{
      providedIn: 'root'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.NgZone
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT]
      }]
    }];
  }, null);
})();

/** Default configuration to be used when creating a `DragRef`. */
const DEFAULT_CONFIG = {
  dragStartThreshold: 5,
  pointerDirectionChangeThreshold: 5
};
/**
 * Service that allows for drag-and-drop functionality to be attached to DOM elements.
 */
class DragDrop {
  constructor(_document, _ngZone, _viewportRuler, _dragDropRegistry) {
    this._document = _document;
    this._ngZone = _ngZone;
    this._viewportRuler = _viewportRuler;
    this._dragDropRegistry = _dragDropRegistry;
  }
  /**
   * Turns an element into a draggable item.
   * @param element Element to which to attach the dragging functionality.
   * @param config Object used to configure the dragging behavior.
   */
  createDrag(element, config = DEFAULT_CONFIG) {
    return new DragRef(element, config, this._document, this._ngZone, this._viewportRuler, this._dragDropRegistry);
  }
  /**
   * Turns an element into a drop list.
   * @param element Element to which to attach the drop list functionality.
   */
  createDropList(element) {
    return new DropListRef(element, this._dragDropRegistry, this._document, this._ngZone, this._viewportRuler);
  }
  static {
    this.ɵfac = function DragDrop_Factory(t) {
      return new (t || DragDrop)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](_angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__.ViewportRuler), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](DragDropRegistry));
    };
  }
  static {
    this.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineInjectable"]({
      token: DragDrop,
      factory: DragDrop.ɵfac,
      providedIn: 'root'
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](DragDrop, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Injectable,
    args: [{
      providedIn: 'root'
    }]
  }], function () {
    return [{
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT]
      }]
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.NgZone
    }, {
      type: _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__.ViewportRuler
    }, {
      type: DragDropRegistry
    }];
  }, null);
})();

/**
 * Injection token that can be used for a `CdkDrag` to provide itself as a parent to the
 * drag-specific child directive (`CdkDragHandle`, `CdkDragPreview` etc.). Used primarily
 * to avoid circular imports.
 * @docs-private
 */
const CDK_DRAG_PARENT = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CDK_DRAG_PARENT');

/**
 * Asserts that a particular node is an element.
 * @param node Node to be checked.
 * @param name Name to attach to the error message.
 */
function assertElementNode(node, name) {
  if (node.nodeType !== 1) {
    throw Error(`${name} must be attached to an element node. ` + `Currently attached to "${node.nodeName}".`);
  }
}

/**
 * Injection token that can be used to reference instances of `CdkDragHandle`. It serves as
 * alternative token to the actual `CdkDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const CDK_DRAG_HANDLE = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CdkDragHandle');
/** Handle that can be used to drag a CdkDrag instance. */
class CdkDragHandle {
  /** Whether starting to drag through this handle is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(value);
    this._stateChanges.next(this);
  }
  constructor(element, parentDrag) {
    this.element = element;
    /** Emits when the state of the handle has changed. */
    this._stateChanges = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    this._disabled = false;
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      assertElementNode(element.nativeElement, 'cdkDragHandle');
    }
    this._parentDrag = parentDrag;
  }
  ngOnDestroy() {
    this._stateChanges.complete();
  }
  static {
    this.ɵfac = function CdkDragHandle_Factory(t) {
      return new (t || CdkDragHandle)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DRAG_PARENT, 12));
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineDirective"]({
      type: CdkDragHandle,
      selectors: [["", "cdkDragHandle", ""]],
      hostAttrs: [1, "cdk-drag-handle"],
      inputs: {
        disabled: ["cdkDragHandleDisabled", "disabled"]
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵProvidersFeature"]([{
        provide: CDK_DRAG_HANDLE,
        useExisting: CdkDragHandle
      }])]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](CdkDragHandle, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Directive,
    args: [{
      selector: '[cdkDragHandle]',
      standalone: true,
      host: {
        'class': 'cdk-drag-handle'
      },
      providers: [{
        provide: CDK_DRAG_HANDLE,
        useExisting: CdkDragHandle
      }]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ElementRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DRAG_PARENT]
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.SkipSelf
      }]
    }];
  }, {
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragHandleDisabled']
    }]
  });
})();

/**
 * Injection token that can be used to reference instances of `CdkDragPlaceholder`. It serves as
 * alternative token to the actual `CdkDragPlaceholder` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const CDK_DRAG_PLACEHOLDER = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CdkDragPlaceholder');
/**
 * Element that will be used as a template for the placeholder of a CdkDrag when
 * it is being dragged. The placeholder is displayed in place of the element being dragged.
 */
class CdkDragPlaceholder {
  constructor(templateRef) {
    this.templateRef = templateRef;
  }
  static {
    this.ɵfac = function CdkDragPlaceholder_Factory(t) {
      return new (t || CdkDragPlaceholder)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.TemplateRef));
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineDirective"]({
      type: CdkDragPlaceholder,
      selectors: [["ng-template", "cdkDragPlaceholder", ""]],
      inputs: {
        data: "data"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵProvidersFeature"]([{
        provide: CDK_DRAG_PLACEHOLDER,
        useExisting: CdkDragPlaceholder
      }])]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](CdkDragPlaceholder, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Directive,
    args: [{
      selector: 'ng-template[cdkDragPlaceholder]',
      standalone: true,
      providers: [{
        provide: CDK_DRAG_PLACEHOLDER,
        useExisting: CdkDragPlaceholder
      }]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.TemplateRef
    }];
  }, {
    data: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input
    }]
  });
})();

/**
 * Injection token that can be used to reference instances of `CdkDragPreview`. It serves as
 * alternative token to the actual `CdkDragPreview` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const CDK_DRAG_PREVIEW = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CdkDragPreview');
/**
 * Element that will be used as a template for the preview
 * of a CdkDrag when it is being dragged.
 */
class CdkDragPreview {
  /** Whether the preview should preserve the same size as the item that is being dragged. */
  get matchSize() {
    return this._matchSize;
  }
  set matchSize(value) {
    this._matchSize = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(value);
  }
  constructor(templateRef) {
    this.templateRef = templateRef;
    this._matchSize = false;
  }
  static {
    this.ɵfac = function CdkDragPreview_Factory(t) {
      return new (t || CdkDragPreview)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.TemplateRef));
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineDirective"]({
      type: CdkDragPreview,
      selectors: [["ng-template", "cdkDragPreview", ""]],
      inputs: {
        data: "data",
        matchSize: "matchSize"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵProvidersFeature"]([{
        provide: CDK_DRAG_PREVIEW,
        useExisting: CdkDragPreview
      }])]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](CdkDragPreview, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Directive,
    args: [{
      selector: 'ng-template[cdkDragPreview]',
      standalone: true,
      providers: [{
        provide: CDK_DRAG_PREVIEW,
        useExisting: CdkDragPreview
      }]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.TemplateRef
    }];
  }, {
    data: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input
    }],
    matchSize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input
    }]
  });
})();

/**
 * Injection token that can be used to configure the
 * behavior of the drag&drop-related components.
 */
const CDK_DRAG_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CDK_DRAG_CONFIG');
const DRAG_HOST_CLASS = 'cdk-drag';
/**
 * Injection token that can be used to reference instances of `CdkDropList`. It serves as
 * alternative token to the actual `CdkDropList` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const CDK_DROP_LIST = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CdkDropList');
/** Element that can be moved inside a CdkDropList container. */
class CdkDrag {
  static {
    this._dragInstances = [];
  }
  /** Whether starting to drag this element is disabled. */
  get disabled() {
    return this._disabled || this.dropContainer && this.dropContainer.disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(value);
    this._dragRef.disabled = this._disabled;
  }
  constructor( /** Element that the draggable is attached to. */
  element, /** Droppable container that the draggable is a part of. */
  dropContainer,
  /**
   * @deprecated `_document` parameter no longer being used and will be removed.
   * @breaking-change 12.0.0
   */
  _document, _ngZone, _viewContainerRef, config, _dir, dragDrop, _changeDetectorRef, _selfHandle, _parentDrag) {
    this.element = element;
    this.dropContainer = dropContainer;
    this._ngZone = _ngZone;
    this._viewContainerRef = _viewContainerRef;
    this._dir = _dir;
    this._changeDetectorRef = _changeDetectorRef;
    this._selfHandle = _selfHandle;
    this._parentDrag = _parentDrag;
    this._destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /** Emits when the user starts dragging the item. */
    this.started = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /** Emits when the user has released a drag item, before any animations have started. */
    this.released = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /** Emits when the user stops dragging an item in the container. */
    this.ended = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /** Emits when the user has moved the item into a new container. */
    this.entered = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /** Emits when the user removes the item its container by dragging it into another container. */
    this.exited = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /** Emits when the user drops the item inside a container. */
    this.dropped = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /**
     * Emits as the user is dragging the item. Use with caution,
     * because this event will fire for every pixel that the user has dragged.
     */
    this.moved = new rxjs__WEBPACK_IMPORTED_MODULE_8__.Observable(observer => {
      const subscription = this._dragRef.moved.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.map)(movedEvent => ({
        source: this,
        pointerPosition: movedEvent.pointerPosition,
        event: movedEvent.event,
        delta: movedEvent.delta,
        distance: movedEvent.distance
      }))).subscribe(observer);
      return () => {
        subscription.unsubscribe();
      };
    });
    this._dragRef = dragDrop.createDrag(element, {
      dragStartThreshold: config && config.dragStartThreshold != null ? config.dragStartThreshold : 5,
      pointerDirectionChangeThreshold: config && config.pointerDirectionChangeThreshold != null ? config.pointerDirectionChangeThreshold : 5,
      zIndex: config?.zIndex
    });
    this._dragRef.data = this;
    // We have to keep track of the drag instances in order to be able to match an element to
    // a drag instance. We can't go through the global registry of `DragRef`, because the root
    // element could be different.
    CdkDrag._dragInstances.push(this);
    if (config) {
      this._assignDefaults(config);
    }
    // Note that usually the container is assigned when the drop list is picks up the item, but in
    // some cases (mainly transplanted views with OnPush, see #18341) we may end up in a situation
    // where there are no items on the first change detection pass, but the items get picked up as
    // soon as the user triggers another pass by dragging. This is a problem, because the item would
    // have to switch from standalone mode to drag mode in the middle of the dragging sequence which
    // is too late since the two modes save different kinds of information. We work around it by
    // assigning the drop container both from here and the list.
    if (dropContainer) {
      this._dragRef._withDropContainer(dropContainer._dropListRef);
      dropContainer.addItem(this);
    }
    this._syncInputs(this._dragRef);
    this._handleEvents(this._dragRef);
  }
  /**
   * Returns the element that is being used as a placeholder
   * while the current element is being dragged.
   */
  getPlaceholderElement() {
    return this._dragRef.getPlaceholderElement();
  }
  /** Returns the root draggable element. */
  getRootElement() {
    return this._dragRef.getRootElement();
  }
  /** Resets a standalone drag item to its initial position. */
  reset() {
    this._dragRef.reset();
  }
  /**
   * Gets the pixel coordinates of the draggable outside of a drop container.
   */
  getFreeDragPosition() {
    return this._dragRef.getFreeDragPosition();
  }
  /**
   * Sets the current position in pixels the draggable outside of a drop container.
   * @param value New position to be set.
   */
  setFreeDragPosition(value) {
    this._dragRef.setFreeDragPosition(value);
  }
  ngAfterViewInit() {
    // Normally this isn't in the zone, but it can cause major performance regressions for apps
    // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
    this._ngZone.runOutsideAngular(() => {
      // We need to wait for the zone to stabilize, in order for the reference
      // element to be in the proper place in the DOM. This is mostly relevant
      // for draggable elements inside portals since they get stamped out in
      // their original DOM position and then they get transferred to the portal.
      this._ngZone.onStable.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this._destroyed)).subscribe(() => {
        this._updateRootElement();
        this._setupHandlesListener();
        if (this.freeDragPosition) {
          this._dragRef.setFreeDragPosition(this.freeDragPosition);
        }
      });
    });
  }
  ngOnChanges(changes) {
    const rootSelectorChange = changes['rootElementSelector'];
    const positionChange = changes['freeDragPosition'];
    // We don't have to react to the first change since it's being
    // handled in `ngAfterViewInit` where it needs to be deferred.
    if (rootSelectorChange && !rootSelectorChange.firstChange) {
      this._updateRootElement();
    }
    // Skip the first change since it's being handled in `ngAfterViewInit`.
    if (positionChange && !positionChange.firstChange && this.freeDragPosition) {
      this._dragRef.setFreeDragPosition(this.freeDragPosition);
    }
  }
  ngOnDestroy() {
    if (this.dropContainer) {
      this.dropContainer.removeItem(this);
    }
    const index = CdkDrag._dragInstances.indexOf(this);
    if (index > -1) {
      CdkDrag._dragInstances.splice(index, 1);
    }
    // Unnecessary in most cases, but used to avoid extra change detections with `zone-paths-rxjs`.
    this._ngZone.runOutsideAngular(() => {
      this._destroyed.next();
      this._destroyed.complete();
      this._dragRef.dispose();
    });
  }
  /** Syncs the root element with the `DragRef`. */
  _updateRootElement() {
    const element = this.element.nativeElement;
    let rootElement = element;
    if (this.rootElementSelector) {
      rootElement = element.closest !== undefined ? element.closest(this.rootElementSelector) :
      // Comment tag doesn't have closest method, so use parent's one.
      element.parentElement?.closest(this.rootElementSelector);
    }
    if (rootElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      assertElementNode(rootElement, 'cdkDrag');
    }
    this._dragRef.withRootElement(rootElement || element);
  }
  /** Gets the boundary element, based on the `boundaryElement` value. */
  _getBoundaryElement() {
    const boundary = this.boundaryElement;
    if (!boundary) {
      return null;
    }
    if (typeof boundary === 'string') {
      return this.element.nativeElement.closest(boundary);
    }
    return (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceElement)(boundary);
  }
  /** Syncs the inputs of the CdkDrag with the options of the underlying DragRef. */
  _syncInputs(ref) {
    ref.beforeStarted.subscribe(() => {
      if (!ref.isDragging()) {
        const dir = this._dir;
        const dragStartDelay = this.dragStartDelay;
        const placeholder = this._placeholderTemplate ? {
          template: this._placeholderTemplate.templateRef,
          context: this._placeholderTemplate.data,
          viewContainer: this._viewContainerRef
        } : null;
        const preview = this._previewTemplate ? {
          template: this._previewTemplate.templateRef,
          context: this._previewTemplate.data,
          matchSize: this._previewTemplate.matchSize,
          viewContainer: this._viewContainerRef
        } : null;
        ref.disabled = this.disabled;
        ref.lockAxis = this.lockAxis;
        ref.dragStartDelay = typeof dragStartDelay === 'object' && dragStartDelay ? dragStartDelay : (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceNumberProperty)(dragStartDelay);
        ref.constrainPosition = this.constrainPosition;
        ref.previewClass = this.previewClass;
        ref.withBoundaryElement(this._getBoundaryElement()).withPlaceholderTemplate(placeholder).withPreviewTemplate(preview).withPreviewContainer(this.previewContainer || 'global');
        if (dir) {
          ref.withDirection(dir.value);
        }
      }
    });
    // This only needs to be resolved once.
    ref.beforeStarted.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.take)(1)).subscribe(() => {
      // If we managed to resolve a parent through DI, use it.
      if (this._parentDrag) {
        ref.withParent(this._parentDrag._dragRef);
        return;
      }
      // Otherwise fall back to resolving the parent by looking up the DOM. This can happen if
      // the item was projected into another item by something like `ngTemplateOutlet`.
      let parent = this.element.nativeElement.parentElement;
      while (parent) {
        if (parent.classList.contains(DRAG_HOST_CLASS)) {
          ref.withParent(CdkDrag._dragInstances.find(drag => {
            return drag.element.nativeElement === parent;
          })?._dragRef || null);
          break;
        }
        parent = parent.parentElement;
      }
    });
  }
  /** Handles the events from the underlying `DragRef`. */
  _handleEvents(ref) {
    ref.started.subscribe(startEvent => {
      this.started.emit({
        source: this,
        event: startEvent.event
      });
      // Since all of these events run outside of change detection,
      // we need to ensure that everything is marked correctly.
      this._changeDetectorRef.markForCheck();
    });
    ref.released.subscribe(releaseEvent => {
      this.released.emit({
        source: this,
        event: releaseEvent.event
      });
    });
    ref.ended.subscribe(endEvent => {
      this.ended.emit({
        source: this,
        distance: endEvent.distance,
        dropPoint: endEvent.dropPoint,
        event: endEvent.event
      });
      // Since all of these events run outside of change detection,
      // we need to ensure that everything is marked correctly.
      this._changeDetectorRef.markForCheck();
    });
    ref.entered.subscribe(enterEvent => {
      this.entered.emit({
        container: enterEvent.container.data,
        item: this,
        currentIndex: enterEvent.currentIndex
      });
    });
    ref.exited.subscribe(exitEvent => {
      this.exited.emit({
        container: exitEvent.container.data,
        item: this
      });
    });
    ref.dropped.subscribe(dropEvent => {
      this.dropped.emit({
        previousIndex: dropEvent.previousIndex,
        currentIndex: dropEvent.currentIndex,
        previousContainer: dropEvent.previousContainer.data,
        container: dropEvent.container.data,
        isPointerOverContainer: dropEvent.isPointerOverContainer,
        item: this,
        distance: dropEvent.distance,
        dropPoint: dropEvent.dropPoint,
        event: dropEvent.event
      });
    });
  }
  /** Assigns the default input values based on a provided config object. */
  _assignDefaults(config) {
    const {
      lockAxis,
      dragStartDelay,
      constrainPosition,
      previewClass,
      boundaryElement,
      draggingDisabled,
      rootElementSelector,
      previewContainer
    } = config;
    this.disabled = draggingDisabled == null ? false : draggingDisabled;
    this.dragStartDelay = dragStartDelay || 0;
    if (lockAxis) {
      this.lockAxis = lockAxis;
    }
    if (constrainPosition) {
      this.constrainPosition = constrainPosition;
    }
    if (previewClass) {
      this.previewClass = previewClass;
    }
    if (boundaryElement) {
      this.boundaryElement = boundaryElement;
    }
    if (rootElementSelector) {
      this.rootElementSelector = rootElementSelector;
    }
    if (previewContainer) {
      this.previewContainer = previewContainer;
    }
  }
  /** Sets up the listener that syncs the handles with the drag ref. */
  _setupHandlesListener() {
    // Listen for any newly-added handles.
    this._handles.changes.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.startWith)(this._handles),
    // Sync the new handles with the DragRef.
    (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.tap)(handles => {
      const childHandleElements = handles.filter(handle => handle._parentDrag === this).map(handle => handle.element);
      // Usually handles are only allowed to be a descendant of the drag element, but if
      // the consumer defined a different drag root, we should allow the drag element
      // itself to be a handle too.
      if (this._selfHandle && this.rootElementSelector) {
        childHandleElements.push(this.element);
      }
      this._dragRef.withHandles(childHandleElements);
    }),
    // Listen if the state of any of the handles changes.
    (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.switchMap)(handles => {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(...handles.map(item => {
        return item._stateChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.startWith)(item));
      }));
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this._destroyed)).subscribe(handleInstance => {
      // Enabled/disable the handle that changed in the DragRef.
      const dragRef = this._dragRef;
      const handle = handleInstance.element.nativeElement;
      handleInstance.disabled ? dragRef.disableHandle(handle) : dragRef.enableHandle(handle);
    });
  }
  static {
    this.ɵfac = function CdkDrag_Factory(t) {
      return new (t || CdkDrag)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DROP_LIST, 12), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ViewContainerRef), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DRAG_CONFIG, 8), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_18__.Directionality, 8), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](DragDrop), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DRAG_HANDLE, 10), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DRAG_PARENT, 12));
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineDirective"]({
      type: CdkDrag,
      selectors: [["", "cdkDrag", ""]],
      contentQueries: function CdkDrag_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵcontentQuery"](dirIndex, CDK_DRAG_PREVIEW, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵcontentQuery"](dirIndex, CDK_DRAG_PLACEHOLDER, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵcontentQuery"](dirIndex, CDK_DRAG_HANDLE, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵloadQuery"]()) && (ctx._previewTemplate = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵloadQuery"]()) && (ctx._placeholderTemplate = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵloadQuery"]()) && (ctx._handles = _t);
        }
      },
      hostAttrs: [1, "cdk-drag"],
      hostVars: 4,
      hostBindings: function CdkDrag_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("cdk-drag-disabled", ctx.disabled)("cdk-drag-dragging", ctx._dragRef.isDragging());
        }
      },
      inputs: {
        data: ["cdkDragData", "data"],
        lockAxis: ["cdkDragLockAxis", "lockAxis"],
        rootElementSelector: ["cdkDragRootElement", "rootElementSelector"],
        boundaryElement: ["cdkDragBoundary", "boundaryElement"],
        dragStartDelay: ["cdkDragStartDelay", "dragStartDelay"],
        freeDragPosition: ["cdkDragFreeDragPosition", "freeDragPosition"],
        disabled: ["cdkDragDisabled", "disabled"],
        constrainPosition: ["cdkDragConstrainPosition", "constrainPosition"],
        previewClass: ["cdkDragPreviewClass", "previewClass"],
        previewContainer: ["cdkDragPreviewContainer", "previewContainer"]
      },
      outputs: {
        started: "cdkDragStarted",
        released: "cdkDragReleased",
        ended: "cdkDragEnded",
        entered: "cdkDragEntered",
        exited: "cdkDragExited",
        dropped: "cdkDragDropped",
        moved: "cdkDragMoved"
      },
      exportAs: ["cdkDrag"],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵProvidersFeature"]([{
        provide: CDK_DRAG_PARENT,
        useExisting: CdkDrag
      }]), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵNgOnChangesFeature"]]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](CdkDrag, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Directive,
    args: [{
      selector: '[cdkDrag]',
      exportAs: 'cdkDrag',
      standalone: true,
      host: {
        'class': DRAG_HOST_CLASS,
        '[class.cdk-drag-disabled]': 'disabled',
        '[class.cdk-drag-dragging]': '_dragRef.isDragging()'
      },
      providers: [{
        provide: CDK_DRAG_PARENT,
        useExisting: CdkDrag
      }]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ElementRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DROP_LIST]
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.SkipSelf
      }]
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT]
      }]
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ViewContainerRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DRAG_CONFIG]
      }]
    }, {
      type: _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_18__.Directionality,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }]
    }, {
      type: DragDrop
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ChangeDetectorRef
    }, {
      type: CdkDragHandle,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Self
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DRAG_HANDLE]
      }]
    }, {
      type: CdkDrag,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.SkipSelf
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DRAG_PARENT]
      }]
    }];
  }, {
    _handles: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ContentChildren,
      args: [CDK_DRAG_HANDLE, {
        descendants: true
      }]
    }],
    _previewTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ContentChild,
      args: [CDK_DRAG_PREVIEW]
    }],
    _placeholderTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ContentChild,
      args: [CDK_DRAG_PLACEHOLDER]
    }],
    data: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragData']
    }],
    lockAxis: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragLockAxis']
    }],
    rootElementSelector: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragRootElement']
    }],
    boundaryElement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragBoundary']
    }],
    dragStartDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragStartDelay']
    }],
    freeDragPosition: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragFreeDragPosition']
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragDisabled']
    }],
    constrainPosition: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragConstrainPosition']
    }],
    previewClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragPreviewClass']
    }],
    previewContainer: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDragPreviewContainer']
    }],
    started: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragStarted']
    }],
    released: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragReleased']
    }],
    ended: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragEnded']
    }],
    entered: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragEntered']
    }],
    exited: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragExited']
    }],
    dropped: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragDropped']
    }],
    moved: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDragMoved']
    }]
  });
})();

/**
 * Injection token that can be used to reference instances of `CdkDropListGroup`. It serves as
 * alternative token to the actual `CdkDropListGroup` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const CDK_DROP_LIST_GROUP = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.InjectionToken('CdkDropListGroup');
/**
 * Declaratively connects sibling `cdkDropList` instances together. All of the `cdkDropList`
 * elements that are placed inside a `cdkDropListGroup` will be connected to each other
 * automatically. Can be used as an alternative to the `cdkDropListConnectedTo` input
 * from `cdkDropList`.
 */
class CdkDropListGroup {
  constructor() {
    /** Drop lists registered inside the group. */
    this._items = new Set();
    this._disabled = false;
  }
  /** Whether starting a dragging sequence from inside this group is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(value);
  }
  ngOnDestroy() {
    this._items.clear();
  }
  static {
    this.ɵfac = function CdkDropListGroup_Factory(t) {
      return new (t || CdkDropListGroup)();
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineDirective"]({
      type: CdkDropListGroup,
      selectors: [["", "cdkDropListGroup", ""]],
      inputs: {
        disabled: ["cdkDropListGroupDisabled", "disabled"]
      },
      exportAs: ["cdkDropListGroup"],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵProvidersFeature"]([{
        provide: CDK_DROP_LIST_GROUP,
        useExisting: CdkDropListGroup
      }])]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](CdkDropListGroup, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Directive,
    args: [{
      selector: '[cdkDropListGroup]',
      exportAs: 'cdkDropListGroup',
      standalone: true,
      providers: [{
        provide: CDK_DROP_LIST_GROUP,
        useExisting: CdkDropListGroup
      }]
    }]
  }], null, {
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListGroupDisabled']
    }]
  });
})();

/** Counter used to generate unique ids for drop zones. */
let _uniqueIdCounter = 0;
/** Container that wraps a set of draggable items. */
class CdkDropList {
  /** Keeps track of the drop lists that are currently on the page. */
  static {
    this._dropLists = [];
  }
  /** Whether starting a dragging sequence from this container is disabled. */
  get disabled() {
    return this._disabled || !!this._group && this._group.disabled;
  }
  set disabled(value) {
    // Usually we sync the directive and ref state right before dragging starts, in order to have
    // a single point of failure and to avoid having to use setters for everything. `disabled` is
    // a special case, because it can prevent the `beforeStarted` event from firing, which can lock
    // the user in a disabled state, so we also need to sync it as it's being set.
    this._dropListRef.disabled = this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(value);
  }
  constructor( /** Element that the drop list is attached to. */
  element, dragDrop, _changeDetectorRef, _scrollDispatcher, _dir, _group, config) {
    this.element = element;
    this._changeDetectorRef = _changeDetectorRef;
    this._scrollDispatcher = _scrollDispatcher;
    this._dir = _dir;
    this._group = _group;
    /** Emits when the list has been destroyed. */
    this._destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    /**
     * Other draggable containers that this container is connected to and into which the
     * container's items can be transferred. Can either be references to other drop containers,
     * or their unique IDs.
     */
    this.connectedTo = [];
    /**
     * Unique ID for the drop zone. Can be used as a reference
     * in the `connectedTo` of another `CdkDropList`.
     */
    this.id = `cdk-drop-list-${_uniqueIdCounter++}`;
    /**
     * Function that is used to determine whether an item
     * is allowed to be moved into a drop container.
     */
    this.enterPredicate = () => true;
    /** Functions that is used to determine whether an item can be sorted into a particular index. */
    this.sortPredicate = () => true;
    /** Emits when the user drops an item inside the container. */
    this.dropped = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /**
     * Emits when the user has moved a new drag item into this container.
     */
    this.entered = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /**
     * Emits when the user removes an item from the container
     * by dragging it into another container.
     */
    this.exited = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /** Emits as the user is swapping items while actively dragging. */
    this.sorted = new _angular_core__WEBPACK_IMPORTED_MODULE_10__.EventEmitter();
    /**
     * Keeps track of the items that are registered with this container. Historically we used to
     * do this with a `ContentChildren` query, however queries don't handle transplanted views very
     * well which means that we can't handle cases like dragging the headers of a `mat-table`
     * correctly. What we do instead is to have the items register themselves with the container
     * and then we sort them based on their position in the DOM.
     */
    this._unsortedItems = new Set();
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      assertElementNode(element.nativeElement, 'cdkDropList');
    }
    this._dropListRef = dragDrop.createDropList(element);
    this._dropListRef.data = this;
    if (config) {
      this._assignDefaults(config);
    }
    this._dropListRef.enterPredicate = (drag, drop) => {
      return this.enterPredicate(drag.data, drop.data);
    };
    this._dropListRef.sortPredicate = (index, drag, drop) => {
      return this.sortPredicate(index, drag.data, drop.data);
    };
    this._setupInputSyncSubscription(this._dropListRef);
    this._handleEvents(this._dropListRef);
    CdkDropList._dropLists.push(this);
    if (_group) {
      _group._items.add(this);
    }
  }
  /** Registers an items with the drop list. */
  addItem(item) {
    this._unsortedItems.add(item);
    if (this._dropListRef.isDragging()) {
      this._syncItemsWithRef();
    }
  }
  /** Removes an item from the drop list. */
  removeItem(item) {
    this._unsortedItems.delete(item);
    if (this._dropListRef.isDragging()) {
      this._syncItemsWithRef();
    }
  }
  /** Gets the registered items in the list, sorted by their position in the DOM. */
  getSortedItems() {
    return Array.from(this._unsortedItems).sort((a, b) => {
      const documentPosition = a._dragRef.getVisibleElement().compareDocumentPosition(b._dragRef.getVisibleElement());
      // `compareDocumentPosition` returns a bitmask so we have to use a bitwise operator.
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
      // tslint:disable-next-line:no-bitwise
      return documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  }
  ngOnDestroy() {
    const index = CdkDropList._dropLists.indexOf(this);
    if (index > -1) {
      CdkDropList._dropLists.splice(index, 1);
    }
    if (this._group) {
      this._group._items.delete(this);
    }
    this._unsortedItems.clear();
    this._dropListRef.dispose();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Syncs the inputs of the CdkDropList with the options of the underlying DropListRef. */
  _setupInputSyncSubscription(ref) {
    if (this._dir) {
      this._dir.change.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.startWith)(this._dir.value), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this._destroyed)).subscribe(value => ref.withDirection(value));
    }
    ref.beforeStarted.subscribe(() => {
      const siblings = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceArray)(this.connectedTo).map(drop => {
        if (typeof drop === 'string') {
          const correspondingDropList = CdkDropList._dropLists.find(list => list.id === drop);
          if (!correspondingDropList && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            console.warn(`CdkDropList could not find connected drop list with id "${drop}"`);
          }
          return correspondingDropList;
        }
        return drop;
      });
      if (this._group) {
        this._group._items.forEach(drop => {
          if (siblings.indexOf(drop) === -1) {
            siblings.push(drop);
          }
        });
      }
      // Note that we resolve the scrollable parents here so that we delay the resolution
      // as long as possible, ensuring that the element is in its final place in the DOM.
      if (!this._scrollableParentsResolved) {
        const scrollableParents = this._scrollDispatcher.getAncestorScrollContainers(this.element).map(scrollable => scrollable.getElementRef().nativeElement);
        this._dropListRef.withScrollableParents(scrollableParents);
        // Only do this once since it involves traversing the DOM and the parents
        // shouldn't be able to change without the drop list being destroyed.
        this._scrollableParentsResolved = true;
      }
      ref.disabled = this.disabled;
      ref.lockAxis = this.lockAxis;
      ref.sortingDisabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(this.sortingDisabled);
      ref.autoScrollDisabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceBooleanProperty)(this.autoScrollDisabled);
      ref.autoScrollStep = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_1__.coerceNumberProperty)(this.autoScrollStep, 2);
      ref.connectedTo(siblings.filter(drop => drop && drop !== this).map(list => list._dropListRef)).withOrientation(this.orientation);
    });
  }
  /** Handles events from the underlying DropListRef. */
  _handleEvents(ref) {
    ref.beforeStarted.subscribe(() => {
      this._syncItemsWithRef();
      this._changeDetectorRef.markForCheck();
    });
    ref.entered.subscribe(event => {
      this.entered.emit({
        container: this,
        item: event.item.data,
        currentIndex: event.currentIndex
      });
    });
    ref.exited.subscribe(event => {
      this.exited.emit({
        container: this,
        item: event.item.data
      });
      this._changeDetectorRef.markForCheck();
    });
    ref.sorted.subscribe(event => {
      this.sorted.emit({
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
        container: this,
        item: event.item.data
      });
    });
    ref.dropped.subscribe(dropEvent => {
      this.dropped.emit({
        previousIndex: dropEvent.previousIndex,
        currentIndex: dropEvent.currentIndex,
        previousContainer: dropEvent.previousContainer.data,
        container: dropEvent.container.data,
        item: dropEvent.item.data,
        isPointerOverContainer: dropEvent.isPointerOverContainer,
        distance: dropEvent.distance,
        dropPoint: dropEvent.dropPoint,
        event: dropEvent.event
      });
      // Mark for check since all of these events run outside of change
      // detection and we're not guaranteed for something else to have triggered it.
      this._changeDetectorRef.markForCheck();
    });
    (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(ref.receivingStarted, ref.receivingStopped).subscribe(() => this._changeDetectorRef.markForCheck());
  }
  /** Assigns the default input values based on a provided config object. */
  _assignDefaults(config) {
    const {
      lockAxis,
      draggingDisabled,
      sortingDisabled,
      listAutoScrollDisabled,
      listOrientation
    } = config;
    this.disabled = draggingDisabled == null ? false : draggingDisabled;
    this.sortingDisabled = sortingDisabled == null ? false : sortingDisabled;
    this.autoScrollDisabled = listAutoScrollDisabled == null ? false : listAutoScrollDisabled;
    this.orientation = listOrientation || 'vertical';
    if (lockAxis) {
      this.lockAxis = lockAxis;
    }
  }
  /** Syncs up the registered drag items with underlying drop list ref. */
  _syncItemsWithRef() {
    this._dropListRef.withItems(this.getSortedItems().map(item => item._dragRef));
  }
  static {
    this.ɵfac = function CdkDropList_Factory(t) {
      return new (t || CdkDropList)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](DragDrop), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__.ScrollDispatcher), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_18__.Directionality, 8), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DROP_LIST_GROUP, 12), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](CDK_DRAG_CONFIG, 8));
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineDirective"]({
      type: CdkDropList,
      selectors: [["", "cdkDropList", ""], ["cdk-drop-list"]],
      hostAttrs: [1, "cdk-drop-list"],
      hostVars: 7,
      hostBindings: function CdkDropList_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵattribute"]("id", ctx.id);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("cdk-drop-list-disabled", ctx.disabled)("cdk-drop-list-dragging", ctx._dropListRef.isDragging())("cdk-drop-list-receiving", ctx._dropListRef.isReceiving());
        }
      },
      inputs: {
        connectedTo: ["cdkDropListConnectedTo", "connectedTo"],
        data: ["cdkDropListData", "data"],
        orientation: ["cdkDropListOrientation", "orientation"],
        id: "id",
        lockAxis: ["cdkDropListLockAxis", "lockAxis"],
        disabled: ["cdkDropListDisabled", "disabled"],
        sortingDisabled: ["cdkDropListSortingDisabled", "sortingDisabled"],
        enterPredicate: ["cdkDropListEnterPredicate", "enterPredicate"],
        sortPredicate: ["cdkDropListSortPredicate", "sortPredicate"],
        autoScrollDisabled: ["cdkDropListAutoScrollDisabled", "autoScrollDisabled"],
        autoScrollStep: ["cdkDropListAutoScrollStep", "autoScrollStep"]
      },
      outputs: {
        dropped: "cdkDropListDropped",
        entered: "cdkDropListEntered",
        exited: "cdkDropListExited",
        sorted: "cdkDropListSorted"
      },
      exportAs: ["cdkDropList"],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵProvidersFeature"]([
      // Prevent child drop lists from picking up the same group as their parent.
      {
        provide: CDK_DROP_LIST_GROUP,
        useValue: undefined
      }, {
        provide: CDK_DROP_LIST,
        useExisting: CdkDropList
      }])]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](CdkDropList, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Directive,
    args: [{
      selector: '[cdkDropList], cdk-drop-list',
      exportAs: 'cdkDropList',
      standalone: true,
      providers: [
      // Prevent child drop lists from picking up the same group as their parent.
      {
        provide: CDK_DROP_LIST_GROUP,
        useValue: undefined
      }, {
        provide: CDK_DROP_LIST,
        useExisting: CdkDropList
      }],
      host: {
        'class': 'cdk-drop-list',
        '[attr.id]': 'id',
        '[class.cdk-drop-list-disabled]': 'disabled',
        '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
        '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()'
      }
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ElementRef
    }, {
      type: DragDrop
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.ChangeDetectorRef
    }, {
      type: _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__.ScrollDispatcher
    }, {
      type: _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_18__.Directionality,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }]
    }, {
      type: CdkDropListGroup,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DROP_LIST_GROUP]
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.SkipSelf
      }]
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Optional
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Inject,
        args: [CDK_DRAG_CONFIG]
      }]
    }];
  }, {
    connectedTo: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListConnectedTo']
    }],
    data: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListData']
    }],
    orientation: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListOrientation']
    }],
    id: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input
    }],
    lockAxis: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListLockAxis']
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListDisabled']
    }],
    sortingDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListSortingDisabled']
    }],
    enterPredicate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListEnterPredicate']
    }],
    sortPredicate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListSortPredicate']
    }],
    autoScrollDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListAutoScrollDisabled']
    }],
    autoScrollStep: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input,
      args: ['cdkDropListAutoScrollStep']
    }],
    dropped: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDropListDropped']
    }],
    entered: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDropListEntered']
    }],
    exited: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDropListExited']
    }],
    sorted: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Output,
      args: ['cdkDropListSorted']
    }]
  });
})();
const DRAG_DROP_DIRECTIVES = [CdkDropList, CdkDropListGroup, CdkDrag, CdkDragHandle, CdkDragPreview, CdkDragPlaceholder];
class DragDropModule {
  static {
    this.ɵfac = function DragDropModule_Factory(t) {
      return new (t || DragDropModule)();
    };
  }
  static {
    this.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineNgModule"]({
      type: DragDropModule
    });
  }
  static {
    this.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineInjector"]({
      providers: [DragDrop],
      imports: [_angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__.CdkScrollableModule]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵsetClassMetadata"](DragDropModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.NgModule,
    args: [{
      imports: DRAG_DROP_DIRECTIVES,
      exports: [_angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_12__.CdkScrollableModule, ...DRAG_DROP_DIRECTIVES],
      providers: [DragDrop]
    }]
  }], null, null);
})();

/**
 * Generated bundle index. Do not edit.
 */



/***/ }),

/***/ 40275:
/*!************************************************!*\
  !*** ./node_modules/image-size/dist/index.mjs ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ imageSize),
/* harmony export */   disableTypes: () => (/* binding */ disableTypes),
/* harmony export */   imageSize: () => (/* binding */ imageSize),
/* harmony export */   types: () => (/* binding */ types)
/* harmony export */ });
// lib/types/utils.ts
var decoder = new TextDecoder();
var toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
var toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
var getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
var readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
var readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
var readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
var readUInt24LE = (input, offset = 0) => {
  const view = getView(input, offset);
  return view.getUint16(0, true) + (view.getUint8(2) << 16);
};
var readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
var readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
var readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
var readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
var methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = `readUInt${bits}${endian}`;
  return methods[methodName](input, offset);
}
function readBox(input, offset) {
  if (input.length - offset < 4) return;
  const boxSize = readUInt32BE(input, offset);
  if (input.length - offset < boxSize) return;
  return {
    name: toUTF8String(input, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(input, boxName, currentOffset) {
  while (currentOffset < input.length) {
    const box = readBox(input, currentOffset);
    if (!box) break;
    if (box.name === boxName) return box;
    currentOffset += box.size > 0 ? box.size : 8;
  }
}

// lib/types/bmp.ts
var BMP = {
  validate: input => toUTF8String(input, 0, 2) === "BM",
  calculate: input => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

// lib/types/ico.ts
var TYPE_ICON = 1;
var SIZE_HEADER = 2 + 2 + 2;
var SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize(input, imageIndex) {
  const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
var ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize2 = getImageSize(input, 0);
    if (nbImages === 1) return imageSize2;
    const images = [];
    for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) {
      images.push(getImageSize(input, imageIndex));
    }
    return {
      width: imageSize2.width,
      height: imageSize2.height,
      images
    };
  }
};

// lib/types/cur.ts
var TYPE_CURSOR = 2;
var CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: input => ICO.calculate(input)
};

// lib/types/dds.ts
var DDS = {
  validate: input => readUInt32LE(input, 0) === 542327876,
  calculate: input => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

// lib/types/gif.ts
var gifRegexp = /^GIF8[79]a/;
var GIF = {
  validate: input => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: input => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

// lib/types/heif.ts
var brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // heif-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};

var HEIF = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "ftyp") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand in brandMap;
  },
  calculate(input) {
    const metaBox = findBox(input, "meta", 0);
    const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
    if (!ipcoBox) {
      throw new TypeError("Invalid HEIF, no ipco box found");
    }
    const type = toUTF8String(input, 8, 12);
    const images = [];
    let currentOffset = ipcoBox.offset + 8;
    while (currentOffset < ipcoBox.offset + ipcoBox.size) {
      const ispeBox = findBox(input, "ispe", currentOffset);
      if (!ispeBox) break;
      const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
      const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
      const clapBox = findBox(input, "clap", currentOffset);
      let width = rawWidth;
      let height = rawHeight;
      if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
        const cropRight = readUInt32BE(input, clapBox.offset + 12);
        width = rawWidth - cropRight;
      }
      images.push({
        height,
        width
      });
      currentOffset = ispeBox.offset + ispeBox.size;
    }
    if (images.length === 0) {
      throw new TypeError("Invalid HEIF, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      type,
      ...(images.length > 1 ? {
        images
      } : {})
    };
  }
};

// lib/types/icns.ts
var SIZE_HEADER2 = 4 + 4;
var FILE_LENGTH_OFFSET = 4;
var ENTRY_LENGTH_OFFSET = 4;
var ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [toUTF8String(input, imageOffset, imageLengthOffset), readUInt32BE(input, imageLengthOffset)];
}
function getImageSize2(type) {
  const size = ICON_TYPE_SIZE[type];
  return {
    width: size,
    height: size,
    type
  };
}
var ICNS = {
  validate: input => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER2;
    const images = [];
    while (imageOffset < fileLength && imageOffset < inputLength) {
      const imageHeader = readImageHeader(input, imageOffset);
      const imageSize2 = getImageSize2(imageHeader[0]);
      images.push(imageSize2);
      imageOffset += imageHeader[1];
    }
    if (images.length === 0) {
      throw new TypeError("Invalid ICNS, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      ...(images.length > 1 ? {
        images
      } : {})
    };
  }
};

// lib/types/j2c.ts
var J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: input => readUInt32BE(input, 0) === 4283432785,
  calculate: input => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

// lib/types/jp2.ts
var JP2 = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "jP  ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jp2 ";
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

// lib/types/jpg.ts
var EXIF_MARKER = "45786966";
var APP1_DATA_SIZE_BYTES = 2;
var EXIF_HEADER_BYTES = 6;
var TIFF_BYTE_ALIGN_BYTES = 2;
var BIG_ENDIAN_BYTE_ALIGN = "4d4d";
var LITTLE_ENDIAN_BYTE_ALIGN = "4949";
var IDF_ENTRY_BYTES = 12;
var NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(exifBlock, EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
var JPG = {
  validate: input => toHexString(input, 0, 2) === "ffd8",
  calculate(_input) {
    let input = _input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      validateInput(input, i);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

// lib/utils/bit-reader.ts
var BitReader = class {
  constructor(input, endianness) {
    this.input = input;
    this.endianness = endianness;
    // Skip the first 16 bits (2 bytes) of signature
    this.byteOffset = 2;
    this.bitOffset = 0;
  }
  /** Reads a specified number of bits, and move the offset */
  getBits(length = 1) {
    let result = 0;
    let bitsRead = 0;
    while (bitsRead < length) {
      if (this.byteOffset >= this.input.length) {
        throw new Error("Reached end of input");
      }
      const currentByte = this.input[this.byteOffset];
      const bitsLeft = 8 - this.bitOffset;
      const bitsToRead = Math.min(length - bitsRead, bitsLeft);
      if (this.endianness === "little-endian") {
        const mask = (1 << bitsToRead) - 1;
        const bits = currentByte >> this.bitOffset & mask;
        result |= bits << bitsRead;
      } else {
        const mask = (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead;
        const bits = (currentByte & mask) >> 8 - this.bitOffset - bitsToRead;
        result = result << bitsToRead | bits;
      }
      bitsRead += bitsToRead;
      this.bitOffset += bitsToRead;
      if (this.bitOffset === 8) {
        this.byteOffset++;
        this.bitOffset = 0;
      }
    }
    return result;
  }
};

// lib/types/jxl-stream.ts
function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) {
    return 8 * (1 + reader.getBits(5));
  }
  const sizeClass = reader.getBits(2);
  const extraBits = [9, 13, 18, 30][sizeClass];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) {
    return 8 * (1 + reader.getBits(5));
  }
  if (widthMode === 0) {
    return calculateImageDimension(reader, false);
  }
  const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
  return Math.floor(height * aspectRatios[widthMode - 1]);
}
var JXLStream = {
  validate: input => {
    return toHexString(input, 0, 2) === "ff0a";
  },
  calculate(input) {
    const reader = new BitReader(input, "little-endian");
    const isSmallImage = reader.getBits(1) === 1;
    const height = calculateImageDimension(reader, isSmallImage);
    const widthMode = reader.getBits(3);
    const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
    return {
      width,
      height
    };
  }
};

// lib/types/jxl.ts
function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox) {
    return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  }
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) {
    return concatenateCodestreams(partialStreams);
  }
  return void 0;
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox) break;
    partialStreams.push(input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size));
    offset = jxlpBox.offset + jxlpBox.size;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce((acc, curr) => acc + curr.length, 0);
  const codestream = new Uint8Array(totalLength);
  let position = 0;
  for (const partial of partialCodestreams) {
    codestream.set(partial, position);
    position += partial.length;
  }
  return codestream;
}
var JXL = {
  validate: input => {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "JXL ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jxl ";
  },
  calculate(input) {
    const codestream = extractCodestream(input);
    if (codestream) return JXLStream.calculate(codestream);
    throw new Error("No codestream found in JXL container");
  }
};

// lib/types/ktx.ts
var KTX = {
  validate: input => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: input => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

// lib/types/png.ts
var pngSignature = "PNG\r\n\n";
var pngImageHeaderChunkName = "IHDR";
var pngFriedChunkName = "CgBI";
var PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

// lib/types/pnm.ts
var PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
var handlers = {
  default: lines => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: Number.parseInt(dimensions[1], 10),
        width: Number.parseInt(dimensions[0], 10)
      };
    }
    throw new TypeError("Invalid PNM");
  },
  pam: lines => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = Number.parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    }
    throw new TypeError("Invalid PAM");
  }
};
var PNM = {
  validate: input => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

// lib/types/psd.ts
var PSD = {
  validate: input => toUTF8String(input, 0, 4) === "8BPS",
  calculate: input => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

// lib/types/svg.ts
var svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
var extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
var INCH_CM = 2.54;
var units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
var unitsReg = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
var SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: input => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

// lib/types/tga.ts
var TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

// lib/types/tiff.ts
var CONSTANTS = {
  TAG: {
    WIDTH: 256,
    HEIGHT: 257,
    COMPRESSION: 259
  },
  TYPE: {
    SHORT: 3,
    LONG: 4,
    LONG8: 16
  },
  ENTRY_SIZE: {
    STANDARD: 12,
    BIG: 20
  },
  COUNT_SIZE: {
    STANDARD: 2,
    BIG: 8
  }
};
function readIFD(input, {
  isBigEndian,
  isBigTiff
}) {
  const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return readUInt(input, 16, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG:
      return readUInt(input, 32, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG8:
      {
        const value = Number(readUInt64(input, offset, isBigEndian));
        if (value > Number.MAX_SAFE_INTEGER) {
          throw new TypeError("Value too large");
        }
        return value;
      }
    default:
      return 0;
  }
}
function nextTag(input, isBigTiff) {
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  if (input.length > entrySize) {
    return input.slice(entrySize);
  }
}
function extractTags(input, {
  isBigEndian,
  isBigTiff
}) {
  const tags = {};
  let temp = input;
  while (temp?.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      const valueOffset = isBigTiff ? 12 : 8;
      tags[code] = readTagValue(temp, type, valueOffset, isBigEndian);
    }
    temp = nextTag(temp, isBigTiff);
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const version = readUInt(input, 16, 2, signature === "MM");
  return {
    isBigEndian: signature === "MM",
    isBigTiff: version === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const byteSize = readUInt(input, 16, 4, isBigEndian);
  const reserved = readUInt(input, 16, 6, isBigEndian);
  if (byteSize !== 8 || reserved !== 0) {
    throw new TypeError("Invalid BigTIFF header");
  }
}
var signatures = /* @__PURE__ */new Set(["49492a00",
// Little Endian
"4d4d002a",
// Big Endian
"49492b00",
// BigTIFF Little Endian
"4d4d002b"
// BigTIFF Big Endian
]);

var TIFF = {
  validate: input => {
    const signature = toHexString(input, 0, 4);
    return signatures.has(signature);
  },
  calculate(input) {
    const format = determineFormat(input);
    if (format.isBigTiff) {
      validateBigTIFFHeader(input, format.isBigEndian);
    }
    const ifdBuffer = readIFD(input, format);
    const tags = extractTags(ifdBuffer, format);
    const info = {
      height: tags[CONSTANTS.TAG.HEIGHT],
      width: tags[CONSTANTS.TAG.WIDTH],
      type: format.isBigTiff ? "bigtiff" : "tiff"
    };
    if (tags[CONSTANTS.TAG.COMPRESSION]) {
      info.compression = tags[CONSTANTS.TAG.COMPRESSION];
    }
    if (!info.width || !info.height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return info;
  }
};

// lib/types/webp.ts
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
var WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(_input) {
    const chunkHeader = toUTF8String(_input, 12, 16);
    const input = _input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      }
      throw new TypeError("Invalid WebP");
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

// lib/types/index.ts
var typeHandlers = /* @__PURE__ */new Map([["bmp", BMP], ["cur", CUR], ["dds", DDS], ["gif", GIF], ["heif", HEIF], ["icns", ICNS], ["ico", ICO], ["j2c", J2C], ["jp2", JP2], ["jpg", JPG], ["jxl", JXL], ["jxl-stream", JXLStream], ["ktx", KTX], ["png", PNG], ["pnm", PNM], ["psd", PSD], ["svg", SVG], ["tga", TGA], ["tiff", TIFF], ["webp", WEBP]]);
var types = Array.from(typeHandlers.keys());

// lib/detector.ts
var firstBytes = /* @__PURE__ */new Map([[0, "heif"], [56, "psd"], [66, "bmp"], [68, "dds"], [71, "gif"], [73, "tiff"], [77, "tiff"], [82, "webp"], [105, "icns"], [137, "png"], [255, "jpg"]]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find(type2 => typeHandlers.get(type2).validate(input));
}

// lib/lookup.ts
var globalOptions = {
  disabledTypes: []
};
function imageSize(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError(`disabled file type: ${type}`);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      if (size.images && size.images.length > 1) {
        const largestImage = size.images.reduce((largest, current) => {
          return current.width * current.height > largest.width * largest.height ? current : largest;
        }, size.images[0]);
        size.width = largestImage.width;
        size.height = largestImage.height;
      }
      return size;
    }
  }
  throw new TypeError(`unsupported file type: ${type}`);
}
var disableTypes = types2 => {
  globalOptions.disabledTypes = types2;
};


/***/ })

}]);
//# sourceMappingURL=src_app_view_user_question-bank_question-bank_module_ts.4e409513a8393546.js.map
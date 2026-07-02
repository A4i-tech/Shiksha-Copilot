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
              text: '   Ans: ',
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
/* harmony export */   hasQuestionImage: () => (/* binding */ hasQuestionImage),
/* harmony export */   questionContentItems: () => (/* binding */ questionContentItems),
/* harmony export */   questionText: () => (/* binding */ questionText)
/* harmony export */ });
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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/math-render.util */ 30084);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng2-charts */ 57839);







const _c0 = ["bluePrintContent"];
function QuestionBankBluePrintComponent_div_20_div_7_ng_container_5_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r11.content);
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_ng_container_5_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 39);
  }
  if (rf & 2) {
    const item_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", ctx_r13.mediaSrc(item_r11), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_20_div_7_ng_container_5_span_1_Template, 2, 1, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, QuestionBankBluePrintComponent_div_20_div_7_ng_container_5_img_2_Template, 1, 1, "img", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r11.contentType === "text/plain");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r11.contentType !== "text/plain");
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_b_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", option_r17.label, ".");
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_ng_container_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", item_r21.content, "");
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_ng_container_2_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 44);
  }
  if (rf & 2) {
    const item_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", ctx_r23.mediaSrc(item_r21), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_ng_container_2_span_1_Template, 2, 1, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_ng_container_2_img_2_Template, 1, 1, "img", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r21.contentType === "text/plain");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r21.contentType !== "text/plain");
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_b_1_Template, 2, 1, "b", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_ng_container_2_Template, 3, 2, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r17 = ctx.$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", option_r17.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r16.contentItems(option_r17.text))("ngForTrackBy", ctx_r16.trackContent);
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, QuestionBankBluePrintComponent_div_20_div_7_div_6_div_1_Template, 3, 3, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const q_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", q_r7.options);
  }
}
function QuestionBankBluePrintComponent_div_20_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 31)(1, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 33)(4, "p", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, QuestionBankBluePrintComponent_div_20_div_7_ng_container_5_Template, 3, 2, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, QuestionBankBluePrintComponent_div_20_div_7_div_6_Template, 2, 1, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const q_r7 = ctx.$implicit;
    const j_r8 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", j_r8 + 1, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r6.questionContentItems(q_r7))("ngForTrackBy", ctx_r6.trackContent);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", q_r7.options && q_r7.options.length > 0);
  }
}
function QuestionBankBluePrintComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 25)(1, "div", 26)(2, "h3", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, QuestionBankBluePrintComponent_div_20_div_7_Template, 7, 4, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const group_r4 = ctx.$implicit;
    const i_r5 = ctx.index;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", i_r5 + 1, ". ", group_r4.type, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", group_r4.questions.length, " Questions x ", ctx_r1.formatMarks(group_r4.marksPerQuestion), " Marks ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", group_r4.questions);
  }
}
function QuestionBankBluePrintComponent_span_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r27 = ctx.$implicit;
    const last_r28 = ctx.last;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", s_r27, "", !last_r28 ? "," : "", " ");
  }
}
function QuestionBankBluePrintComponent_canvas_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "canvas", 46);
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("data", ctx_r3.objectivesChartData)("options", ctx_r3.objectivesChartOptions)("legend", true)("type", "doughnut");
  }
}
class QuestionBankBluePrintComponent {
  constructor() {
    this.currentStep = 3;
    this.totalMarks = 0;
    this.selectedQuestionsMarks = 0;
    this.examName = '';
    // Data from Parent
    this.finalSelectedQuestions = [];
    this.bluePrintChapterDropdownOptions = [];
    this.bluePrintObjectiveDropdownOptions = [];
    this.bluePrintData = [];
    this.backClick = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.generateClick = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.contentItems = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.contentItems;
    this.questionContentItems = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.questionContentItems;
    this.totalSteps = 3;
    // NEW: Dynamic Title
    this.chartTitle = 'Objective Analysis';
    this.groupedBlueprintData = [];
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
    if (changes['finalSelectedQuestions']) {
      this.processDataForView();
    }
  }
  processDataForView() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) return;
    const groups = {};
    this.finalSelectedQuestions.forEach(q => {
      const sectionName = `${q.type}:${q.marks}`;
      if (!groups[sectionName]) {
        groups[sectionName] = {
          type: q.heading,
          marksPerQuestion: q.marks,
          questions: []
        };
      }
      groups[sectionName].questions.push(q);
    });
    this.groupedBlueprintData = Object.values(groups);
    this.updateChartData();
    if (this.bluePrintContent) (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__.renderTexMath)(this.bluePrintContent.nativeElement);
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
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: QuestionBankBluePrintComponent,
      selectors: [["app-question-bank-blue-print"]],
      viewQuery: function QuestionBankBluePrintComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.bluePrintContent = _t.first);
        }
      },
      inputs: {
        currentStep: "currentStep",
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
        generateClick: "generateClick"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵNgOnChangesFeature"]],
      decls: 41,
      vars: 10,
      consts: [[1, "p-4", "md:p-8"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "mb-6", "border-b", "pb-4"], [1, "text-xl", "font-bold", "text-content"], [1, "text-sm", "text-gray-500"], [1, "font-semibold", "text-primary"], [1, "bg-blue-50", "border", "border-blue-100", "p-3", "rounded-lg", "flex", "items-center", "gap-2", "mt-3", "md:mt-0"], ["src", "assets/icons/Info 2.svg", "alt", "info", 1, "w-5", "h-5"], [1, "text-blue-800", "font-medium"], [1, "flex", "flex-col", "lg:flex-row", "gap-8"], [1, "flex-1", "flex", "flex-col"], ["tabindex", "0", "role", "region", "aria-label", "Question list \u2014 scroll to see all questions", 1, "max-h-[55vh]", "overflow-y-auto", "pr-2"], ["bluePrintContent", ""], ["class", "mb-8 bg-gray-50 rounded-lg border p-4", 4, "ngFor", "ngForOf"], [1, "mt-2", "pt-2", "border-t", "text-xs", "font-bold", "text-gray-500", "text-right"], ["class", "text-primary uppercase ml-1", 4, "ngFor", "ngForOf"], [1, "lg:w-80", "flex", "flex-col", "items-center"], [1, "sticky", "top-0", "w-full", "bg-white", "border", "rounded-xl", "p-6", "shadow-sm"], [1, "text-center", "font-bold", "text-content", "mb-4", "uppercase", "tracking-widest", "text-xs"], [1, "h-64"], ["baseChart", "", 3, "data", "options", "legend", "type", 4, "ngIf"], [1, "mt-6", "space-y-2", "border-t", "pt-4"], [1, "flex", "justify-between", "text-sm"], [1, "text-gray-500"], [1, "font-bold"], [1, "font-bold", 3, "ngClass"], [1, "mb-8", "bg-gray-50", "rounded-lg", "border", "p-4"], [1, "flex", "justify-between", "items-center", "border-b", "pb-2", "mb-4"], [1, "font-bold", "text-lg", "text-content"], [1, "bg-primary-10", "text-primary", "px-3", "py-1", "rounded-full", "text-xs", "font-bold"], [1, "space-y-3"], ["class", "bg-white p-3 rounded border flex gap-3", 4, "ngFor", "ngForOf"], [1, "bg-white", "p-3", "rounded", "border", "flex", "gap-3"], [1, "text-gray-400", "font-bold", "text-sm"], [1, "flex-1"], [1, "text-sm", "text-content", "mb-2"], [4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "ml-4 mb-2", 4, "ngIf"], [4, "ngIf"], ["class", "mt-2 max-h-40 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-2", "max-h-40", "max-w-full", 3, "src"], [1, "ml-4", "mb-2"], ["class", "text-xs text-gray-600", 4, "ngFor", "ngForOf"], [1, "text-xs", "text-gray-600"], ["class", "mt-1 max-h-24 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-1", "max-h-24", "max-w-full", 3, "src"], [1, "text-primary", "uppercase", "ml-1"], ["baseChart", "", 3, "data", "options", "legend", "type"]],
      template: function QuestionBankBluePrintComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Step 3/3: Preview & Blue Print");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Exam: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, " | Total Marks: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](13, "img", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "small", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "Review your distribution and selections before final generation.");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "div", 8)(17, "div", 9)(18, "div", 10, 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](20, QuestionBankBluePrintComponent_div_20_Template, 8, 5, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, " Sources included: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](23, QuestionBankBluePrintComponent_span_23_Template, 2, 2, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 15)(25, "div", 16)(26, "h3", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, QuestionBankBluePrintComponent_canvas_29_Template, 1, 4, "canvas", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "div", 20)(31, "div", 21)(32, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Selected Questions:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](35);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "div", 21)(37, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38, "Current Marks:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "span", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](40);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.examName);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.formatMarks(ctx.totalMarks));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.groupedBlueprintData);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.uniqueSources);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.chartTitle, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.objectivesChartData);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.finalSelectedQuestions.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx.selectedQuestionsMarks === ctx.totalMarks ? "text-primary" : "text-error");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", ctx.formatMarks(ctx.selectedQuestionsMarks), " / ", ctx.formatMarks(ctx.totalMarks), " ");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, ng2_charts__WEBPACK_IMPORTED_MODULE_5__.BaseChartDirective],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJxdWVzdGlvbi1iYW5rLWJsdWUtcHJpbnQuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1nZW5lcmF0aW9uL3F1ZXN0aW9uLWJhbmstYmx1ZS1wcmludC9xdWVzdGlvbi1iYW5rLWJsdWUtcHJpbnQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDRMQUE0TCIsInNvdXJjZVJvb3QiOiIifQ== */"]
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
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs */ 44665);
/* harmony import */ var src_app_shared_utility_animations_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/animations.util */ 29066);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 89475);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 43143);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs/operators */ 36647);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs/operators */ 61318);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var _question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./question-bank-template/question-bank-template.component */ 50261);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _question_bank_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../question-bank.service */ 69542);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/services/idle.service */ 7628);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var _question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./question-bank-blue-print/question-bank-blue-print.component */ 67589);







// Import Child Component for Step 2 access













const _c0 = ["headingDropdownContainer"];
const _c1 = function (a0, a1) {
  return {
    "bg-primary": a0,
    "bg-gray-300": a1
  };
};
function QuestionBankGenerationComponent_li_8_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "div", 23);
  }
  if (rf & 2) {
    const i_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().index;
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction2"](1, _c1, ctx_r11.currentStep > i_r10 + 1, ctx_r11.currentStep <= i_r10 + 1));
  }
}
const _c2 = function (a0, a1, a2) {
  return {
    "bg-primary text-white border-primary": a0,
    "bg-blue-100 text-primary border-primary": a1,
    "bg-gray-200 text-gray-400 border-gray-300": a2
  };
};
function QuestionBankGenerationComponent_li_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "li", 19)(1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, QuestionBankGenerationComponent_li_8_div_5_Template, 1, 4, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r10 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-current", ctx_r0.currentStep === i_r10 + 1 ? "step" : null)("aria-label", (ctx_r0.currentStep === i_r10 + 1 ? "Current step: " : ctx_r0.currentStep > i_r10 + 1 ? "Completed: " : "Upcoming: ") + ctx_r0.stepNames[i_r10]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction3"](6, _c2, ctx_r0.currentStep > i_r10 + 1, ctx_r0.currentStep === i_r10 + 1, ctx_r0.currentStep < i_r10 + 1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", i_r10 + 1, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r0.stepNames[i_r10], " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r10 < ctx_r0.totalSteps - 1);
  }
}
function QuestionBankGenerationComponent_p_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const stepName_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", stepName_r13, " ");
  }
}
function QuestionBankGenerationComponent_div_15_ng_container_20_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, option_r25.info));
  }
}
function QuestionBankGenerationComponent_div_15_ng_container_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "strong", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, QuestionBankGenerationComponent_div_15_ng_container_20_span_4_Template, 3, 3, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const option_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 2, option_r25.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", option_r25.info);
  }
}
function QuestionBankGenerationComponent_div_15_small_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_div_15_small_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
const _c3 = function () {
  return {
    standalone: true
  };
};
function QuestionBankGenerationComponent_div_15_div_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 56)(1, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_15_div_58_Template_input_ngModelChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r31);
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r30.questionBankTypeValue = $event);
    })("change", function QuestionBankGenerationComponent_div_15_div_58_Template_input_change_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r31);
      const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r32.onQuestionTypeChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "label", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const type_r28 = ctx.$implicit;
    const i_r29 = ctx.index;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r17.questionBankTypeValue)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](6, _c3))("id", type_r28.name + i_r29)("value", type_r28.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("for", type_r28.name + i_r29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](type_r28.name);
  }
}
function QuestionBankGenerationComponent_div_15_div_62_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_div_62_div_1_Template_app_form_dropdown_valueChange_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r36);
      const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r35.onSubtopicChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "subTopic")("dropDownCtrl", ctx_r33.convertToFormControl(ctx_r33.f["subTopic"]))("dropDownValues", ctx_r33.subtopicsDropdownOptions)("config", ctx_r33.subTopicDropdownconfig)("submitted", ctx_r33.submittedConfig);
  }
}
function QuestionBankGenerationComponent_div_15_div_62_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 60)(1, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, " Sub-Topic ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 62)(4, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "svg", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](6, "path", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "span", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8, "No subtopics - Entire chapter selected");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "span", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](10, " Info ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
}
function QuestionBankGenerationComponent_div_15_div_62_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankGenerationComponent_div_15_div_62_div_1_Template, 2, 5, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankGenerationComponent_div_15_div_62_div_2_Template, 11, 0, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r18.hasSubtopics || !ctx_r18.f["chapter"].value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r18.f["chapter"].value && !ctx_r18.hasSubtopics);
  }
}
function QuestionBankGenerationComponent_div_15_div_68_div_6_label_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "label", 78)(1, "input", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("change", function QuestionBankGenerationComponent_div_15_div_68_div_6_label_4_Template_input_change_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r42);
      const h_r40 = restoredCtx.$implicit;
      const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r41.toggleHeading($event, h_r40));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const h_r40 = ctx.$implicit;
    const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("checked", ctx_r39.isHeadingSelected(h_r40));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r39.headingDisplay(h_r40), " ");
  }
}
function QuestionBankGenerationComponent_div_15_div_68_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 74)(1, "label", 75)(2, "input", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("change", function QuestionBankGenerationComponent_div_15_div_68_div_6_Template_input_change_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r44);
      const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r43.toggleAllHeadings($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3, " Select All ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, QuestionBankGenerationComponent_div_15_div_68_div_6_label_4_Template, 3, 2, "label", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("checked", ctx_r38.isAllHeadingsSelected());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r38.availableHeadings);
  }
}
function QuestionBankGenerationComponent_div_15_div_68_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 68, 69)(2, "button", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_15_div_68_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r46);
      const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r45.toggleHeadingDropdown());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](5, "img", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, QuestionBankGenerationComponent_div_15_div_68_div_6_Template, 5, 2, "div", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r19.headingSummary());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r19.showHeadingDropdown);
  }
}
function QuestionBankGenerationComponent_div_15_small_69_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Required: Please select at least one type");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_div_15_ng_template_70_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Select a chapter first ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_div_15_div_72_th_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "th", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const obj_r50 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](obj_r50.objective);
  }
}
function QuestionBankGenerationComponent_div_15_div_72_td_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r54 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "td", 89)(1, "input", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_15_div_72_td_10_Template_input_ngModelChange_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r54);
      const obj_r51 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](obj_r51.percentageDistribution = $event);
    })("ngModelChange", function QuestionBankGenerationComponent_div_15_div_72_td_10_Template_input_ngModelChange_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r54);
      const i_r52 = restoredCtx.index;
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r55.calculateTotalPercentage(i_r52));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const obj_r51 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", obj_r51.percentageDistribution)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](2, _c3));
  }
}
function QuestionBankGenerationComponent_div_15_div_72_small_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "small", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("Total distribution must equal 100% (Current: ", ctx_r49.totalPercentage, "%)");
  }
}
function QuestionBankGenerationComponent_div_15_div_72_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 80)(1, "h2", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Objectives Weightage (%)");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 82)(4, "table", 83)(5, "thead", 84)(6, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, QuestionBankGenerationComponent_div_15_div_72_th_7_Template, 2, 1, "th", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "tbody")(9, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, QuestionBankGenerationComponent_div_15_div_72_td_10_Template, 2, 3, "td", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](11, QuestionBankGenerationComponent_div_15_div_72_small_11_Template, 2, 1, "small", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", ctx_r23.totalPercentage === 100 ? "border-primary-10" : "border-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r23.questionBankObjectives);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r23.questionBankObjectives);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r23.totalPercentage !== 100);
  }
}
function QuestionBankGenerationComponent_div_15_div_73_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r60 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr", 101)(1, "td", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td", 103)(4, "input", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function QuestionBankGenerationComponent_div_15_div_73_tr_14_Template_input_ngModelChange_4_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r60);
      const c_r57 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](c_r57.marks = $event);
    })("ngModelChange", function QuestionBankGenerationComponent_div_15_div_73_tr_14_Template_input_ngModelChange_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r60);
      const i_r58 = restoredCtx.index;
      const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r61.updatePercentage(i_r58));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "td", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const c_r57 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](c_r57.unitName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", c_r57.marks)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](4, _c3));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", c_r57.percentageDistribution, "%");
  }
}
function QuestionBankGenerationComponent_div_15_div_73_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 80)(1, "h2", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "Topic-wise Marks Distribution");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 82)(4, "table", 91)(5, "thead", 92)(6, "tr")(7, "th", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8, "Chapter/Topic Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "th", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](10, "Allocated Marks");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "th", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12, "Weightage %");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](14, QuestionBankGenerationComponent_div_15_div_73_tr_14_Template, 7, 5, "tr", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "tfoot", 97)(16, "tr")(17, "td", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18, "Total:");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "td", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "td", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", ctx_r24.totalMarks === ctx_r24.totalDistributedMarks ? "border-primary-10" : "border-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r24.marksDistribution);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", ctx_r24.totalMarks !== ctx_r24.totalDistributedMarks ? "text-error" : "text-primary");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"](" ", ctx_r24.formatMarks(ctx_r24.totalDistributedMarks), " / ", ctx_r24.formatMarks(ctx_r24.totalMarks), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", ctx_r24.totalDistributedPercentage, "%");
  }
}
function QuestionBankGenerationComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r63 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 25)(1, "div", 26)(2, "h2", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3, "Step 1/3: Configuration");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div", 28)(5, "form", 29)(6, "div", 30)(7, "div", 31)(8, "div")(9, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r62.onBoardChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 33)(11, "label", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](13, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("focus", function QuestionBankGenerationComponent_div_15_Template_span_focus_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r64.sourceHelpOpen = true);
    })("blur", function QuestionBankGenerationComponent_div_15_Template_span_blur_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r65.sourceHelpOpen = false);
    })("click", function QuestionBankGenerationComponent_div_15_Template_span_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r66.sourceHelpOpen = true);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](17, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](18, "img", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "span", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](20, QuestionBankGenerationComponent_div_15_ng_container_20_Template, 5, 4, "ng-container", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_21_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r67.onSourceGenerationChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "div")(23, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r68.onStandardChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](24, "div")(25, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r69.onMediumChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](26, "div", 40)(27, "div")(28, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_28_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r70 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r70.onSubjectChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "div")(30, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_30_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r71 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r71.onLanguageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "div", 40)(32, "div")(33, "label", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](35, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](36, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](37, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](38, "input", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](39, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](40, QuestionBankGenerationComponent_div_15_small_40_Template, 2, 0, "small", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](41, "div")(42, "label", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](44, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](45, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](46, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](47, "input", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](48, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](49, QuestionBankGenerationComponent_div_15_small_49_Template, 2, 0, "small", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](50, "div", 40)(51, "div")(52, "label", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](54, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](55, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](56, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](57, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](58, QuestionBankGenerationComponent_div_15_div_58_Template, 4, 7, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](59, "div", 49)(60, "div")(61, "app-form-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function QuestionBankGenerationComponent_div_15_Template_app_form_dropdown_valueChange_61_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r63);
      const ctx_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r72.onChapterChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](62, QuestionBankGenerationComponent_div_15_div_62_Template, 3, 2, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](63, "div")(64, "label", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](65, "Question Types / Headings ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](66, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](67, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](68, QuestionBankGenerationComponent_div_15_div_68_Template, 7, 2, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](69, QuestionBankGenerationComponent_div_15_small_69_Template, 2, 0, "small", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](70, QuestionBankGenerationComponent_div_15_ng_template_70_Template, 2, 0, "ng-template", null, 52, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](72, QuestionBankGenerationComponent_div_15_div_72_Template, 12, 4, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](73, QuestionBankGenerationComponent_div_15_div_73_Template, 23, 6, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](71);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", ctx_r2.currentStep === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx_r2.questionBankConfigForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "board")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["board"]))("dropDownValues", ctx_r2.boardDropdownOptions)("config", ctx_r2.boardDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](13, 57, "Source"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](17, 59, "Help"))("aria-expanded", ctx_r2.sourceHelpOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("opacity-100", ctx_r2.sourceHelpOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r2.sourceGenerationOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "sourceGeneration")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["sourceGeneration"]))("dropDownValues", ctx_r2.sourceGenerationOptions)("config", ctx_r2.sourceGenerationDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "grade")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["grade"]))("dropDownValues", ctx_r2.classDropdownOptions)("config", ctx_r2.classDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "medium")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["medium"]))("dropDownValues", ctx_r2.mediumDropdownOptions)("config", ctx_r2.mediumDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "subject")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["subject"]))("dropDownValues", ctx_r2.subjectDropdownOptions)("config", ctx_r2.subjectDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "language")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["language"]))("dropDownValues", ctx_r2.languageDropdownOptions)("config", ctx_r2.languageDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](35, 61, "Examination Name"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](39, 63, "Examination Name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.submittedConfig && (ctx_r2.f["examinationName"].errors == null ? null : ctx_r2.f["examinationName"].errors["required"]));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](44, 65, "Total Marks"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](48, 67, "Total Marks"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.submittedConfig && (ctx_r2.f["totalMarks"].errors == null ? null : ctx_r2.f["totalMarks"].errors["required"]));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](54, 69, "Scope"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r2.questionBankTypes);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "chapter")("dropDownCtrl", ctx_r2.convertToFormControl(ctx_r2.f["chapter"]))("dropDownValues", ctx_r2.chapterDropdownOptions)("config", ctx_r2.chapterDropdownconfig)("submitted", ctx_r2.submittedConfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.questionBankTypeValue === "singleChapter");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.availableHeadings.length)("ngIfElse", _r21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.submittedConfig && (!ctx_r2.selectedHeadings || ctx_r2.selectedHeadings.length === 0));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.useAI && ctx_r2.questionBankObjectives.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r2.useAI && ctx_r2.marksDistribution.length);
  }
}
function QuestionBankGenerationComponent_div_16_app_question_bank_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r75 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "app-question-bank-template", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("selectionChange", function QuestionBankGenerationComponent_div_16_app_question_bank_template_1_Template_app_question_bank_template_selectionChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r75);
      const ctx_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r74.selectedQuestions = $event);
    })("backClick", function QuestionBankGenerationComponent_div_16_app_question_bank_template_1_Template_app_question_bank_template_backClick_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r75);
      const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r76.previousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r73 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("currentStep", ctx_r73.currentStep)("totalMarks", ctx_r73.totalMarks)("availableQuestions", ctx_r73.allAvailableQuestions)("preSelectedQuestions", ctx_r73.selectedQuestions)("subject", ctx_r73.f["subject"].value);
  }
}
function QuestionBankGenerationComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, QuestionBankGenerationComponent_div_16_app_question_bank_template_1_Template, 1, 5, "app-question-bank-template", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", ctx_r3.currentStep === 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r3.isLoadingQuestions);
  }
}
function QuestionBankGenerationComponent_div_17_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r79 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 112)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "No questions selected for preview.");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "button", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_div_17_div_2_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r79);
      const ctx_r78 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r78.previousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "Go Back");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
}
function QuestionBankGenerationComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r81 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 109)(1, "app-question-bank-blue-print", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("backClick", function QuestionBankGenerationComponent_div_17_Template_app_question_bank_blue_print_backClick_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r81);
      const ctx_r80 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r80.previousStep());
    })("generateClick", function QuestionBankGenerationComponent_div_17_Template_app_question_bank_blue_print_generateClick_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r81);
      const ctx_r82 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r82.onSubmit(3));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, QuestionBankGenerationComponent_div_17_div_2_Template, 5, 0, "div", 111);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInOut", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("finalSelectedQuestions", ctx_r4.finalSelectedQuestions)("examName", ctx_r4.questionBankConfigForm.value.examinationName)("totalMarks", ctx_r4.totalMarks)("selectedQuestionsMarks", ctx_r4.selectedQuestionsMarks);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r4.finalSelectedQuestions || ctx_r4.finalSelectedQuestions.length === 0);
  }
}
function QuestionBankGenerationComponent_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r84 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r84);
      const ctx_r83 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r83.previousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Previous ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r86 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_20_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r86);
      const ctx_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r85.onSubmit(1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Next: Select Questions ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_button_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r88 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_21_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r88);
      const ctx_r87 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r87.onSubmit(2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, " Next: View Blue Print ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function QuestionBankGenerationComponent_button_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r90 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_button_22_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r90);
      const ctx_r89 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r89.generateMergedQuestionBank());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r8.isLoadingQuestions);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 2, ctx_r8.isLoadingQuestions ? "Creating question paper..." : "Generate Final Paper"), " ");
  }
}
const _c4 = function () {
  return [];
};
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
  constructor(fb, utilityservice, translateService, questionBankService, router, idleService, http) {
    this.fb = fb;
    this.utilityservice = utilityservice;
    this.translateService = translateService;
    this.questionBankService = questionBankService;
    this.router = router;
    this.idleService = idleService;
    this.http = http;
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.questionText = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_2__.questionText;
    this.submittedConfig = false;
    // Backend Modes 
    this.useLBA = false;
    this.useAI = false;
    // Data Pools
    this.allAvailableQuestions = [];
    this.isLoadingQuestions = false;
    this.finalSelectedQuestions = [];
    // Dropdown Options
    this.boardDropdownOptions = [];
    this.mediumDropdownOptions = [];
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
    this.chapterDropdownOptions = [];
    this.subtopicsDropdownOptions = [];
    this.languageDropdownOptions = [];
    this.sourceGenerationOptions = [];
    this.lbaChapters = [];
    this.paperQuestionTypes = [];
    this.availableHeadings = [];
    this.selectedHeadings = [];
    this.showHeadingDropdown = false;
    this.hasSubtopics = false;
    this.sourceHelpOpen = false;
    // Configs
    this.boardDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Board',
      height: 'auto',
      fieldName: 'Board',
      bindLable: 'board',
      bindValue: 'board',
      required: true,
      clearableOff: true
    };
    this.sourceGenerationDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Source',
      height: 'auto',
      fieldName: 'Source',
      bindLable: 'name',
      bindValue: 'name',
      required: true,
      clearableOff: true,
      multi: true,
      selectAllOption: true,
      selectAllValue: 'name',
      openOnSelect: true,
      hideLabel: true,
      hideChipIcons: true
    };
    this.mediumDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Medium',
      height: 'auto',
      fieldName: 'Medium',
      bindLable: 'mediumLabel',
      bindValue: 'medium',
      required: true,
      clearableOff: true
    };
    this.languageDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Translate to',
      height: 'auto',
      fieldName: 'Translate to',
      bindLable: 'name',
      bindValue: 'value',
      required: true,
      clearableOff: true
    };
    this.classDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Class',
      height: 'auto',
      fieldName: 'Class',
      bindLable: 'class',
      bindValue: 'class',
      required: true,
      clearableOff: true
    };
    this.subjectDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Subject',
      height: 'auto',
      fieldName: 'Subject',
      bindLable: 'name',
      bindValue: 'value',
      required: true,
      clearableOff: true
    };
    this.chapterDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Chapter',
      height: 'auto',
      fieldName: 'Chapter',
      bindLable: 'topics',
      bindValue: 'topics',
      required: true,
      clearableOff: true,
      multi: true,
      selectAllOption: true,
      selectAllValue: 'topics',
      openOnSelect: true
    };
    this.subTopicDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Sub-Topic',
      height: 'auto',
      fieldName: 'Sub-Topic',
      bindLable: 'topics',
      bindValue: 'topics',
      selectAllValue: 'topics',
      required: true,
      clearableOff: true,
      multi: true,
      selectAllOption: true,
      openOnSelect: true
    };
    this.chapterIds = [];
    this.questionBankTypes = [{
      value: 'multiChapter',
      name: 'Multiple Chapters'
    }, {
      value: 'singleChapter',
      name: 'Single Chapter'
    }];
    this.questionBankTypeValue = 'multiChapter';
    this.questionBankObjectives = [];
    this.totalMarks = 0;
    this.totalPercentage = 100;
    this.totalDistributedMarks = 0;
    this.totalDistributedPercentage = 0;
    this.marksDistribution = [];
    this.currentStep = 1;
    this.totalSteps = 3;
    this.stepNames = ['Configuration', 'Select Questions', 'Preview & Generate'];
    this.objectiveChartMapper = {};
    this.totalTemplateMarks = 0;
    this.selectedQuestionsCount = 0;
    this.selectedQuestionsMarks = 0;
    this.filteredQuestions = [];
    this.selectedQuestions = [];
    this.currentTotalMarks = 0;
    this.filterSource = 'ALL';
    this.searchQuery = '';
    this.groupedQuestions = [];
    this.stepArray = Array(this.totalSteps).fill(0);
  }
  ngOnInit() {
    this.initializeForm();
    const data = localStorage.getItem('userData') ?? '';
    if (data) {
      this.loggedInUser = JSON.parse(data);
      this.getBoardsList(this.loggedInUser);
    }
    this.languageDropdownOptions = [{
      name: 'English',
      value: 'english'
    }, {
      name: 'Kannada',
      value: 'kannada'
    }, {
      name: 'Telugu',
      value: 'telugu'
    }];
    // Ensure initial validation state is correct
    this.updateFormValidators();
  }
  // Create paper directly for LBA-only selections
  generateLBAQuestionPaper(selectedQuestions) {
    if (!selectedQuestions || selectedQuestions.length === 0) {
      this.utilityservice.showError('No LBA questions selected');
      return;
    }
    const formVal = this.questionBankConfigForm.getRawValue();
    let payload = this.getTemplatePayload();
    // Ensure marksDistribution present
    if (payload.marksDistribution.length === 0) {
      const unitMap = new Map();
      selectedQuestions.forEach(q => {
        const unit = q.unitName;
        if (!unitMap.has(unit)) unitMap.set(unit, {
          unitName: unit,
          marks: 0
        });
        unitMap.get(unit).marks += Number(q.marks);
      });
      payload.marksDistribution = Array.from(unitMap.values()).map(d => ({
        unitName: d.unitName,
        marks: d.marks,
        percentageDistribution: payload.totalMarks > 0 ? d.marks / payload.totalMarks * 100 : 0
      }));
    }
    const grouped = new Map();
    selectedQuestions.forEach(q => {
      const sectionType = q.type;
      const sectionKey = `${sectionType}:${Number(q.marks)}`;
      if (!grouped.has(sectionKey)) {
        grouped.set(sectionKey, {
          type: sectionType,
          numberOfQuestions: 0,
          marksPerQuestion: Number(q.marks),
          questions: []
        });
      }
      const sec = grouped.get(sectionKey);
      sec.questions.push(this.slimLbaQuestion(q));
      sec.numberOfQuestions = sec.questions.length;
    });
    payload.questions = Array.from(grouped.values());
    payload.template = Array.from(grouped.values()).map(s => ({
      type: s.type,
      numberOfQuestions: s.numberOfQuestions,
      marksPerQuestion: s.marksPerQuestion,
      questionDistribution: [{
        unitName: selectedQuestions[0].unitName,
        objective: selectedQuestions[0].objective
      }]
    }));
    this.isLoadingQuestions = true;
    this.questionBankService.generateQuestionBank(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.finalize)(() => {
      this.isLoadingQuestions = false;
    })).subscribe({
      next: res => {
        const finalId = this.extractIdFromResponse(res);
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/question-paper/view/${finalId}`]);
        } else {
          this.utilityservice.showSuccess('Paper created but ID not returned by server.');
        }
      },
      error: err => {
        console.error('[QB-LOG] generateQuestionBank (LBA) ERROR:', err);
        let serverMsgLBA = err?.error?.message || err?.message || '';
        this.utilityservice.showError('Failed to create LBA paper: ' + (serverMsgLBA || 'Unknown'));
      }
    });
  }
  initializeForm() {
    this.questionBankConfigForm = this.fb.group({
      medium: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      board: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      sourceGeneration: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      language: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      grade: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      subject: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      chapter: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      subTopic: [null],
      totalMarks: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      examinationName: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      selectedHeadings: [[]]
    });
    this.questionBankConfigForm.get('totalMarks')?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.distinctUntilChanged)()).subscribe({
      next: val => {
        this.totalMarks = Number(val);
        if (this.useAI) this.distributeMarks();
      }
    });
  }
  updateFormValidators() {
    if (this.questionBankTypeValue === 'singleChapter' && this.hasSubtopics) {
      this.f.subTopic.enable();
      this.f.subTopic.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]);
    } else {
      this.f.subTopic.clearValidators();
      this.f.subTopic.disable();
    }
    this.f.subTopic.updateValueAndValidity();
    this.f.chapter.enable();
    this.f.chapter.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]);
    this.f.chapter.updateValueAndValidity();
    this.f.selectedHeadings.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.minLength(1)]);
    this.f.selectedHeadings.updateValueAndValidity();
  }
  onSourceGenerationChange(selected) {
    this.useAI = selected.includes(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI);
    this.useLBA = selected.includes(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA);
    this.updateLBAAvailableHeadings();
    this.updateFormValidators();
    if (this.useAI) this.distributeMarks();
  }
  onBackendModeChange() {
    this.updateFormValidators();
    if (this.useAI) this.distributeMarks();
    this.updateLBAAvailableHeadings();
  }
  convertToFormControl(absCtrl) {
    return absCtrl;
  }
  get f() {
    return this.questionBankConfigForm.controls;
  }
  getBoardsList(userDetails) {
    if (!userDetails || !userDetails.classes) return;
    const rawClasses = userDetails.classes;
    const uniqueBoards = new Set();
    rawClasses.forEach(c => {
      if (c.board) uniqueBoards.add(c.board);
    });
    this.boardDropdownOptions = Array.from(uniqueBoards).map(b => ({
      board: b
    }));
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
    this.classDropdownOptions = [];
    this.resetDistribution();
    if (val) {
      const boardName = val.board;
      const rawClasses = this.loggedInUser.classes;
      const uniqueClasses = new Set(rawClasses.filter(c => c.board === boardName).map(c => c.class));
      this.classDropdownOptions = Array.from(uniqueClasses).map(c => ({
        class: String(c)
      })).sort((a, b) => parseInt(a.class) - parseInt(b.class));
      this.questionBankService.getPaperConfig({
        board: boardName,
        grade: '',
        subjectName: ''
      }).subscribe(config => this.updateSourceOptions(config.questionSources));
    }
  }
  updateSourceOptions(questionSources) {
    this.sourceGenerationOptions = SOURCE_GENERATION_OPTIONS.filter(option => questionSources.includes(String(option.value)));
    const currentVal = this.f.sourceGeneration.value;
    if (!currentVal) return;
    const currentSelections = Array.isArray(currentVal) ? currentVal : [currentVal];
    const validValues = new Set(this.sourceGenerationOptions.map(opt => opt.name));
    const validSelections = currentSelections.filter(sel => validValues.has(sel));
    if (validSelections.length !== currentSelections.length) {
      this.f.sourceGeneration.setValue(validSelections);
      this.onSourceGenerationChange(validSelections);
    }
  }
  onStandardChange(val) {
    this.f.medium.reset();
    this.f.subject.reset();
    this.subjectDropdownOptions = [];
    this.resetDistribution();
    if (val) {
      const selectedClass = val.class;
      const selectedBoard = this.f.board.value;
      const rawClasses = this.loggedInUser.classes;
      const uniqueMediums = new Set();
      rawClasses.forEach(c => {
        if (c.board === selectedBoard && String(c.class) === String(selectedClass)) {
          if (c.medium) uniqueMediums.add(c.medium);
        }
      });
      this.mediumDropdownOptions = Array.from(uniqueMediums).map(m => ({
        medium: m,
        mediumLabel: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
      }));
      if (this.mediumDropdownOptions.length === 1) {
        this.f.medium.setValue(this.mediumDropdownOptions[0].medium);
        this.onMediumChange({
          medium: this.mediumDropdownOptions[0].medium
        });
      }
    }
  }
  onMediumChange(val) {
    this.f.subject.reset();
    this.f.language.reset(); // Reset language when medium changes
    this.subjectDropdownOptions = [];
    this.resetDistribution();
    if (val) {
      const selectedMedium = val.medium.toLowerCase();
      const selectedClass = this.f.grade.value;
      const selectedBoard = this.f.board.value;
      const rawClasses = this.loggedInUser.classes;
      // Auto-select language based on medium
      const matchedLanguage = this.languageDropdownOptions.find(opt => opt.name.toLowerCase() === selectedMedium);
      if (matchedLanguage) {
        this.f.language.setValue(matchedLanguage.value);
      }
      const subjectMap = new Map(); // Formatted Name -> Raw Value
      rawClasses.forEach(c => {
        const rawSelectedMedium = val.medium;
        if (c.board === selectedBoard && String(c.class) === String(selectedClass) && c.medium === rawSelectedMedium) {
          const rawValue = c.subject;
          const nameToFormat = c.subject;
          if (rawValue) {
            const formatted = this.formatSubjectName(nameToFormat);
            // Only add if not already present to ensure deduplication by formatted name
            if (!subjectMap.has(formatted)) {
              subjectMap.set(formatted, rawValue);
            }
          }
        }
      });
      this.subjectDropdownOptions = Array.from(subjectMap.entries()).map(([name, value]) => ({
        name,
        value
      })).sort((a, b) => a.name.localeCompare(b.name));
    }
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
      (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.forkJoin)({
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
      }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
        next: ({
          config,
          chapters
        }) => {
          this.paperQuestionTypes = config.questionTypes;
          this.questionBankObjectives = structuredClone(config.objectives);
          this.updateSourceOptions(config.questionSources);
          this.chapterDropdownOptions = chapters.map(ch => ({
            ...ch,
            topics: ch.title,
            _id: ch._id,
            chapterNumber: ch.chapterNumber,
            headings: ch.headings,
            subTopics: ch.subTopics,
            source: 'Unified'
          })).sort((a, b) => {
            return a.chapterNumber === b.chapterNumber ? a.topics.localeCompare(b.topics) : a.chapterNumber - b.chapterNumber;
          });
          this.lbaChapters = this.chapterDropdownOptions;
          this.updateLBAAvailableHeadings();
        },
        error: err => {
          console.error("Error fetching chapters", err);
          this.utilityservice.showError('Failed to load chapters.');
        }
      });
    }
  }
  onChapterChange(val) {
    this.distributeMarks();
    this.f.subTopic.reset();
    // ng-select (change) emits full item objects; onQuestionTypeChange passes bound strings.
    // Normalize both cases to string[].
    const toName = v => v && typeof v === 'object' ? v.topics : v;
    let selectedChapterNames = [];
    if (Array.isArray(val)) selectedChapterNames = val.map(toName);else if (val) selectedChapterNames = [toName(val)];
    // Filter to get full chapter data
    const selectedChaptersFullData = this.chapterDropdownOptions.filter(ch => selectedChapterNames.includes(ch.topics));
    // Combine subtopics from all selected chapters
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
    this.subTopicDropdownconfig = {
      ...this.subTopicDropdownconfig,
      bindValue: 'topics',
      bindLable: 'topics'
    };
    // Set flag and update validators
    this.hasSubtopics = this.subtopicsDropdownOptions.length > 0;
    this.updateFormValidators();
    this.updateLBAAvailableHeadings();
  }
  updateLBAAvailableHeadings() {
    const sourceVal = this.f.sourceGeneration.value;
    if (sourceVal) {
      this.useAI = sourceVal.includes(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI);
      this.useLBA = sourceVal.includes(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA);
    }
    const rawVal = this.f.chapter.value;
    const selectedTopics = Array.isArray(rawVal) ? rawVal : rawVal ? [rawVal] : [];
    const selectedChapters = this.chapterDropdownOptions.filter(ch => selectedTopics.includes(ch.topics));
    const headingMap = new Map();
    const hasGrammar = selectedChapters.some(ch => ch.isGrammar);
    const hasNonGrammar = selectedChapters.some(ch => !ch.isGrammar);
    if (this.useAI) {
      this.paperQuestionTypes.filter(q => {
        const isGrammar = q.key.startsWith('GRAMMAR_');
        return isGrammar ? hasGrammar : hasNonGrammar || selectedChapters.length === 0;
      }).forEach(q => {
        q.marksPerQuestion.forEach(marks => {
          const selectionKey = q.key;
          if (!headingMap.has(selectionKey)) headingMap.set(selectionKey, {
            ...q,
            selectionKey,
            displayName: q.label,
            name: q.label,
            label: q.label,
            count: 0,
            chapters: new Set(),
            aiVariants: [],
            lbaHeadings: new Set()
          });
          headingMap.get(selectionKey).aiVariants.push({
            ...q,
            marksPerQuestion: marks,
            name: q.label,
            label: q.label
          });
        });
      });
    }
    for (const chapter of selectedChapters) {
      if (!this.useLBA) continue;
      const lbaData = chapter.headings;
      for (const h of lbaData) {
        const selectionKey = h.key;
        const headingName = h.label;
        const headingCount = Number(h.count);
        if (!headingMap.has(selectionKey)) headingMap.set(selectionKey, {
          ...h,
          selectionKey,
          displayName: headingName,
          name: headingName,
          label: h.label,
          count: 0,
          chapters: new Set(),
          aiVariants: [],
          lbaHeadings: new Set()
        });
        const agg = headingMap.get(selectionKey);
        agg.lbaHeadings.add(h.name);
        agg.count += headingCount;
        agg.chapters.add(chapter.chapterNumber);
      }
    }
    this.availableHeadings = Array.from(headingMap.values()).map(x => ({
      ...x,
      name: x.name,
      label: x.label,
      displayName: x.displayName,
      selectionKey: x.selectionKey,
      aiVariants: x.aiVariants,
      lbaHeadings: Array.from(x.lbaHeadings),
      count: x.count,
      chapters: Array.from(x.chapters).sort((a, b) => a - b)
    })).sort((a, b) => a.count === b.count ? a.displayName.localeCompare(b.displayName) : b.count - a.count);
    const selectionKeys = new Set(this.availableHeadings.map(h => h.selectionKey));
    this.selectedHeadings = this.selectedHeadings.filter(h => selectionKeys.has(h.selectionKey));
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  onSubmit(step) {
    switch (step) {
      case 1:
        this.processStep1();
        break;
      case 2:
        const selections = this.templateComponent?.selectedQuestions?.length ? this.templateComponent.selectedQuestions : this.selectedQuestions;
        if (!selections || selections.length === 0) {
          this.utilityservice.showWarning("Please select at least one question.");
          return;
        }
        this.processStep2(selections);
        break;
      case 3:
        this.generateMergedQuestionBank();
        break;
    }
  }
  processStep1() {
    this.totalMarks = Number(this.questionBankConfigForm.value.totalMarks);
    this.submittedConfig = true;
    if (this.questionBankConfigForm.invalid) {
      this.utilityservice.showError('Please fill all required fields');
      return;
    }
    const rawSources = this.f['sourceGeneration'].value;
    const selectedSources = Array.isArray(rawSources) ? rawSources : typeof rawSources === 'string' ? rawSources.split(',').map(s => s.trim()) : [];
    this.useAI = selectedSources.includes(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI);
    this.useLBA = selectedSources.includes(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA);
    if (!this.useAI && !this.useLBA) {
      this.utilityservice.showError('Please select at least one Source');
      return;
    }
    this.isLoadingQuestions = true;
    this.allAvailableQuestions = [];
    this.selectedQuestions = []; // Clear previous selections when config changes
    (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.concat)(this.useLBA ? this.fetchLBAQuestionsPool() : (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([]), this.useAI ? this.generateAIQuestionsPool() : (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([])).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.toArray)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(([lbaQs, aiQs]) => [...aiQs, ...lbaQs]), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
      next: results => {
        this.allAvailableQuestions = results;
        if (this.allAvailableQuestions.length > 0) {
          this.currentStep = 2; // Success: Move to Step 2
        } else {
          this.utilityservice.showWarning('No questions found for the selected criteria.');
        }
      },
      error: err => {
        console.error("Step 1 Error:", err);
        this.utilityservice.showError('Failed to fetch questions.');
      }
    });
  }
  processStep2(selections) {
    this.selectedQuestions = selections;
    this.finalSelectedQuestions = this.selectedQuestions;
    this.questionBankBluePrintData = this.generateSummaryBlueprint(this.finalSelectedQuestions);
    this.selectedQuestionsMarks = this.finalSelectedQuestions.reduce((sum, q) => sum + Number(q.marks), 0);
    this.totalTemplateMarks = this.selectedQuestionsMarks;
    this.currentStep = 3;
  }
  generateMergedQuestionBank() {
    if (!this.finalSelectedQuestions || this.finalSelectedQuestions.length === 0) {
      this.utilityservice.showError("No questions selected.");
      return;
    }
    this.isLoadingQuestions = true;
    const formVal = this.questionBankConfigForm.getRawValue();
    // 1. Prepare Base Payload
    let payload = this.getTemplatePayload();
    payload.isPreview = false; // ENSURE THIS IS FALSE TO TRIGGER DB SAVE
    // 2. Organize Selected Questions into Sections
    const sectionsMap = new Map();
    this.finalSelectedQuestions.forEach(q => {
      const heading = q.heading;
      const sectionKey = `${q.type}:${Number(q.marks)}`;
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          type: q.type,
          heading: heading,
          marksPerQuestion: Number(q.marks),
          numberOfQuestions: 0,
          questions: []
        });
      }
      const section = sectionsMap.get(sectionKey);
      section.questions.push(q.source === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.AI ? {
        question: q.text,
        options: q.options,
        keyAnswer: q.keyAnswer,
        marks: Number(q.marks),
        _id: q._id,
        unitName: q.unitName,
        objective: q.objective,
        value1: q.value1,
        value2: q.value2
      } : this.slimLbaQuestion(q));
      section.numberOfQuestions = section.questions.length;
    });
    const finalSections = Array.from(sectionsMap.values());
    payload.questions = finalSections;
    // 3. Create Template for backend validation
    payload.template = finalSections.map(s => ({
      type: s.type,
      numberOfQuestions: s.numberOfQuestions,
      marksPerQuestion: s.marksPerQuestion,
      questionDistribution: s.questions.map(q => ({
        unitName: q.unitName,
        objective: q.objective
      }))
    }));
    // 4. CALL BACKEND TO SAVE
    this.questionBankService.generateQuestionBank(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.finalize)(() => this.isLoadingQuestions = false)).subscribe({
      next: res => {
        const finalId = this.extractIdFromResponse(res);
        if (finalId) {
          this.utilityservice.showSuccess('Question Paper Created Successfully!');
          this.router.navigate([`/question-paper/view/${finalId}`]);
        } else {
          this.utilityservice.showError("Paper created but ID not found.");
        }
      },
      error: err => {
        let serverMsg = err?.error?.message || err?.message || 'Failed to generate paper';
        this.utilityservice.showError(serverMsg);
      }
    });
  }
  extractIdFromResponse(res) {
    return res.data._id;
  }
  slimLbaQuestion(q) {
    const parts = String(q._id).split('_pair_');
    const lbaQuestionId = parts[0];
    const lbaPairIndex = parts.length > 1 ? Number(parts[1]) : undefined;
    return {
      _id: q._id,
      lbaQuestionId,
      lbaPairIndex,
      marks: Number(q.marks),
      unitName: q.unitName,
      objective: q.objective
    };
  }
  generateAIQuestionsPool() {
    let payload = this.getTemplatePayload();
    const aiHeadings = this.selectedHeadings.flatMap(heading => heading.aiVariants);
    if (!aiHeadings.length) return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([]);
    const headingByTypeAndMarks = new Map(aiHeadings.map(heading => [`${heading.key}:${Number(heading.marksPerQuestion)}`, heading]));
    payload.template = aiHeadings.map(heading => ({
      type: heading.key,
      marksPerQuestion: heading.marksPerQuestion,
      questionDistribution: []
    }));
    payload.isPreview = true;
    return this.questionBankService.generateQuestionBankBluePrint(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_18__.switchMap)(bpRes => {
      payload.template = bpRes.data;
      return this.questionBankService.generateQuestionBank(payload);
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(finalRes => {
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
    const primaryChapterId = validChapterIds.length > 0 ? validChapterIds[0] : null;
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
    } else if (primaryChapterId) {
      subTopicsPayload = [primaryChapterId]; // Fallback to Chapter ID
    }

    return {
      board: formVal.board,
      medium: formVal.medium,
      language: formVal.language,
      grade: String(formVal.grade),
      subject: subjectName,
      totalMarks: Number(formVal.totalMarks),
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
  generateSummaryBlueprint(questions) {
    return questions.map(q => ({
      topic: q.unitName,
      questionType: q.heading,
      objective: q.objective,
      marks: Number(q.marks),
      source: q.source
    }));
  }
  fetchLBAQuestionsPool() {
    const config = this.questionBankConfigForm.value;
    const norm = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rawVal = config.chapter;
    const selectedTitles = Array.isArray(rawVal) ? rawVal : [rawVal];
    // Filter by topic name string (since dropdown binds 'topics' name)
    // Filter by topic name string (since dropdown binds 'topics' name)
    const selectedChapters = this.lbaChapters.filter(ch => selectedTitles.some(t => norm(t) === norm(ch.title) || norm(ch.title).includes(norm(t))));
    const selectedChapterNumbers = selectedChapters.map(ch => ch.chapterNumber);
    const selectedChapterIds = selectedChapters.map(ch => ch._id);
    const selectedLBAHeadings = Array.from(new Set(this.selectedHeadings.flatMap(h => h.lbaHeadings || [])));
    if (!selectedLBAHeadings.length) return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([]);
    const params = {
      subject: config.subject,
      medium: config.medium,
      class: config.grade,
      chapterNumbers: selectedChapterNumbers.join(','),
      chapterIds: selectedChapterIds.join(','),
      headings: selectedLBAHeadings.join(','),
      targetLanguage: config.language
    };
    console.log('[Frontend] getLBAQuestions params:', params);
    return this.questionBankService.getLBAQuestions(params).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(docs => {
      console.log('[Frontend] getLBAQuestions response length:', docs?.length);
      return docs.map(q => ({
        ...q,
        source: src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE.LBA
      }));
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_19__.catchError)(err => {
      console.error("[QB-LOG] LBA Fetch Error:", err);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)([]);
    }));
  }
  selectQuestion(q) {
    if (this.selectedQuestions.find(existing => existing._id === q._id)) {
      this.utilityservice.showWarning('Question already added');
      return;
    }
    this.selectedQuestions.push(q);
    this.calculateTotal();
  }
  removeQuestion(index) {
    this.selectedQuestions.splice(index, 1);
    this.calculateTotal();
  }
  calculateTotal() {
    this.currentTotalMarks = this.selectedQuestions.reduce((sum, q) => sum + Number(q.marks), 0);
    this.selectedQuestionsCount = this.selectedQuestions.length;
    this.selectedQuestionsMarks = this.currentTotalMarks;
  }
  setFilter(source) {
    this.filterSource = source;
    this.applyFilters();
  }
  onSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }
  applyFilters() {
    this.filteredQuestions = this.allAvailableQuestions.filter(q => {
      const matchesSource = this.filterSource === 'ALL' || q.source === this.filterSource;
      const matchesSearch = this.questionText(q).toLowerCase().includes(this.searchQuery);
      return matchesSource && matchesSearch;
    });
  }
  get isTotalMet() {
    return this.currentTotalMarks === this.totalMarks;
  }
  toggleHeadingDropdown() {
    this.showHeadingDropdown = !this.showHeadingDropdown;
  }
  onDocumentClick(event) {
    if (!this.showHeadingDropdown) return;
    const target = event.target;
    if (target && this.headingDropdownContainer?.nativeElement.contains(target)) return;
    this.showHeadingDropdown = false;
  }
  toggleAllHeadings(event) {
    const input = event.target;
    this.selectedHeadings = input.checked ? [...this.availableHeadings] : [];
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  clearAllHeadings(e) {
    if (e) e.stopPropagation();
    this.selectedHeadings = [];
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  toggleHeading(event, heading) {
    const input = event.target;
    if (input.checked) {
      if (!this.isHeadingSelected(heading)) this.selectedHeadings.push(heading);
    } else {
      this.selectedHeadings = this.selectedHeadings.filter(h => h.selectionKey !== heading.selectionKey);
    }
    this.f.selectedHeadings.setValue(this.selectedHeadings);
  }
  isHeadingSelected(heading) {
    return this.selectedHeadings.some(h => h.selectionKey === heading.selectionKey);
  }
  isAllHeadingsSelected() {
    return this.availableHeadings.length > 0 && this.selectedHeadings.length === this.availableHeadings.length;
  }
  headingSummary() {
    if (!this.availableHeadings.length) return 'Select chapters first';
    if (!this.selectedHeadings.length) return 'Select headings';
    if (this.selectedHeadings.length === this.availableHeadings.length) return `All headings (${this.selectedHeadings.length})`;
    const names = this.selectedHeadings.map(h => h.displayName);
    return names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ');
  }
  headingDisplay(h) {
    return h.count > 0 ? `${h.displayName} (${h.count})` : h.displayName;
  }
  onLanguageChange(val) {}
  onSubtopicChange() {
    if (this.useAI) this.distributeMarks();
  }
  distributeMarks() {
    const rawTopics = this.questionBankTypeValue === 'multiChapter' ? this.f.chapter.value : this.f.subTopic.value;
    const topics = Array.isArray(rawTopics) ? rawTopics : rawTopics ? [rawTopics] : [];
    if (this.totalMarks && topics.length) {
      const marksPerChapter = Math.floor(this.totalMarks / topics.length);
      const remainingMarks = this.totalMarks % topics.length;
      this.marksDistribution = topics.map((topic, index) => ({
        unitName: topic,
        marks: index === 0 ? marksPerChapter + remainingMarks : marksPerChapter,
        percentageDistribution: Math.round((index === 0 ? marksPerChapter + remainingMarks : marksPerChapter) / this.totalMarks * 100)
      }));
    } else {
      this.marksDistribution = [];
    }
    this.totalDistributedMarks = this.totalMarks;
    this.totalDistributedPercentage = 100;
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
  resetDistribution() {
    this.f.chapter.reset();
    this.f.subTopic.reset();
    this.marksDistribution = [];
    this.questionBankObjectives = [];
    this.paperQuestionTypes = [];
    this.selectedHeadings = [];
    this.availableHeadings = [];
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
  }
  backNavigation() {
    this.router.navigate(['/question-paper']);
  }
  nextStep() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }
  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
  totalTemplateMarksChange(val) {
    this.totalTemplateMarks = val;
  }
  ngOnDestroy() {
    this.idleService.resetIdler();
  }
  static {
    this.ɵfac = function QuestionBankGenerationComponent_Factory(t) {
      return new (t || QuestionBankGenerationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_20__.TranslateService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_question_bank_service__WEBPACK_IMPORTED_MODULE_5__.QuestionBankService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_21__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_6__.IdleService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_22__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: QuestionBankGenerationComponent,
      selectors: [["app-question-bank-generation"]],
      viewQuery: function QuestionBankGenerationComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵviewQuery"](_question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_3__.QuestionBankTemplateComponent, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵloadQuery"]()) && (ctx.templateComponent = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵloadQuery"]()) && (ctx.headingDropdownContainer = _t.first);
        }
      },
      hostBindings: function QuestionBankGenerationComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function QuestionBankGenerationComponent_click_HostBindingHandler($event) {
            return ctx.onDocumentClick($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresolveDocument"]);
        }
      },
      decls: 23,
      vars: 17,
      consts: [[1, "flex", "flex-col", "h-[calc(100vh-20px)]", "bg-shade-50", "p-4", "md:py-0", "md:px-2", "rounded-sm"], [1, "flex", "gap-2", "shrink-0"], ["src", "assets/icons/back-arrow.svg", "alt", "Back", 1, "cursor-pointer", 3, "click"], [1, "text-xl", "md:text-3xl", "font-bold", "text-content", "leading-[48px]"], [1, "bg-primary-30", "px-2", "py-4", "md:px-4", "rounded-t", "border", "mt-0", "md:mt-4", "shrink-0"], ["aria-label", "Generation steps", 1, "flex", "items-center", "justify-center", "relative", "space-x-2", "md:space-x-4", "list-none", "p-0", "m-0"], ["class", "flex items-center gap-2 list-none", 4, "ngFor", "ngForOf"], [1, "md:hidden", "flex", "items-start", "justify-between", "mt-2"], ["class", "font-semibold text-sm text-content w-16 text-center", 4, "ngFor", "ngForOf"], ["aria-live", "polite", "aria-atomic", "true", "id", "step-announcement", 1, "sr-only"], [1, "flex-1", "overflow-hidden", "configuration-container", "rounded-b", "bg-white", "border", "border-t-0", "relative"], [3, "ngSwitch"], ["class", "h-full overflow-y-auto pb-6", 4, "ngSwitchCase"], ["class", "h-full w-full overflow-y-auto md:overflow-hidden", 4, "ngSwitchCase"], ["class", "h-full overflow-y-auto p-0 bg-white", 4, "ngSwitchCase"], [1, "shrink-0", "flex", "justify-end", "items-center", "gap-2", "mt-4", "py-4", "md:p-4", "bg-white", "border-t", "z-10", "shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"], ["class", "btn-outline-primary px-6 py-2 rounded-lg font-bold", 3, "click", 4, "ngIf"], ["class", "btn-primary px-8 py-2 rounded-lg font-bold shadow-md", 3, "click", 4, "ngIf"], ["class", "btn-primary px-8 py-2 rounded-lg font-bold shadow-md", 3, "disabled", "click", 4, "ngIf"], [1, "flex", "items-center", "gap-2", "list-none"], ["aria-hidden", "true", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "border-2", "transition-all", "duration-300", 3, "ngClass"], [1, "hidden", "lg:block", "font-semibold", "text-content"], ["class", "flex-1 h-1 ml-1 transition-all duration-300 w-[24vw] md:w-[21vw]", 3, "ngClass", 4, "ngIf"], [1, "flex-1", "h-1", "ml-1", "transition-all", "duration-300", "w-[24vw]", "md:w-[21vw]", 3, "ngClass"], [1, "font-semibold", "text-sm", "text-content", "w-16", "text-center"], [1, "h-full", "overflow-y-auto", "pb-6"], [1, "px-4", "md:px-8", "mt-4"], [1, "text-base", "md:text-xl", "font-bold", "text-content"], [1, "text-content", "rounded"], [3, "formGroup"], [1, "bg-white", "rounded-lg", "p-3", "md:p-8"], [1, "grid", "lg:grid-cols-4", "gap-4"], [3, "dropDownControlName", "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], [1, "source-field"], [1, "form-control-label", "inline-flex", "items-center", "gap-1"], [1, "text-[16px]", "text-error"], ["tabindex", "0", "aria-describedby", "source-help-tooltip", 1, "relative", "z-10", "group", "cursor-help", 3, "focus", "blur", "click"], ["src", "assets/icons/info-primary.svg", "alt", "", 1, "inline-block", "w-4", "h-4"], ["id", "source-help-tooltip", "role", "tooltip", 1, "grid", "pointer-events-none", "opacity-0", "group-hover:opacity-100", "group-focus:opacity-100", "absolute", "top-5", "left-0", "z-50", "w-72", "gap-1", "rounded", "border", "border-content-30", "bg-white", "p-3", "text-xs", "font-normal", "leading-snug", "text-content-60", "shadow-md"], [4, "ngFor", "ngForOf"], [1, "grid", "lg:grid-cols-2", "gap-4", "mt-7"], [1, "form-control-label"], ["type", "text", "formControlName", "examinationName", 1, "form-control", "h-9", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], ["type", "text", "oninput", "this.value=this.value.replace(/[^0-9]/g, '').slice(0, 3)", "maxlength", "3", "formControlName", "totalMarks", 1, "form-control", "h-9", 3, "placeholder"], [1, "form-control-label", "font-bold"], [1, "text-error"], [1, "flex", "gap-4", "items-center", "mt-2"], ["class", "flex items-center", 4, "ngFor", "ngForOf"], [1, "grid", "lg:grid-cols-2", "gap-4", "mt-7", "items-start"], [4, "ngIf"], ["class", "relative", 4, "ngIf", "ngIfElse"], ["noHeads", ""], ["class", "mt-8 pt-4 border-t", 4, "ngIf"], [1, "text-content"], [1, "form-control-error"], [1, "flex", "items-center"], ["type", "radio", 1, "w-4", "h-4", "cursor-pointer", 3, "ngModel", "ngModelOptions", "id", "value", "ngModelChange", "change"], [1, "ms-2", "text-sm", "cursor-pointer", 3, "for"], ["class", "w-full", 4, "ngIf"], [1, "w-full"], [1, "form-control-label", "font-bold", "mb-2", "block", "text-gray-400", "select-none"], [1, "w-full", "px-4", "text-left", "border", "border-gray-200", "rounded-lg", "flex", "items-center", "justify-between", "bg-gray-50", "h-[45px]", "transition-colors", "hover:bg-gray-100"], [1, "flex", "items-center", "gap-2", "overflow-hidden"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-4", "w-4", "text-gray-400", "shrink-0"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "text-sm", "text-gray-500", "italic", "truncate"], [1, "hidden", "sm:inline-block", "text-[10px]", "font-bold", "text-gray-400", "uppercase", "tracking-wider", "bg-white", "px-2", "py-0.5", "rounded", "border", "border-gray-200", "shadow-sm"], [1, "relative"], ["headingDropdownContainer", ""], ["type", "button", 1, "form-control", "h-9", "text-left", "flex", "justify-between", "items-center", "hover:border-primary", "transition-colors", "focus:ring-1", "focus:ring-primary", 3, "click"], [1, "truncate", "text-sm"], ["src", "assets/icons/down-arrow.svg", "alt", "", 1, "w-3", "h-3"], ["class", "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 max-h-52 overflow-y-auto", 4, "ngIf"], [1, "absolute", "top-full", "left-0", "right-0", "mt-1", "bg-white", "border", "border-gray-300", "rounded", "shadow-lg", "z-20", "max-h-52", "overflow-y-auto"], [1, "flex", "items-center", "p-3", "hover:bg-gray-50", "border-b", "cursor-pointer", "font-semibold", "text-sm"], ["type", "checkbox", 1, "mr-2", "w-4", "h-4", "text-primary", "rounded", "focus:ring-primary", 3, "checked", "change"], ["class", "flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b text-sm", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "p-3", "hover:bg-gray-50", "cursor-pointer", "border-b", "text-sm"], [1, "form-control", "h-9", "text-center", "text-gray-400", "text-sm", "flex", "items-center", "justify-center"], [1, "mt-8", "pt-4", "border-t"], [1, "text-base", "font-bold", "text-content", "mb-3"], [1, "overflow-x-auto"], [1, "table-auto", "w-full", "text-content", "border", 3, "ngClass"], [1, "text-xs", "text-content", "bg-blue-50"], ["class", "px-4 py-2 border text-center font-bold", 4, "ngFor", "ngForOf"], ["class", "p-2 border", 4, "ngFor", "ngForOf"], ["class", "text-error", 4, "ngIf"], [1, "px-4", "py-2", "border", "text-center", "font-bold"], [1, "p-2", "border"], ["type", "text", "placeholder", "%", 1, "w-full", "text-center", "border-none", "p-2", "focus:ring-0", "text-sm", 3, "ngModel", "ngModelOptions", "ngModelChange"], [1, "min-w-full", "table-auto", "border", "border-collapse", 3, "ngClass"], [1, "bg-blue-50", "text-xs", "uppercase"], [1, "p-3", "border", "text-left"], [1, "p-3", "border", "text-center", "w-32"], [1, "p-3", "border", "text-center", "w-24"], ["class", "hover:bg-gray-50", 4, "ngFor", "ngForOf"], [1, "bg-gray-50", "font-bold"], [1, "p-3", "border", "text-right"], [1, "p-3", "border", "text-center", 3, "ngClass"], [1, "p-3", "border", "text-center"], [1, "hover:bg-gray-50"], [1, "p-3", "border", "text-sm", "font-medium"], [1, "p-3", "border"], ["type", "text", 1, "w-full", "text-center", "border-none", "p-1", "focus:ring-0", 3, "ngModel", "ngModelOptions", "ngModelChange"], [1, "p-3", "border", "text-center", "text-sm", "text-gray-500"], [1, "h-full", "w-full", "overflow-y-auto", "md:overflow-hidden"], [3, "currentStep", "totalMarks", "availableQuestions", "preSelectedQuestions", "subject", "selectionChange", "backClick", 4, "ngIf"], [3, "currentStep", "totalMarks", "availableQuestions", "preSelectedQuestions", "subject", "selectionChange", "backClick"], [1, "h-full", "overflow-y-auto", "p-0", "bg-white"], [3, "finalSelectedQuestions", "examName", "totalMarks", "selectedQuestionsMarks", "backClick", "generateClick"], ["class", "text-center p-5", 4, "ngIf"], [1, "text-center", "p-5"], [1, "btn", "btn-primary", 3, "click"], [1, "btn-outline-primary", "px-6", "py-2", "rounded-lg", "font-bold", 3, "click"], [1, "btn-primary", "px-8", "py-2", "rounded-lg", "font-bold", "shadow-md", 3, "click"], [1, "btn-primary", "px-8", "py-2", "rounded-lg", "font-bold", "shadow-md", 3, "disabled", "click"]],
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
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 4)(7, "ol", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, QuestionBankGenerationComponent_li_8_Template, 6, 10, "li", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, QuestionBankGenerationComponent_p_10_Template, 2, 1, "p", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](14, 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, QuestionBankGenerationComponent_div_15_Template, 74, 71, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](16, QuestionBankGenerationComponent_div_16_Template, 2, 2, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](17, QuestionBankGenerationComponent_div_17_Template, 3, 6, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, QuestionBankGenerationComponent_button_19_Template, 2, 0, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](20, QuestionBankGenerationComponent_button_20_Template, 2, 0, "button", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, QuestionBankGenerationComponent_button_21_Template, 2, 0, "button", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](22, QuestionBankGenerationComponent_button_22_Template, 3, 4, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 14, "Question Paper Generation"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](16, _c4).constructor(ctx.totalSteps));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.stepNames);
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
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep > 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep === 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep === 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.currentStep === 3);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_23__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_23__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_23__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_23__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_23__.NgSwitchCase, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.RadioControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControlName, _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_7__.FormDropdownComponent, _question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_3__.QuestionBankTemplateComponent, _question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_8__.QuestionBankBluePrintComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_20__.TranslatePipe],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJxdWVzdGlvbi1iYW5rLWdlbmVyYXRpb24uY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1nZW5lcmF0aW9uL3F1ZXN0aW9uLWJhbmstZ2VuZXJhdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNExBQTRMIiwic291cmNlUm9vdCI6IiJ9 */"],
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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/question-bank-display.util */ 63837);
/* harmony import */ var src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/math-render.util */ 30084);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ 90852);







const _c0 = ["questionSelectionContent"];
function QuestionBankTemplateComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_20_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r7.toggleFilterMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function QuestionBankTemplateComponent_div_21_div_7_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_div_7_button_6_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const s_r13 = restoredCtx.$implicit;
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r14.setFilter(s_r13));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r13 = ctx.$implicit;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r12.filterSource === s_r13 ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", s_r13, " ");
  }
}
function QuestionBankTemplateComponent_div_21_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 41)(1, "label", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Source");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 43)(4, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_div_7_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r17);
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r16.setFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, " All ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, QuestionBankTemplateComponent_div_21_div_7_button_6_Template, 2, 2, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r9.filterSource === "ALL" ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r9.availableSources);
  }
}
function QuestionBankTemplateComponent_div_21_div_8_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_div_8_button_6_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r21);
      const d_r19 = restoredCtx.$implicit;
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r20.setDifficultyFilter(d_r19));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const d_r19 = ctx.$implicit;
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r18.filterDifficulty === d_r19 ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](d_r19);
  }
}
function QuestionBankTemplateComponent_div_21_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 41)(1, "label", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Difficulty");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 43)(4, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_div_8_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r23);
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r22.setDifficultyFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, " All ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, QuestionBankTemplateComponent_div_21_div_8_button_6_Template, 3, 2, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r10.filterDifficulty === "ALL" ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r10.availableDifficulties);
  }
}
function QuestionBankTemplateComponent_div_21_div_9_img_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 51);
  }
}
function QuestionBankTemplateComponent_div_21_div_9_button_8_img_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 51);
  }
}
function QuestionBankTemplateComponent_div_21_div_9_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_div_9_button_8_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r29);
      const head_r26 = restoredCtx.$implicit;
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r28.setTypeFilter(head_r26));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, QuestionBankTemplateComponent_div_21_div_9_button_8_img_3_Template, 1, 0, "img", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const head_r26 = ctx.$implicit;
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r25.filterQuestionType === head_r26 ? "bg-primary-5 text-primary font-bold" : "hover:bg-gray-50 text-gray-600");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](head_r26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r25.filterQuestionType === head_r26);
  }
}
function QuestionBankTemplateComponent_div_21_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 41)(1, "label", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Question Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 47)(4, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_div_9_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r31);
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r30.setTypeFilter("ALL"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "All Types");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, QuestionBankTemplateComponent_div_21_div_9_img_7_Template, 1, 0, "img", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, QuestionBankTemplateComponent_div_21_div_9_button_8_Template, 4, 3, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r11.filterQuestionType === "ALL" ? "bg-primary-5 text-primary font-bold" : "hover:bg-gray-50 text-gray-600");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r11.filterQuestionType === "ALL");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r11.availableHeadings);
  }
}
function QuestionBankTemplateComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 35)(1, "div", 36)(2, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Refine Results");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "button", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_21_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r33);
      const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      ctx_r32.resetFilters();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r32.toggleFilterMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Clear All");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, QuestionBankTemplateComponent_div_21_div_7_Template, 7, 2, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, QuestionBankTemplateComponent_div_21_div_8_Template, 7, 2, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, QuestionBankTemplateComponent_div_21_div_9_Template, 9, 3, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.availableSources.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.availableDifficulties.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.availableHeadings.length);
  }
}
function QuestionBankTemplateComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " No questions found. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function QuestionBankTemplateComponent_div_29_img_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("alt", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](1, 2, "Contains image"))("title", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 4, "Contains image"));
  }
}
function QuestionBankTemplateComponent_div_29_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const q_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, q_r34.heading), " ");
  }
}
function QuestionBankTemplateComponent_div_29_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const q_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r37.getDifficultyColor(q_r34.difficulty));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 2, q_r34.difficulty), " ");
  }
}
const _c1 = function (a0, a1) {
  return {
    "border-l-blue-500": a0,
    "border-l-green-500": a1
  };
};
const _c2 = function (a0, a1) {
  return {
    "bg-blue-100 text-blue-700": a0,
    "bg-green-100 text-green-700": a1
  };
};
function QuestionBankTemplateComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_29_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r41);
      const q_r34 = restoredCtx.$implicit;
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r40.selectQuestion(q_r34));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 55)(2, "p", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, QuestionBankTemplateComponent_div_29_img_5_Template, 3, 6, "img", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, QuestionBankTemplateComponent_div_29_span_6_Template, 3, 3, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, QuestionBankTemplateComponent_div_29_span_7_Template, 3, 4, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "span", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const q_r34 = ctx.$implicit;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](10, _c1, q_r34.source === ctx_r4.QUESTION_SOURCE.AI, q_r34.source === ctx_r4.QUESTION_SOURCE.LBA));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r4.questionText(q_r34));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r4.hasQuestionImage(q_r34));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", q_r34.heading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", q_r34.difficulty);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](13, _c2, q_r34.source === ctx_r4.QUESTION_SOURCE.AI, q_r34.source === ctx_r4.QUESTION_SOURCE.LBA));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](10, 8, q_r34.source), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", ctx_r4.formatMarks(q_r34.marks), " Marks");
  }
}
function QuestionBankTemplateComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Click questions on the left to add them here. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function QuestionBankTemplateComponent_div_41_img_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("alt", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](1, 2, "Contains image"))("title", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 4, "Contains image"));
  }
}
function QuestionBankTemplateComponent_div_41_span_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const q_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, q_r42.heading), " ");
  }
}
function QuestionBankTemplateComponent_div_41_span_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const q_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r46.getDifficultyColor(q_r42.difficulty));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 2, q_r42.difficulty), " ");
  }
}
function QuestionBankTemplateComponent_div_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 67)(1, "button", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_div_41_Template_button_click_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r50);
      const i_r43 = restoredCtx.index;
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r49.removeQuestion(i_r43));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 69)(4, "p", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, QuestionBankTemplateComponent_div_41_img_7_Template, 3, 6, "img", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, QuestionBankTemplateComponent_div_41_span_8_Template, 3, 3, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, QuestionBankTemplateComponent_div_41_span_9_Template, 3, 4, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const q_r42 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r6.questionText(q_r42));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r6.hasQuestionImage(q_r42));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", q_r42.heading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", q_r42.difficulty);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](9, _c2, q_r42.source === ctx_r6.QUESTION_SOURCE.AI, q_r42.source === ctx_r6.QUESTION_SOURCE.LBA));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](12, 7, q_r42.source), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", ctx_r6.formatMarks(q_r42.marks), "M");
  }
}
class QuestionBankTemplateComponent {
  constructor() {
    this.currentStep = 2;
    this.totalMarks = 0; // Target marks
    // NEW INPUT: The merged pool from Parent
    this.availableQuestions = [];
    // Pre-selected questions passed from the parent to restore selections
    this.preSelectedQuestions = [];
    this.subject = '';
    this.backClick = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.nextClick = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter(); // Emits final selected questions
    this.selectionChange = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    // Pre-selected questions from parent (e.g. when navigating back to Step 2)
    // Local State
    this.filteredQuestions = [];
    this.selectedQuestions = [];
    // Filter State
    this.filterSource = 'ALL';
    this.filterDifficulty = 'ALL';
    this.filterQuestionType = 'ALL';
    this.searchText = '';
    this.isFilterMenuOpen = false;
    this.availableHeadings = [];
    this.availableSources = [];
    this.availableDifficulties = [];
    this.QUESTION_SOURCE = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.QUESTION_SOURCE;
    this.formatMarks = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.formatMarks;
    this.hasQuestionImage = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.hasQuestionImage;
    this.questionText = src_app_shared_utility_question_bank_display_util__WEBPACK_IMPORTED_MODULE_1__.questionText;
  }
  ngOnInit() {
    // Initialize from pre-selected questions if any
    if (this.preSelectedQuestions && this.preSelectedQuestions.length > 0) {
      this.selectedQuestions = [...this.preSelectedQuestions];
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
    this.availableQuestions.forEach(q => {
      if (q.heading) headings.add(q.heading);
      if (q.source) sources.add(q.source);
      if (q.difficulty) difficulties.add(q.difficulty);
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
  setTypeFilter(type) {
    this.filterQuestionType = type;
    this.applyFilters();
  }
  resetFilters() {
    this.filterSource = 'ALL';
    this.filterDifficulty = 'ALL';
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
      // 3. Question Type Filter
      const matchType = this.filterQuestionType === 'ALL' || q.heading === this.filterQuestionType;
      // 4. Search Filter
      const matchSearch = !this.searchText || this.questionText(q).toLowerCase().includes(this.searchText.toLowerCase());
      // 5. Exclude already selected
      const isSelected = this.selectedQuestions.some(sq => sq._id === q._id);
      return matchSource && matchDifficulty && matchType && matchSearch && !isSelected;
    });
    if (this.questionSelectionContent) (0,src_app_shared_utility_math_render_util__WEBPACK_IMPORTED_MODULE_2__.renderTexMath)(this.questionSelectionContent.nativeElement);
  }
  onSearch(val) {
    this.searchText = val.target.value;
    this.applyFilters();
  }
  // --- SELECTION LOGIC ---
  selectQuestion(q) {
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
  // --- ACTIONS ---
  previousStep() {
    this.backClick.emit(true);
  }
  proceedToNext() {
    // We send the selected questions to the parent (Step 3)
    this.nextClick.emit(this.selectedQuestions);
  }
  getDifficultyColor(difficulty) {
    if (!difficulty) return 'bg-gray-100 text-gray-700 border-gray-200';
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
  static {
    this.ɵfac = function QuestionBankTemplateComponent_Factory(t) {
      return new (t || QuestionBankTemplateComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: QuestionBankTemplateComponent,
      selectors: [["app-question-bank-template"]],
      viewQuery: function QuestionBankTemplateComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.questionSelectionContent = _t.first);
        }
      },
      inputs: {
        currentStep: "currentStep",
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
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵNgOnChangesFeature"]],
      decls: 43,
      vars: 13,
      consts: [[1, "px-4", "md:px-8", "mt-4"], [1, "flex", "items-center", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer", 3, "click"], [1, "text-base", "md:text-xl", "font-bold", "text-content"], [1, "text-sm", "md:text-base", "text-gray-500"], [1, "font-bold"], [1, "p-4", "md:p-8", "flex", "flex-col", "md:flex-row", "gap-6", "md:h-[70vh]"], ["questionSelectionContent", ""], [1, "w-full", "md:flex-1", "min-h-[20rem]", "bg-white", "border", "rounded-lg", "flex", "flex-col", "shadow-sm", "overflow-visible", "md:overflow-hidden"], [1, "p-3", "border-b", "bg-white", "flex", "flex-wrap", "items-center", "gap-3", "relative"], [1, "sm:relative"], [1, "flex", "items-center", "gap-2", "px-3", "py-1.5", "rounded-lg", "border", "border-gray-200", "hover:border-primary", "active:bg-gray-50", "transition-all", "shadow-sm", "bg-white", 3, "click"], ["src", "assets/icons/ri--filter-line.svg", "alt", "Filter", 1, "w-4", "h-4", 2, "filter", "invert(1)"], [1, "text-sm", "font-semibold", "text-gray-700"], ["src", "assets/icons/down-arrow.svg", "alt", "", 1, "w-2.5", "h-2.5", "opacity-50", "transition-transform", 2, "filter", "invert(1)"], ["class", "fixed inset-0 z-20", 3, "click", 4, "ngIf"], ["class", "absolute top-full left-0 right-0 mt-2 w-auto bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-4 animate-in fade-in slide-in-from-top-1 duration-200 sm:left-0 sm:right-auto sm:w-72", 4, "ngIf"], [1, "relative", "group", "w-full", "sm:flex-1"], ["src", "assets/icons/search.svg", "alt", "", 1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "w-4", "h-4", "opacity-40", "group-focus-within:opacity-70", "transition-opacity"], ["type", "text", "placeholder", "Search questions...", 1, "w-full", "pl-9", "pr-4", "py-1.5", "text-sm", "border", "border-gray-200", "rounded-lg", "outline-none", "focus:border-primary", "focus:ring-1", "focus:ring-primary/20", "bg-white", "shadow-sm", "transition-all", 3, "value", "input"], [1, "font-bold", "text-gray-400", "text-xs", "uppercase", "tracking-widest", "ml-auto", "hidden", "sm:block"], [1, "p-2", "space-y-2", "bg-gray-50/50", "md:flex-1", "md:overflow-y-auto"], ["class", "text-center py-10 text-gray-400 text-sm", 4, "ngIf"], ["class", "bg-white p-3 rounded border hover:shadow-md cursor-pointer transition-all border-l-4 group", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "w-full", "md:flex-1", "min-h-[20rem]", "bg-white", "border", "rounded-lg", "flex", "flex-col", "shadow-sm", "overflow-hidden", "relative"], [1, "p-3", "border-b", "bg-gray-50", "flex", "flex-wrap", "justify-between", "items-center", "gap-2"], [1, "font-bold", "text-gray-700"], [1, "text-sm"], [1, "font-bold", 3, "ngClass"], [1, "text-gray-500"], [1, "p-2", "space-y-2", "md:flex-1", "md:overflow-y-auto"], ["class", "text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded m-4", 4, "ngIf"], ["class", "bg-white p-3 rounded border relative", 4, "ngFor", "ngForOf"], [1, "p-3", "border-t", "bg-gray-50", "flex", "justify-between", "items-center"], [1, "fixed", "inset-0", "z-20", 3, "click"], [1, "absolute", "top-full", "left-0", "right-0", "mt-2", "w-auto", "bg-white", "border", "border-gray-200", "rounded-xl", "shadow-xl", "z-30", "p-4", "animate-in", "fade-in", "slide-in-from-top-1", "duration-200", "sm:left-0", "sm:right-auto", "sm:w-72"], [1, "flex", "justify-between", "items-center", "mb-4", "pb-2", "border-b"], [1, "font-bold", "text-gray-800"], [1, "text-xs", "text-primary", "font-bold", "hover:underline", 3, "click"], [1, "space-y-4", "max-h-[50vh]", "overflow-y-auto", "pr-1", "custom-scrollbar"], ["class", "space-y-2", 4, "ngIf"], [1, "space-y-2"], [1, "text-[10px]", "font-bold", "text-gray-400", "uppercase", "tracking-widest"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "px-2.5", "py-1", "text-xs", "rounded-full", "border", "transition-all", 3, "ngClass", "click"], ["class", "px-2.5 py-1 text-xs rounded-full border transition-all", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "capitalize"], [1, "flex", "flex-col", "gap-1"], [1, "flex", "items-center", "justify-between", "px-2", "py-1.5", "text-xs", "rounded-lg", "transition-all", "text-left", 3, "ngClass", "click"], ["src", "assets/icons/check.svg", "class", "w-3 h-3", 4, "ngIf"], ["class", "flex items-center justify-between px-2 py-1.5 text-xs rounded-lg transition-all text-left", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], ["src", "assets/icons/check.svg", 1, "w-3", "h-3"], [1, "truncate"], [1, "text-center", "py-10", "text-gray-400", "text-sm"], [1, "bg-white", "p-3", "rounded", "border", "hover:shadow-md", "cursor-pointer", "transition-all", "border-l-4", "group", 3, "ngClass", "click"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:justify-between", "sm:items-start", "mb-1"], [1, "text-sm", "text-gray-800", "line-clamp-3", "group-hover:text-primary", "flex-1", "sm:mr-2"], [1, "flex", "flex-wrap", "items-center", "gap-1", "sm:justify-end"], ["src", "assets/icons/image.svg", "class", "w-4 h-4 text-gray-500", 3, "alt", "title", 4, "ngIf"], ["class", "text-[10px] font-bold px-1 rounded uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200", 4, "ngIf"], ["class", "text-[10px] font-bold px-1 rounded uppercase tracking-wider border", 3, "ngClass", 4, "ngIf"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", "tracking-wider", 3, "ngClass"], [1, "text-xs", "font-bold", "text-gray-600"], ["src", "assets/icons/image.svg", 1, "w-4", "h-4", "text-gray-500", 3, "alt", "title"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", "tracking-wider", "bg-purple-100", "text-purple-700", "border", "border-purple-200"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", "tracking-wider", "border", 3, "ngClass"], [1, "text-center", "py-10", "text-gray-400", "text-sm", "border-2", "border-dashed", "rounded", "m-4"], [1, "bg-white", "p-3", "rounded", "border", "relative"], [1, "absolute", "top-2", "right-2", "text-gray-300", "hover:text-red-500", "font-bold", "text-xl", "leading-none", 3, "click"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:justify-between", "sm:items-start", "mb-1", "pr-6"], [1, "text-sm", "text-gray-800", "flex-1", "sm:mr-2"], [1, "text-[10px]", "font-bold", "px-1", "rounded", "uppercase", 3, "ngClass"]],
      template: function QuestionBankTemplateComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_Template_img_click_2_listener() {
            return ctx.previousStep();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h2", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Step 2/3: Select Questions");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, " Mix and match questions from AI and Pre-generated questions to build your paper. Target: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, ". ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 6, 7)(12, "div", 8)(13, "div", 9)(14, "div", 10)(15, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function QuestionBankTemplateComponent_Template_button_click_15_listener() {
            return ctx.toggleFilterMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "img", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "span", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "Filters");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](19, "img", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](20, QuestionBankTemplateComponent_div_20_Template, 1, 0, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](21, QuestionBankTemplateComponent_div_21_Template, 10, 3, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "img", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "input", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("input", function QuestionBankTemplateComponent_Template_input_input_24_listener($event) {
            return ctx.onSearch($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "h3", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Pool");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](28, QuestionBankTemplateComponent_div_28_Template, 2, 0, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, QuestionBankTemplateComponent_div_29_Template, 13, 16, "div", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "div", 24)(31, "div", 25)(32, "h3", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Selected Questions");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "div", 27)(35, "span", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](37, "span", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "div", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](40, QuestionBankTemplateComponent_div_40_Template, 2, 0, "div", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](41, QuestionBankTemplateComponent_div_41_Template, 15, 12, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](42, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", ctx.formatMarks(ctx.totalMarks), " Marks");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("rotate-180", ctx.isFilterMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isFilterMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isFilterMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.searchText);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.filteredQuestions.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.filteredQuestions);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx.isTotalMet ? "text-green-600" : "text-primary");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.formatMarks(ctx.currentTotalMarks));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" / ", ctx.formatMarks(ctx.totalMarks), " Marks");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.selectedQuestions.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.selectedQuestions);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslatePipe],
      styles: [".animate-in[_ngcontent-%COMP%] {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n}\n\n@keyframes _ngcontent-%COMP%_fadeInSlideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.fade-in.slide-in-from-top-1[_ngcontent-%COMP%] {\n  animation-name: _ngcontent-%COMP%_fadeInSlideDown;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXN0aW9uLWJhbmstdGVtcGxhdGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDRSx3QkFBQTtFQUNBLHlCQUFBO0FBQUY7O0FBR0E7RUFDRTtJQUNFLFVBQUE7SUFDQSwyQkFBQTtFQUFGO0VBRUE7SUFDRSxVQUFBO0lBQ0Esd0JBQUE7RUFBRjtBQUNGO0FBR0E7RUFDRSwrQkFBQTtBQURGIiwiZmlsZSI6InF1ZXN0aW9uLWJhbmstdGVtcGxhdGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGYWRlIGluIHNsaWRlIGRvd24gYW5pbWF0aW9uXG4uYW5pbWF0ZS1pbiB7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcbn1cblxuQGtleWZyYW1lcyBmYWRlSW5TbGlkZURvd24ge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KTtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbn1cblxuLmZhZGUtaW4uc2xpZGUtaW4tZnJvbS10b3AtMSB7XG4gIGFuaW1hdGlvbi1uYW1lOiBmYWRlSW5TbGlkZURvd247XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3F1ZXN0aW9uLWJhbmsvcXVlc3Rpb24tYmFuay1nZW5lcmF0aW9uL3F1ZXN0aW9uLWJhbmstdGVtcGxhdGUvcXVlc3Rpb24tYmFuay10ZW1wbGF0ZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLHdCQUFBO0VBQ0EseUJBQUE7QUFBRjs7QUFHQTtFQUNFO0lBQ0UsVUFBQTtJQUNBLDJCQUFBO0VBQUY7RUFFQTtJQUNFLFVBQUE7SUFDQSx3QkFBQTtFQUFGO0FBQ0Y7QUFHQTtFQUNFLCtCQUFBO0FBREY7QUFDQSw0M0JBQTQzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZhZGUgaW4gc2xpZGUgZG93biBhbmltYXRpb25cbi5hbmltYXRlLWluIHtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xufVxuXG5Aa2V5ZnJhbWVzIGZhZGVJblNsaWRlRG93biB7XG4gIGZyb20ge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04cHgpO1xuICB9XG4gIHRvIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxufVxuXG4uZmFkZS1pbi5zbGlkZS1pbi1mcm9tLXRvcC0xIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGZhZGVJblNsaWRlRG93bjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
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
/* harmony import */ var _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/components/common-dropdown/common-dropdown.component */ 48033);
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
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 27)(13, "h3", 28);
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
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "h4", 41);
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
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42)(1, "div", 43)(2, "app-common-dropdown", 44, 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_common_dropdown_valueUpdate_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r14.onBoardChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 43)(5, "app-common-dropdown", 44, 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_common_dropdown_valueUpdate_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r16.onMediumChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 43)(8, "app-common-dropdown", 44, 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_common_dropdown_valueUpdate_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r17.onClassChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 43)(11, "app-common-dropdown", 44, 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function QuestionBankListComponent_ng_template_30_Template_app_common_dropdown_valueUpdate_11_listener($event) {
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
      height: 'auto',
      bindLabel: 'board',
      bindValue: 'board',
      labelTxt: 'Board'
    };
    this.mediumDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Medium',
      height: 'auto',
      bindLabel: 'medium',
      bindValue: 'medium',
      labelTxt: 'Medium'
    };
    this.classDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Class',
      height: 'auto',
      bindLabel: 'class',
      bindValue: 'class',
      labelTxt: 'Class'
    };
    this.subjectDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Subject',
      height: 'auto',
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
    const loggedUSer = this.utilityService.loggedInUserData;
    this.boardDropdownOptions = this.utilityService.formatResponse(loggedUSer.classes);
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
      this.classDropdownOptions = classFilter[0].classes?.sort((a, b) => a.class - b.class);
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
    this.router.navigate([`/question-paper/view/${id}`]);
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
      consts: [[1, "p-8", "bg-white", "rounded-sm", "min-h-[90vh]"], [1, "flex", "justify-between", "items-center"], [1, "text-xl", "md:text-3xl", "font-bold", "text-content", "main-heading", "leading-[48px]"], [1, "rounded-lg", "border", "border-primary", "relative", "bg-[#E5EDF67D]", "text-sm", "md:text-[16px]", "p-4", "md:p-6", "mt-5", "text-content-100", "flex", "items-center", "gap-4", "md:gap-2"], ["src", "assets/icons/lesson-info.svg", "alt", "", 1, "align-text-top"], [1, "flex", "flex-col", "md:flex-row", "gap-2", "justify-between", "items-center", "mt-4"], [1, "flex", "flex-col", "md:flex-row", "gap-2", "w-full", "md:w-auto"], ["routerLink", "/question-paper/generate", 1, "btn-primary", "flex", "gap-2", "items-center", "justify-center", "md:justify-start", "w-full", "md:w-fit", "border", "border-primary"], ["src", "assets/icons/edit_light.svg", "alt", ""], [1, "text-sm", "md:text-base"], [1, "relative", "w-full", "md:w-72"], ["type", "text", 1, "appearance-none", "rounded", "pl-8", "px-3", "text-content", "leading-tight", "focus:outline-none", "w-full", "border", "border-[#ccc]", "h-9", 3, "ngModel", "placeholder", "ngModelChange", "input"], ["src", "assets/icons/Search (1).svg", "alt", "", 1, "absolute", "left-2", "top-1/2", "transform", "-translate-y-1/2", "w-5", "h-5"], [1, "right_boxes", "w-full", "md:w-auto", "mt-2", "border", "rounded-lg", "p-4", "bg-primary-30"], [4, "ngTemplateOutlet"], ["aria-label", "Question Papers"], ["aria-live", "polite", "aria-atomic", "true", 1, "sr-only"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4", "mt-5"], ["class", "card px-6 py-8 rounded-xl bg-white border flex flex-col justify-between", 4, "ngFor", "ngForOf"], ["class", "flex items-center justify-center", 4, "ngIf"], ["elementGroup", ""], [1, "card", "px-6", "py-8", "rounded-xl", "bg-white", "border", "flex", "flex-col", "justify-between"], [1, "flex", "justify-between"], [1, "icon", "flex", "justify-center", "items-center", "bg-purple-100"], ["src", "assets/icons/question-paper.svg", "alt", ""], [1, "flex", "flex-col", "items-end"], [1, "text-xs", "font-normal", "text-content-70"], [1, "mt-5"], [1, "text-sm", "font-medium"], [1, "flex", "items-center", "justify-start", "my-2"], [1, "px-2", "py-1", "rounded-full", "text-primary", "bg-[#F1F4FD]", "text-[11px]", "inline-block", "me-2"], [1, "px-2", "py-1", "rounded-full", "text-[#DE3B40]", "bg-[#FDF2F2]", "text-[11px]", "inline-block"], [1, "mt-2", "text-xs", "font-normal", "text-content-70"], [4, "ngFor", "ngForOf"], [1, "mt-7", "w-full", "py-2", "rounded", "bg-tertiary", 3, "click"], [1, "text-white", "text-sm", "font-semibold"], [1, "subtopic-chip", "px-2", "py-1", "my-1", "rounded-full", "text-[#3D8248]", "bg-[#F1FDF3]", "text-[11px]", "me-2", "inline-block"], [1, "flex", "items-center", "justify-center"], [1, "px-6", "py-8", "rounded-xl", "w-[460px]", "h-[300px]", "bg-white", "border", "flex", "flex-col", "items-center"], [1, "rounded-full", "bg-warn-50", "p-4", "my-8"], ["src", "assets/icons/no-file.svg", "alt", ""], [1, "text-base", "text-center", "font-medium"], [1, "flex", "gap-4", "md:gap-1", "flex-wrap"], [1, "w-full", "md:w-28", "cursor-pointer", "md:flex-1"], [3, "dropDownValues", "config", "valueUpdate"], ["boardDropDown", ""], ["mediumDropDown", ""], ["classDropDown", ""], ["subjectDropDown", ""]],
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
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.CommonDropdownComponent, _angular_common__WEBPACK_IMPORTED_MODULE_8__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslatePipe],
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
  component: _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_0__.QuestionBankListComponent
}, {
  path: 'generate',
  component: _question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_1__.QuestionBankGenerationComponent
}, {
  path: 'view/:id',
  component: _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__.QuestionBankViewComponent
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
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 2, "Answer"), ":");
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
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx_r18.contentItems(questionData_r19.question));
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
    this.router.navigate(['/question-paper']);
  }
  submitFeedback() {
    const questionBankId = this.questionBankDetails?.questionBank?._id;
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
      consts: [[1, "rounded-sm", "bg-shade-50", "p-5"], [1, "flex", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer", 3, "click"], [1, "text-lg", "md:text-xl", "font-bold", "text-content", "leading-[48px]"], [1, "max-w-full", "mx-auto", "py-4"], [1, "space-y-4"], [1, "bg-white", "shadow-md", "rounded-lg"], [1, "w-full", "text-left", "px-4", "py-2", "text-white", "text-sm", "bg-primary", "rounded-sm", 3, "click"], [1, "flex", "items-center", "justify-between"], ["alt", "", 3, "src"], ["class", "p-4 overflow-x-auto", 4, "ngIf"], [1, "grid", "gap-8", "mt-4", "grid-cols-1", "md:grid-cols-3"], [1, "w-full", "md:col-span-2"], [1, "flex", "justify-center", "mb-4"], [1, "flex", "items-center", "gap-2", "px-6", "py-2", "rounded-lg", "font-semibold", "transition-all", 3, "ngClass", "click"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], ["tabindex", "0", "role", "region", 1, "question-bank-container", "p-4", "md:px-12", "rounded-md", "border", "h-[88vh]", "bg-white", "overflow-y-auto"], ["questionPaperContent", ""], [1, "text-center", "text-base", "font-bold", "text-content"], [1, "text-center", "text-sm", "mt-1", "font-bold", "text-content"], [1, "flex", "justify-between", "my-4"], ["class", "mt-5", 4, "ngFor", "ngForOf"], [1, "p-4", "bg-white", "border", "rounded-lg"], [1, "font-semibold", "text-content", "mb-2"], [1, "mt-3", "gap-4", "flex", "text-[14px]", "flex-col"], [1, "font-semibold", "text-content"], [4, "ngFor", "ngForOf"], ["rows", "3", 1, "p-2", "mt-2", "border", "rounded-sm", "w-fullfocus:outline-none", "w-full", 3, "disabled", "ngModel", "placeholder", "ngModelChange"], ["type", "button", "class", "btn-primary w-full", 3, "disabled", "click", 4, "ngIf"], [1, "font-semibold", "text-content", "mt-4"], [1, "p-4", "overflow-x-auto"], [1, "min-w-full", "table-auto", "border-collapse"], [1, "border", "px-2", "py-2"], [1, "flex", "justify-end"], ["class", "mr-4 mt-2", 4, "ngIf"], [1, "border", "px-2", "py-2", "capitalize", "text-sm"], [1, "border", "px-2", "py-2", "text-sm"], [1, "mr-4", "mt-2"], [1, "mt-5"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "font-bold", "text-content"], [1, "text-content", "flex", "items-center", "justify-end", "gap-1", "min-w-[15vw]", "md:min-w-[7vw]"], [4, "ngIf"], [1, "flex", "justify-between", "items-start", "mt-2", "gap-2"], [1, "text-content"], ["class", "list-alpha", 4, "ngIf"], ["class", "mt-1 mb-3 ml-4 px-3 py-2 bg-green-50 border border-green-200 rounded-md", 4, "ngIf"], ["class", "mt-2 max-h-64 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-2", "max-h-64", "max-w-full", 3, "src"], [1, "list-alpha"], ["class", "mt-1 max-h-32 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-1", "max-h-32", "max-w-full", 3, "src"], [1, "mt-1", "mb-3", "ml-4", "px-3", "py-2", "bg-green-50", "border", "border-green-200", "rounded-md"], [1, "text-xs", "font-bold", "text-green-700", "uppercase", "tracking-wider"], [1, "ml-2", "text-sm", "text-green-800", "font-medium"], ["class", "mt-2 mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-md", 4, "ngIf"], [1, "mt-2", "mb-3", "px-3", "py-2", "bg-green-50", "border", "border-green-200", "rounded-md"], [1, "text-xs", "font-bold", "text-green-700", "uppercase", "tracking-wider", "mb-1"], [1, "border", "border-green-200", "px-2", "py-1", "text-xs", "text-green-700", "bg-green-100"], [1, "border", "border-green-200", "px-2", "py-1", "text-sm", "text-green-800"], [1, "border", "border-green-200", "px-2", "py-1", "text-sm", "text-green-800", "font-medium"], ["class", "mt-1 max-h-24 max-w-full", 3, "src", 4, "ngIf"], [1, "mt-1", "max-h-24", "max-w-full", 3, "src"], ["type", "radio", 1, "mt-[3px]", "md:mt-0", 3, "disabled", "id", "name", "value", "ngModel", "ngModelChange"], [1, "ms-1", 3, "for"], ["type", "button", 1, "btn-primary", "w-full", 3, "disabled", "click"], [1, "flex", "bg-primary-50", "p-4", "rounded", "items-center", "mt-2"], [1, "flex", "items-center", "justify-center", "bg-primary", "p-2", "rounded-full"], ["src", "assets/icons/white-docx.svg", "alt", "", 1, "w-10"], [1, "ml-4", "w-full"], [1, "text-content", "text-sm", "font-semibold"], [1, "btn-outline-primary", "mt-2", "w-full", "h-8", "text-xs", "hover:text-white", "hover:bg-primary", "transition-all", "font-semibold", 3, "click"]],
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
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx.questionBankDetails == null ? null : ctx.questionBankDetails.questionBank == null ? null : ctx.questionBankDetails.questionBank.metadata.schoolName, " ");
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
/* harmony import */ var _question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./question-bank-generation/question-bank-generation.component */ 96090);
/* harmony import */ var _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./question-bank-list/question-bank-list.component */ 90762);
/* harmony import */ var _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./question-bank-view/question-bank-view.component */ 48540);
/* harmony import */ var _question_bank_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./question-bank-routing.module */ 78596);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ng2-charts */ 57839);
/* harmony import */ var _question_bank_generation_question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./question-bank-generation/question-bank-template/question-bank-template.component */ 50261);
/* harmony import */ var _question_bank_generation_question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./question-bank-generation/question-bank-blue-print/question-bank-blue-print.component */ 67589);
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
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.ReactiveFormsModule, _question_bank_routing_module__WEBPACK_IMPORTED_MODULE_3__.questionBankRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__.CommonDropdownComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, ng2_charts__WEBPACK_IMPORTED_MODULE_13__.NgChartsModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](QuestionBankModule, {
    declarations: [_question_bank_generation_question_bank_generation_component__WEBPACK_IMPORTED_MODULE_0__.QuestionBankGenerationComponent, _question_bank_generation_question_bank_template_question_bank_template_component__WEBPACK_IMPORTED_MODULE_7__.QuestionBankTemplateComponent, _question_bank_generation_question_bank_blue_print_question_bank_blue_print_component__WEBPACK_IMPORTED_MODULE_8__.QuestionBankBluePrintComponent, _question_bank_list_question_bank_list_component__WEBPACK_IMPORTED_MODULE_1__.QuestionBankListComponent, _question_bank_view_question_bank_view_component__WEBPACK_IMPORTED_MODULE_2__.QuestionBankViewComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.ReactiveFormsModule, _question_bank_routing_module__WEBPACK_IMPORTED_MODULE_3__.questionBankRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__.CommonDropdownComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, ng2_charts__WEBPACK_IMPORTED_MODULE_13__.NgChartsModule]
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
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('page', '1').set('limit', '999');
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
  /**
   * Function to generate question bank blue print
   * @param data
   * @returns
   */
  generateQuestionBankBluePrint(data) {
    return this.http.post(`${this.getUrl()}generate-blue-print`, data, {
      context: new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpContext().set(src_app_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_1__.LOADER_MESSAGE, 'Generating blueprint...')
    });
  }
  /**
   * Function to generate question bank
   * @param data
   * @returns
   */
  generateQuestionBank(data) {
    return this.http.post(`${this.getUrl()}generate`, data, {
      context: new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpContext().set(src_app_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_1__.LOADER_MESSAGE, data.isPreview ? 'Generating questions...' : 'Creating question paper...')
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
//# sourceMappingURL=src_app_view_user_question-bank_question-bank_module_ts.4b2f5d60f03b3842.js.map
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionBankService } from '../question-bank.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { slideInOutAnimation } from 'src/app/shared/utility/animations.util';
import { IdleService } from 'src/app/shared/services/idle.service';
import { QuestionBankDownloadService } from 'src/app/shared/services/question-bank-download.service';
import { BluePrintExportService } from 'src/app/shared/services/blue-print.export.service';
import { formatMarks } from 'src/app/shared/utility/constant.util';
@Component({
  selector: 'app-question-bank-view',
  templateUrl: './question-bank-view.component.html',
  styleUrls: ['./question-bank-view.component.scss'],
  animations: [slideInOutAnimation],
})
export class QuestionBankViewComponent implements OnInit {
  questionBankId: any;

  questionBankDetails: any;

  questionBank: any;

  isOpen = false;

  questionBankFeedbackQuestion =
    'Do you feel that the questions in this paper are relevant to your specified configuration and requirements?';

  questionBankFeedback = {
    feedback: '',
    overallFeedback: '',
  };

  questionBankFeedbackValues = [
    { name: 'Strongly Disagree', symbol: '😠' },
    { name: 'Disagree', symbol: '😕' },
    { name: 'Neutral', symbol: '😐' },
    { name: 'Agree', symbol: '🙂' },
    { name: 'Strongly Agree', symbol: '😃' },
  ];

  shuffledColumns: string[] = [];

  primaryColumn: string[] = [];

  questionBankBluePrintData: any;

  showAnswerKeys: boolean = false;
  questionTypeLabels: Record<string, string> = {};
  generatedTotalMarks = 0;
  readonly formatMarks = formatMarks;

  docTypes = [
    {
      name: 'Question Paper',
      type: 'qp'
    },
    {
      name: 'Blueprint',
      type: 'bp'
    },
    {
      name: 'Question paper + Answer Key',
      type: 'ak'
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private questionBankService: QuestionBankService,
    public utilityService: UtilityService,
    private router: Router,
    private idleService: IdleService,
    private questionBankDownloadService: QuestionBankDownloadService,
    private bluePrintExportService: BluePrintExportService
  ) {
    this.route.params.subscribe((params) => {
      this.questionBankId = params['id'];
    });
  }

  ngOnInit(): void {
    this.getQuestionBankDetails();
  }

  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }

  getQuestionBankDetails() {
    this.questionBankService
      .getQuestionBankDetails(this.questionBankId)
      .subscribe({
        next: (val: any) => {
          this.questionBankDetails = val.data;
          this.questionBank = this.questionBankDetails.questionBank
          this.generatedTotalMarks = this.questionBank.questions.reduce((sum: number, section: any) => (
            sum + Number(section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0)
          ), 0);
          this.questionBankService.getPaperConfig({
            board: this.questionBankDetails.board,
            grade: String(this.questionBankDetails.grade),
            subjectName: this.questionBankDetails.subject
          }).subscribe((config: any) => {
            this.questionTypeLabels = Object.fromEntries(config.questionTypes.map((type: any) => [type.key, type.label]));
          });

          if (this.questionBank.questions.length) {
            this.questionBank.questions.forEach((section: any) => {
              if (section.type === 'MATCHING' && section.questions?.length) {
                const colTwoVal = section.questions.map((ele: any) => ele.value2);
                section.primaryColumn = section.questions.map((ele: any) => ele.value1);
                section.originalColumns = [...colTwoVal];
                section.shuffledColumns = this.utilityService.shuffleOptions(colTwoVal);
              }
            });
          }

          if (this.questionBankDetails?.questionBank?.feedback) {
            this.questionBankFeedback =
              this.questionBankDetails?.questionBank?.feedback;
          }
          this.idleService.planId = this.questionBankDetails?.questionBank?._id;
          this.questionBankBluePrintData = this.flattenQuestionData(val.data.bluePrintTemplate);
        },
        error: (err) => {
          this.utilityService.handleError(err);
        },
      });
  }

  flattenQuestionData(data: any[]) {
    const result: any[] = [];
    data.forEach(section => {
      const { type, marksPerQuestion, questionDistribution } = section;

      questionDistribution.forEach((entry: any) => {
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

  isTextContent(item: any): boolean {
    return item.contentType === 'text/plain';
  }

  mediaSrc(item: any): string {
    return `data:${item.contentType};base64,${item.content}`;
  }

  download(type: any) {
    if (type === 'qp') {
      this.downloadQp()
    } else if (type === 'ak') {
      this.downloadAnswerKey()
    } else {
      this.downloadBluePrint()
    }
  }

  downloadQp() {
    this.questionBankDownloadService.downloadQuestionBank({ ...this.questionBankDetails, questionTypeLabels: this.questionTypeLabels });
    this.utilityService.showSuccess('Question paper downloaded successfully!');
  }

  downloadAnswerKey() {
    this.questionBankDownloadService.downloadAnswerKey({ ...this.questionBankDetails, questionTypeLabels: this.questionTypeLabels });
    this.utilityService.showSuccess('Answer key downloaded successfully!');
  }

  toggleAnswerKeys() {
    this.showAnswerKeys = !this.showAnswerKeys;
  }

  downloadBluePrint() {
    const metaData = {
      schoolName: this.questionBankDetails?.questionBank?.metadata?.schoolName,
      medium: this.questionBankDetails?.medium,
      class: this.questionBankDetails?.grade,
      subject: this.questionBankDetails?.subject,
      examinationName: this.questionBankDetails?.examinationName,
      totalMarks: this.questionBankDetails?.totalMarks
    }
    this.bluePrintExportService.exportToWord(this.questionBankBluePrintData.map((item: any) => ({
      ...item,
      type: this.questionTypeLabels[item.type] || item.type,
    })), metaData)
  }

  backNavigation() {
    this.router.navigate(['/user/question-paper']);
  }

  submitFeedback() {
    const questionBankId = this.questionBankDetails?.questionBank?._id;
    const feedback = {
      question: this.questionBankFeedbackQuestion,
      ...this.questionBankFeedback,
    };
    this.questionBankService
      .updateQuestionBankFeedback(questionBankId, feedback)
      .subscribe({
        next: (res) => {
          this.utilityService.handleResponse(res);
          this.getQuestionBankDetails();
        },
        error: (err) => {
          this.utilityService.handleError(err);
        },
      });
  }
}

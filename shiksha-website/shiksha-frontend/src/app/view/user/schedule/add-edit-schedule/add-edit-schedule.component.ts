import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ScheduleService } from '../schedule.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { getLabel } from 'src/app/shared/utility/constant.util';
import { DatePipe } from '@angular/common';
import { forkJoin, Subject, Subscription, takeUntil } from 'rxjs';

const ALL_SUB_TOPICS = 'All Sub-Topics';

@Component({
  selector: 'app-add-edit-schedule',
  templateUrl: './add-edit-schedule.component.html',
  styleUrls: ['./add-edit-schedule.component.scss'],
  providers: [DatePipe],
})
export class AddEditScheduleComponent
  implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  private previousActiveElement: HTMLElement | null = null;
  private readonly destroy$ = new Subject<void>();
  /** cancels the previous in-flight lesson-plans request so a slower stale response can't overwrite a newer one */
  private lessonPlansRequest?: Subscription;
  /** suppresses the per-step lesson-plan refresh while the initial cascade auto-selects single-option filters */
  private initializing = false;

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closePopUP();
  }

  @Input() cordinate: any;
  @Input() formData: any;
  @Input() cellData: any;
  @Input() mode!: string;
  /** lesson plan pre-selected via the "Schedule this" button on the Lesson Plan page */
  @Input() prefillLessonPlan: any;

  /** collapsed by default — Board/Medium/Class/Subject/Chapter/Sub Topic are optional filters, not required fields */
  filtersOpen = false;
  @Output() close = new EventEmitter<string>();
  @ViewChild('pop_ele', { static: true }) pop_ele!: ElementRef<any>;
  scheduleForm!: FormGroup;
  editableItem: any;
  classArray: any;
  submitted: boolean = false;
  schoolID!: any;
  teacherId!: string;
  lessonPlanID!: string;
  currentDate= new Date();
  lessonPlanName!: string;

  // dropdown configarations
  boardDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select the Board',
    fieldName: 'Board',
    hideLabel: false,
    bindLabel: 'board',
    bindValue: 'board',
    required: false
  };

  mediumDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select the Medium',
    fieldName: 'Medium',
    hideLabel: false,
    bindLabel: 'medium',
    bindValue: 'medium',
    required: false
  };

  classNameDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Class',
    fieldName: 'Class Name',
    hideLabel: false,
    bindLabel: 'class',
    bindValue: 'class',
    required: false
  };

  subjectDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Subject',
    fieldName: 'Subject',
    hideLabel: false,
    bindLabel: 'displayName',
    bindValue: 'subject',
    required: false
  };

  chapterDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select the Chapter',
    fieldName: 'Chapter',
    hideLabel: false,
    bindLabel: 'displayValue',
    bindValue: 'topics',
    required: false
  };

  subTopicDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select the SubTopic',
    fieldName: 'Sub Topic',
    hideLabel: false,
    bindLabel: 'label',
    bindValue: 'label',
    required: false
  };

  lessonDropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select the Lesson Plan',
    fieldName: 'Lesson Plan',
    bindLabel: 'name',
    bindValue: 'name',
    searchable: true,
    required: true
  };

  boardDropdownValue: any[] = [];

  mediumDropdownValue: any[] = [];

  classDropDownValues: any[] = [];

  subjectDropdownValue: any[] = [];

  chapterDropdownValue: any[] = [];

  subTopicDropDownValue: any[] = [];

  lessonPlanDropDownValue: any[] = [];

  //finding the viewport width and height
  vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  /**
   * building the formbuilder
   * @param fb
   */
  constructor(
    private fb: FormBuilder,
    private service: ScheduleService,
    private utility: UtilityService
  ) {
    this.scheduleForm = this.fb.group({
      board: [null],
      medium: [null],
      className: [null],
      otherClass: [''],
      subject: [null],
      chapter: [null],
      subTopic: [null],
      lessonPlan: [null, Validators.required],
      schedule: this.fb.array([]),
    });
  }

  phrase(canonicalPhrase: string): string {
    return getLabel(canonicalPhrase, canonicalPhrase, { state: this.utility.loggedInUserData?.school?.state });
  }

  /**
   * set the form data based on the event datay
   * @param changes
   */
  ngOnInit(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    const userData = localStorage.getItem('userData'); //user data for teacher id and school id
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.schoolID = parsedUserData.school;
    }
    if (this.formData) {
      forkJoin({
        schoolInfo: this.service.getSchoolInfoByID(),
        schedule: this.service.getScheduleById(this.formData.event.id),
      }).subscribe({
        next: (results: any) => {
          this.teacherId = results.schedule.data.teacherId;
          this.editableItem = results.schedule;
          this.lessonPlanID = this.editableItem.data.lesson._id;

          if (this.mode !== 'view') {
            this.classArray = this.utility.formatResponse(results.schoolInfo.data.user.profiles.teacher.classes);
            this.boardDropdownValue = this.classArray;
            this.filterMediumByBoard(this.editableItem.data.board,this.classArray);
            this.filterClassByMedium(
              this.editableItem.data.medium,
              this.mediumDropdownValue
            );
            this.filterSubjectByClass(
              this.editableItem.data.class,
              this.classDropDownValues
            );
            this.loadChapterSubtopicAndLesson();
          } else {
            this.viewFormSetUp();
          }
        },
        error: (err: any) => {
          this.utility.handleError(err);
        },
      });
    }
  }

  /**
   * adjust the modal according  to the cordinate value
   */
  ngAfterViewInit(): void {
    this.setElementCoordinates(this.pop_ele.nativeElement);
  }

  /**
 * align the pop up item near to the clicked event
 */
  setElementCoordinates(nativeElement: any): void {
    if (this.pop_ele) {
        nativeElement.style.left = `${
          this.cordinate.rect.left - nativeElement.offsetWidth - 10
        }px`;

      //  checking top is touching or not
      if (this.cordinate.rect.top - nativeElement.offsetHeight - 100 < 0) {
        nativeElement.style.top = `${this.cordinate.rect.bottom}px`;
      }

      // checking bottom is touching or not
      if (
        this.cordinate.rect.bottom + nativeElement.offsetHeight + 100 >
        this.vh
      ) {
          nativeElement.style.top = `${
            this.cordinate.rect.top - nativeElement.offsetHeight - 50
          }px`;
      }

      // checking left is touching or not
        if (this.cordinate.rect.left - (nativeElement.offsetWidth + 254)  < 0) {
        nativeElement.style.left = `${this.cordinate.rect.right}px`;
      }

      // checking right is touching or not
      if (this.cordinate.rect.right + nativeElement.offsetWidth > this.vw) {
          nativeElement.style.left = `${
            this.cordinate.rect.left - nativeElement.offsetWidth
          }px`;
      }

      // checking whether both top and bottom are touching or not
      if (
        this.cordinate.rect.top - nativeElement.offsetHeight - 100 < 0 &&
        this.cordinate.rect.bottom + nativeElement.offsetHeight + 100 > this.vh
      ) {
        nativeElement.style.top = '50%';
        nativeElement.style.transform = 'translateY(-50%)';
      }

      // checking whether both right and left touching or not
      if (
        this.cordinate.rect.left - nativeElement.offsetWidth < 0 &&
        this.cordinate.rect.right + nativeElement.offsetWidth > this.vw
      ) {
        nativeElement.style.left = `${this.cordinate.rect.right / 2}px`;
      }
    }
  }

  /**
   * for view disable the form and for add add new dateTime form and set the board arrray value
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === 'view') {
      this.scheduleForm.disable();
    }
    if (this.mode === 'add') {
      this.addNewScheduleInfo();
      if(this.cellData){
        this.getScheduleControls().controls[0].patchValue({
          date:this.cellData.date,
          fromTime:this.cellData.time,
          toTime:this.cellData.EndHour

        });
      }




      this.service.getSchoolInfoByID().pipe(takeUntil(this.destroy$)).subscribe({
        next: (val: any) => {
          this.teacherId = val.data.user._id;
          // the cascade auto-selects single-option filters and resets 'lessonPlan' as it goes;
          // its refreshes are suppressed so they can't race the selection made right after
          this.initializing = true;
          try {
            this.setBoardDropdownValue(val.data.user.profiles.teacher.classes);
          } finally {
            this.initializing = false;
          }

          if (this.prefillLessonPlan) {
            this.lessonPlanDropDownValue = [this.prefillLessonPlan];
            this.scheduleForm.get('lessonPlan')?.setValue(this.prefillLessonPlan.name);
            this.onLessonPlanSelected(this.prefillLessonPlan);
          } else {
            this.refreshLessonPlansForFilters(true);
          }
        },
        error: (err: any) => {
          this.utility.handleError(err);
        },
      });
    }
  }

  mapLessonListItem(item: any) {
    const lesson = item.lesson || {};
    return {
      name: lesson.name,
      lessonId: lesson._id,
      class: lesson.class,
      subject: lesson.subject,
      board: lesson.chapter?.board,
      medium: lesson.chapter?.medium,
      topic: lesson.chapter?.topics,
      subTopic: Array.isArray(lesson.subTopics) ? lesson.subTopics.join(' | ') : lesson.subTopics,
      isAll: lesson.isAll,
      updatedAt: item.updatedAt,
    };
  }


  // =============== ADD FLOW ==========
  setBoardDropdownValue(classes: any[]) {
    this.classArray = this.utility.formatResponse(classes);
    this.boardDropdownValue = this.classArray;
    if (this.boardDropdownValue.length === 1) {
      this.scheduleForm.get('board')?.setValue(this.boardDropdownValue[0].board);
      this.setMediumDropdownArray(this.boardDropdownValue[0]);
    }
  }

  /**
   * called when board values changes , reset the all the formfiled except board and set the medium dropdown values
   * @param value
   */
  setMediumDropdownArray(value: any) {
    this.resetBoardChanges();
    if (value) {
      this.mediumDropdownValue = value.mediums;
      if (this.mediumDropdownValue.length === 1) {
        this.scheduleForm
          .get('medium')
          ?.setValue(this.mediumDropdownValue[0].medium);
        this.setClassDropdownValue(this.mediumDropdownValue[0]);
      }
    }
    this.refreshLessonPlansForFilters();
  }


  /**
   * resetting the class and below formfiled and set the classDropdown array value
   * @param value
   */
  setClassDropdownValue(value: any) {
    this.resetMediumChanges();
    if (value) {
      this.classDropDownValues = value.classes.sort((a:any,b:any)=>a.class-b.class);
      if (this.classDropDownValues.length === 1) {
        this.scheduleForm
          .get('className')
          ?.setValue(this.classDropDownValues[0].class);
        this.setSubjectValue(this.classDropDownValues[0]);
      }
    }
    this.refreshLessonPlansForFilters();
  }


  /**
   * when the class values changes , setting the subject value based on class, resetting chapter and subtopic
   * @param value
   */
  setSubjectValue(value: any) {
    this.resetClassChanges();
    if (value) {
      this.subjectDropdownValue = this.utility.formatSubjectDropdown(value.data, this.scheduleForm.get('board')?.value);
      if (this.subjectDropdownValue.length === 1) {
        this.scheduleForm
          .get('subject')
          ?.setValue(this.subjectDropdownValue[0].subject);
        this.setChapterValues(this.subjectDropdownValue[0]);
      }
    }
    this.refreshLessonPlansForFilters();
  }

  /**
   * call the api to set the chapter dropdown value
   */
  setChapterValues(value: any) {
    this.resetSubjectChanges();
    this.loadChapterDropdown(value);
    this.refreshLessonPlansForFilters();
  }

  /**
   * re-fetches the recent-plans list narrowed to whichever board/medium/class/subject
   * filters are currently selected, so the Lesson Plan picker stays in sync as the
   * filter panel narrows — with none selected this returns the unfiltered recent list
   */
  private refreshLessonPlansForFilters(autoSelectMostRecent = false) {
    if (this.initializing) {
      return;
    }
    this.lessonPlansRequest?.unsubscribe();
    const filters = {
      board: this.scheduleForm.get('board')?.value,
      medium: this.scheduleForm.get('medium')?.value,
      class: this.scheduleForm.get('className')?.value,
      subject: this.scheduleForm.get('subject')?.value,
    };
    this.lessonPlansRequest = this.service.getRecentLessonPlans(filters).pipe(takeUntil(this.destroy$)).subscribe({
      next: (val: any) => {
        this.lessonPlanDropDownValue = (val.data || []).map((item: any) =>
          this.mapLessonListItem(item)
        );
        const currentName = this.scheduleForm.get('lessonPlan')?.value;
        if (!currentName) {
          if (autoSelectMostRecent && this.lessonPlanDropDownValue.length) {
            const mostRecent = this.lessonPlanDropDownValue[0];
            this.scheduleForm.get('lessonPlan')?.setValue(mostRecent.name);
            this.onLessonPlanSelected(mostRecent);
          }
          return;
        }
        if (!this.lessonPlanDropDownValue.some(p => p.name === currentName)) {
          this.scheduleForm.get('lessonPlan')?.reset();
          this.lessonPlanID = '';
        }
      },
      error: (err: any) => {
        this.utility.handleError(err);
      },
    });
  }

  /**
   * fetches the chapter dropdown, without resetting downstream fields — used by the prefill
   * path, which has already set 'lessonPlan' and must not wipe it out
   */
  private loadChapterDropdown(value: any) {
    if (value) {
      const body = {
        board: this.scheduleForm.get('board')?.value,
        medium: this.scheduleForm.get('medium')?.value,
        standard: this.scheduleForm.get('className')?.value,
        subject: this.scheduleForm.get('subject')?.value,
      };
      this.service.getAllChapter(body).pipe(takeUntil(this.destroy$)).subscribe({
        next: (val: any) => {
          this.chapterDropdownValue = this.utility.formatChapterDropdown(
            val.data.results
          );
        },
        error: (err: any) => {
          this.utility.handleError(err);
        },
      });
    }
  }


  /**
   * if value is present it will define the value for the subTopicDropdown Array and if value not present(clear) reset the subtopic array
   * @param val
   */
  setSubTopicValue(value:any) {
    this.resetChapterChanges();
    if(value){
      this.loadSubTopicDropdown();
    }
  }

  private loadSubTopicDropdown() {
    const body = {
      board: this.scheduleForm.get('board')?.value,
      medium: this.scheduleForm.get('medium')?.value,
      standard: this.scheduleForm.get('className')?.value,
      subject: this.scheduleForm.get('subject')?.value,
      topic: this.scheduleForm.get('chapter')?.value,
    };
    if (!body.topic) {
      return;
    }
    this.service.getAllSubTopic(body).pipe(takeUntil(this.destroy$)).subscribe({
      next: (val: any) => {
        this.setSubTopicData(val.data);
      },
      error: (err: any) => {
        this.utility.handleError(err);
      },
    });
  }


  setSubTopicData(val: any) {
    this.subTopicDropDownValue = val?.[0]?.subtopics ? this.formatSubTopics(val) : [];
  }

  formatSubTopics(val:any){
    let formateObj: {
      label: any;
      lessonList: any;
    }[] = [];
    val[0].subtopics.forEach((ele: any) => {
      let obj;
      if(ele.isAll){
        obj={
          label: ALL_SUB_TOPICS,
          lessonList:ele.lessons
        }
      }else{
        obj={
          label: ele.subtopic.join(' | '),
          lessonList:ele.lessons
        }
      }
      formateObj.push(obj);
    });
    return formateObj;
  }


  /**
   * call the lesson api using className,chapter,subtopic and set the response array to the lesson plan array
   */
  setLessonPlan(val: any) {
    this.lessonPlanDropDownValue = [];
    this.scheduleForm.get('lessonPlan')?.reset();
    this.lessonPlanID = '';
    this.lessonPlanDropDownValue = val.lessonList;
    if(this.lessonPlanDropDownValue.length === 1){
      this.scheduleForm.get('lessonPlan')?.setValue(this.lessonPlanDropDownValue[0].name);
      this.lessonPlanID = this.lessonPlanDropDownValue[0].lessonId;
    }
  }

  /**
   * called whenever a lesson plan is picked, whether from the recent-plans picker (which
   * carries board/medium/class/subject/topic/subTopic) or from the optional filters' own
   * chapter/sub-topic cascade (which only carries name/lessonId — those fields are already
   * on the form in that case, so only patch fields the picked item actually provided)
   * @param lessonValue
   */
  onLessonPlanSelected(lessonValue: any) {
    if (!lessonValue) {
      this.lessonPlanID = '';
      return;
    }
    this.lessonPlanID = lessonValue.lessonId;
    const patch: any = {};
    if (lessonValue.board != null) patch.board = lessonValue.board;
    if (lessonValue.medium != null) patch.medium = lessonValue.medium;
    if (lessonValue.class != null) patch.className = lessonValue.class;
    if (lessonValue.subject != null) patch.subject = lessonValue.subject;
    if (lessonValue.topic != null) patch.chapter = lessonValue.topic;
    // the sub-topic options label an all-sub-topics plan 'All Sub-Topics', not its joined sub-topics
    if (lessonValue.subTopic != null) patch.subTopic = lessonValue.isAll ? ALL_SUB_TOPICS : lessonValue.subTopic;
    if (Object.keys(patch).length) {
      this.scheduleForm.patchValue(patch);
    }

    this.populateDropdownsForPrefill(lessonValue);
  }

  private populateDropdownsForPrefill(lessonValue: any) {
    const boardEntry = this.boardDropdownValue?.find((b: any) => b.board === lessonValue.board);
    if (!boardEntry) {
      console.warn('[schedule] prefill: board not found in dropdown', lessonValue.board);
      this.filtersOpen = true;
      return;
    }
    this.mediumDropdownValue = boardEntry.mediums;
    const mediumEntry = boardEntry.mediums.find((m: any) => m.medium === lessonValue.medium);
    if (!mediumEntry) {
      console.warn('[schedule] prefill: medium not found', lessonValue.medium);
      this.filtersOpen = true;
      return;
    }
    this.classDropDownValues = mediumEntry.classes.sort((a: any, b: any) => a.class - b.class);
    const classEntry = this.classDropDownValues.find(
      (c: any) => String(c.class) === String(lessonValue.class)
    );
    if (!classEntry) {
      console.warn('[schedule] prefill: class not found', lessonValue.class);
      this.filtersOpen = true;
      return;
    }
    this.subjectDropdownValue = this.utility.formatSubjectDropdown(classEntry.data, lessonValue.board);
    const subjectEntry = this.subjectDropdownValue.find(
      (s: any) => String(s.subject) === String(lessonValue.subject)
    );
    if (subjectEntry && lessonValue.topic !== undefined) {
      this.loadChapterDropdown(subjectEntry);
      this.loadSubTopicDropdown();
    }
  }

  // ======== ADD FLOW END HERE ===========



  // ======== EDIT FLOW START HERE =========

  /**
   * called when edit called, filter the medium based on the board value from boardDropdownArray
   * @param val
   */
  filterMediumByBoard(val: any,dropdownValueArray:any) {
    if (val) {
      const mediumData = dropdownValueArray.filter((item: any) => {
        return item.board === val;
      });
      this.mediumDropdownValue = mediumData[0].mediums;
    }
  }

  /**
   * called when edit called, it will filter the class based on the medium value from mediumDropdown
   * @param value
   * @param dropdownValueArray
   */
  filterClassByMedium(value: string, dropdownValueArray: any) {
    const classValues = dropdownValueArray.filter((item: any) => {
      return value === item.medium;
    });
    this.classDropDownValues = classValues[0].classes.sort((a:any,b:any)=>a.class-b.class);
  }

  /**
   * called when edit called, it will filter the subject based on the class value from classDropdown Array
   * @param value
   * @param dropdownValueArray
   */
  filterSubjectByClass(value: string, dropdownValueArray: any) {
    const subjectValues = dropdownValueArray.filter((item: any) => {
      return value === item.class;
    });
    this.subjectDropdownValue = this.utility.formatSubjectDropdown(subjectValues[0].data, this.scheduleForm.get('board')?.value);
  }


  /**
   * Not Used
   * @param value 
   */
  filterSubTopicByTopic(value: any) {
    this.subTopicDropDownValue = value.subTopics;
    this.scheduleForm
      .get('lessonPlan')
      ?.setValue(this.editableItem.data.lesson.name);
  }


  /**
   * call both chapter and subtopic api to get the array and set the lesson plan and call form setUp
   */
  loadChapterSubtopicAndLesson(){
    let chapterBody = {
      board: this.editableItem.data.board,
      medium: this.editableItem.data.medium,
      standard: this.editableItem.data.class,
      subject: this.editableItem.data.subject,
    }
    let subTopicBody = {
      ...chapterBody,
      topic:this.editableItem.data.topic
    }
    forkJoin({
      chapter: this.service.getAllChapter(chapterBody),
      subTopic: this.service.getAllSubTopic(subTopicBody),
    }).subscribe({
      next:(result:any)=>{
        this.chapterDropdownValue = this.utility.formatChapterDropdown(
          result.chapter.data.results
        );
        this.setSubTopicData(result.subTopic.data);
        this.setLessonPlan(this.subTopicDropDownValue[0]);
        this.setFormValues();
      }
    })
  }

  /**
   * Not Used
  * for edit purpose setting the formInfo
  */
  editFormSetup() {
    this.setFormValues();

  }

  setFormValues() {
    this.scheduleForm.patchValue({
      board: this.editableItem.data.board,
      medium: this.editableItem.data.medium,
      className: this.editableItem.data.class,
      otherClass: this.editableItem.data.otherClass,
      subject: this.editableItem.data.subject,
      chapter: this.editableItem.data.topic,
      subTopic: this.editableItem.data.subTopic,
      lessonPlan: this.editableItem.data.lesson.name,
      schedule: this.setDateTimeValue(),
    });
  }

  // =========== EDIT FLOW END HERE =============



  // =============== VIEW FLOW HERE =============
  viewFormSetUp() {
    this.chapterDropdownValue = [];
    this.chapterDropdownValue.push({
      displayValue: `${this.editableItem?.data?.lesson?.chapter?.orderNumber}. ${this.editableItem.data.topic}`,
      topics: this.editableItem.data.topic,
    });
    this.subjectDropdownValue = [];
    const subjects = [
      {
        ...this.editableItem?.data?.lesson?.subjects,
        subject:this.editableItem?.data?.subject
      }
    ]
    if(subjects.length){
      this.subjectDropdownValue = this.utility.formatSubjectDropdown(subjects, this.editableItem?.data?.board)
    }
    this.setFormValues();
  }
  // =========== VIEW FLOW END HERE ==============



  // ========= DELETE FLOW START HERE =============

  /**
   * remove the specific formgroup of the formarray
   * @param index
   */
  deleteScheduleInfo(index: number) {
    this.getScheduleControls().removeAt(index);
  }
  // ============ DELETE FLOW END HERE ================





  /**
   * Not Used
   * this function will set the chapter dropdown value and patch the iniitial value for edit
   * @param value
   * @param body
   */
  chapterPatchValue(value: string) {
    const body = {
      board: this.editableItem.data.board,
      medium: this.editableItem.data.medium,
      standard: this.editableItem.data.class,
      subject: this.editableItem.data.subject,
    };
    this.service.getAllChapter(body).subscribe({
      next: (val: any) => {
        this.chapterDropdownValue = this.utility.formatChapterDropdown(
          val.data.results
        );
        this.editSetSubTopicValue();
      },
      error: (err: any) => {
        this.utility.handleError(err);
      },
    });
  }








  /**
   * Not Used
   */
  editSetSubTopicValue(){
    this.resetChapterChanges();

    const body = {
      board: this.scheduleForm.get('board')?.value,
      medium: this.scheduleForm.get('medium')?.value,
      standard: this.scheduleForm.get('className')?.value,
      subject: this.scheduleForm.get('subject')?.value,
      topic: this.scheduleForm.get('chapter')?.value,
    };
    this.service.getAllSubTopic(body).subscribe({
      next: (val: any) => {
        this.setSubTopicData(val.data);
        this.scheduleForm.get('subTopic')?.setValue(this.editableItem.data.subTopic);
        this.setLessonPlan(this.subTopicDropDownValue[0]);
        this.scheduleForm
          .get('lessonPlan')
          ?.setValue(this.editableItem.data.lesson.name);
      },
    });
  }



  // ========= UTILITY METHODS =========


  /**
   * add the retrieved value event to the formarray other word setting the scheduleItems
   */
  setDateTimeValue() {
    for (let scheduleItem of this.editableItem.data.scheduleDateTime) {
      this.getScheduleControls().push(this.newScheduleInfo(scheduleItem));
    }
  }

  get f(): any {
    return this.scheduleForm.controls;
  }

  /**
   * Function to convert control to form control
   * @param absCtrl
   * @returns
   */
  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    return absCtrl as FormControl;
  }

  /**
   * return the new form group with field date,startDate and endDate
   * @param data
   * @returns
   */
  newScheduleInfo(data: any = null) {
    return this.fb.group(
      {
        date: [
          this.utility.formateDate(data).date ?? null,
          [Validators.required, this.dateValidator],
        ],
        fromTime: [
          data?.fromTime ?? null,
          [Validators.required, this.startEndTimeValidator],
        ],
        toTime: [
          data?.toTime ?? null,
          [Validators.required, this.startEndTimeValidator],
        ],
      },
      {
        validator: [this.timeRangeValidator,this.pastTimeValidatory],
      }
    );
  }



  /**
   * return the formarray of the schedule
   * @returns
   */
  getScheduleControls() {
    return this.scheduleForm.get('schedule') as FormArray;
  }

  /**
   * adding new form group to the formarray
   */
  addNewScheduleInfo() {
    this.getScheduleControls().push(this.newScheduleInfo(null));
  }



  /**
   * send the details to the backend
   */
  onSave() {
    let body;
    this.submitted = true;

    if (!this.scheduleForm.valid) {
      return;
    }
    const commonBodyValue = {
      teacherId: this.teacherId,
      board: this.scheduleForm.get('board')?.value,
      medium: this.scheduleForm.get('medium')?.value,
      subject: this.scheduleForm.get('subject')?.value,
      topic: this.scheduleForm.get('chapter')?.value,
      subTopic: this.scheduleForm.get('subTopic')?.value,
      scheduleType: 'regular',
      class: +this.scheduleForm.get('className')?.value,
      otherClass: this.scheduleForm.get('otherClass')?.value,
      scheduleDateTime: this.getScheduleControls().value,
      schoolId: this.schoolID._id,
      lessonId: this.lessonPlanID,
    };
    if (this.mode === 'add') {
      this.service.createSchedule(commonBodyValue).subscribe({
        next: (response: any) => {
          this.close.emit('save');
          this.utility.showSuccess('Schedule Created Successfully');
        },
        error: (err: any) => {
          this.utility.handleError(err);
        },
      });
    } else if (this.mode === 'edit') {
      body = {
        _id: this.editableItem.data._id,
        ...commonBodyValue,
      };
      this.service.updateSchedule(body).subscribe({
        next: (response: any) => {
          this.close.emit('save');
          this.utility.showSuccess('Schedule Update Successfully');
        },
        error: (err: any) => {
          this.utility.handleError(err);
        },
      });
    }
  }

  /**
   * close the pop upon clicking save,cancel and cross mark
   */
  closePopUP() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    if (this.previousActiveElement?.isConnected) {
      this.previousActiveElement.focus();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }


  // error handling message functions for start , end and date
  /**
   *  getting errror message for the date formControl
   * @param controls
   * @returns
   */
  getDateError(controls: any) {
    if (this.submitted && controls.get('date')?.errors?.['required']) {
      return 'Date is required';
    } else {
      return this.submitted && controls.get('date')?.errors?.['inValidDate']
        ? 'Please select the current date'
        : '';
    }
  }

  /**
   * getting the error message for the fromTime Control
   * @param control
   * @returns
   */
  getStartTimeError(control: any) {
    if (this.submitted && control.get('fromTime')?.errors?.['required']) {
      return 'Start Time Required';
    }else if (this.submitted && control.errors?.['InvalidTime']){
      return 'Please choose a future time'
    }
    else {
      return this.submitted &&
        control.get('fromTime')?.touched &&
        control.get('fromTime')?.errors?.['InvalidStartDate']
        ? 'Start Time must be between 7AM to 6PM'
        : '';
    }
  }

  /**
   * getting the error message for the EndTime Control
   * @param controls
   * @returns
   */
  getEndTimeError(controls: any) {
    if (this.submitted && controls.get('toTime')?.errors?.['required']) {
      return 'End Time Required';
    } else if (
      this.submitted &&
      controls.get('toTime')?.errors?.['InvalidStartDate']
    ) {
      return 'End Time must be between 7AM to 6PM';
    } else {
      return this.submitted && controls.errors?.['lessThanStart']
        ? 'End Time must be greater than start'
        : '';
    }
  }

  // Validator for start,end and date
  startEndTimeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }
    const [hour, minute] = value.split(':').map(part => parseInt(part, 10)); // Parsing hour and minute
    // Invalid if hour is before 7, after 18, or at 18:01 or later
    if (hour < 7 || hour > 18 || (hour === 18 && minute > 0)) {
      return { InvalidStartDate: true };
    }
    return null; // Valid time
  }


  pastTimeValidatory(control:AbstractControl):ValidationErrors | null{
    const value = control.get('fromTime')?.value as string;
    const parentControl = control?.get('date')?.value;
    const selectedDate = new Date(parentControl);
    const  now = new Date();
    const todayHour = now.getHours();
    const todayMin = now.getMinutes();
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
      if(!value)
      {
      return null;
    }


    const [hour, minute] = value.split(':').map(part => parseInt(part, 10)); // Parsing hour and minute
      if(selectedDate.toString() === now.toString() && (todayHour > hour || (todayHour === hour && todayMin > minute))) {
        return {InvalidTime: true};
    }
    return null;

  }


  dateValidator(control: AbstractControl): ValidationErrors | null {
    const now = new Date();
    const selectedDate = new Date(control.value);
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (control.value && now > selectedDate) {
      return { inValidDate: true };
    }
    return null;
  }

  timeRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get('fromTime')?.value;
    const endTime = control.get('toTime')?.value;

    if (!startTime || !endTime) {
      return null;
    }
    if (startTime > endTime) {
      return { lessThanStart: true };
    }
    return null;
  }

  resetFormControls(...controls: string[]) {
    controls.forEach((controlName) => {
      const control = this.scheduleForm.get(controlName);
      if (control) {
        control.reset();
      }
      switch (controlName) {
        case 'medium':
          this.mediumDropdownValue = [];
          break;
        case 'className':
          this.classDropDownValues = [];
          break;
        case 'subject':
          this.subjectDropdownValue = [];
          break;
        case 'chapter':
          this.chapterDropdownValue = [];
          break;
        case 'subTopic':
          this.subTopicDropDownValue = [];
          break;
        case 'lessonPlan':
          this.lessonPlanDropDownValue = [];
          break;
        default:
          break;
      }
    });
  }

  resetBoardChanges() {
    this.resetFormControls(
      'medium',
      'className',
      'subject',
      'chapter',
      'subTopic',
      'lessonPlan'
    );
  }

  resetMediumChanges() {
    this.resetFormControls(
      'className',
      'subject',
      'chapter',
      'subTopic',
      'lessonPlan'
    );
  }

  resetClassChanges() {
    this.resetFormControls('subject', 'chapter', 'subTopic', 'lessonPlan');
  }

  resetSubjectChanges() {
    this.resetFormControls('chapter', 'subTopic', 'lessonPlan');
  }

  resetChapterChanges() {
    this.resetFormControls('subTopic', 'lessonPlan');
  }
}

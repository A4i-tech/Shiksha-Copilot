import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EMPTY, Subscription, catchError, map, of, switchMap } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import {
  CURATOR_HIDDEN_FIELDS,
  ContentEntityConfig,
  ContentField,
  ContentFieldType,
  ContentSelectOption,
  LessonVideo,
  getContentEntityConfig,
  localizeEntity,
} from '../content-management.config';
import { ContentManagementService, CurationChapter } from '../content-management.service';
import { ChapterPickerComponent } from '../chapter-picker/chapter-picker.component';
import { CONTENT_STATUS } from '../content-status.constants';
import { UmamiService } from 'src/app/shared/services/umami.service';
import { SectionEditorComponent } from 'src/app/shared/components/section-editor/section-editor.component';
import { blankSections, filledSections } from 'src/app/shared/utility/section-content.util';
import { ContentGenerationService } from 'src/app/view/user/content-generation/content-generation.service';
import { CURATION_URL } from 'src/app/view/curator/curation-routes';

/** the fixed A-D option row set an MCQ answer type needs, matching McqOption in question_paper.py */
const MCQ_OPTION_LABELS = ['A', 'B', 'C', 'D'];

type NewRecordFields = ({ name: string } | { lessonName: string }) & {
  subTopics: string[];
  isAll: false;
  templateId: string;
};

const WIDE_FIELD_TYPES: ContentFieldType[] = ['json', 'textarea', 'question-content', 'mcq-options', 'sections', 'videos'];

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChapterPickerComponent, DropdownComponent, TranslateModule, SectionEditorComponent],
})
export class ContentEditComponent implements OnInit, OnDestroy {
  config!: ContentEntityConfig;
  private rawConfig?: ContentEntityConfig;
  recordId = '';
  record: any = null;
  /** true when the route id is `new`, so the form adds a record */
  isCreate = false;
  isReadonly = false;
  curatorMode = false;
  chapterId = '';
  chapter?: CurationChapter;
  subTopic = '';
  private newRecordFields?: NewRecordFields;
  templatePending = false;

  /** form value of each field, as the control shows it */
  formValues: { [field: string]: any } = {};
  /** parse error of each JSON field */
  fieldErrors: { [field: string]: string } = {};

  isLoading = false;
  isSaving = false;

  /** {value, label} of every board a master subject applies to, for the chapter subject dropdown */
  subjectOptions: ContentSelectOption[] = [];

  private original: { [field: string]: any } = {};
  private subscriptions: Subscription[] = [];
  private recordLoad = Subscription.EMPTY;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contentService: ContentManagementService,
    private utilityService: UtilityService,
    private translateService: TranslateService,
    private umamiService: UmamiService,
    private contentGenerationService: ContentGenerationService
  ) {
    this.subscriptions.push(
      translateService.onLangChange.subscribe(() => {
        if (this.rawConfig) this.config = localizeEntity(this.rawConfig, this.translateService);
      })
    );
  }

  ngOnInit(): void {
    this.curatorMode = this.route.snapshot.data['curatorMode'] === true;

    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const entity = getContentEntityConfig(params.get('entity'));
        const id = params.get('id') || 'new';

        if (!entity) {
          this.router.navigate(['/content-management/chapters']);
          return;
        }

        this.rawConfig = entity;
        this.config = localizeEntity(entity, this.translateService);
        this.recordId = id;
        this.isCreate = id === 'new';
        if (this.curatorMode) this.chapterId = params.get('chapterId')!;

        if (entity.fields.some((field) => field.type === 'subject-select')) {
          this.loadSubjectOptions();
        }

        if (this.curatorMode) {
          this.loadCuratorRecord();
          return;
        }

        if (this.isCreate) {
          if (!entity.canCreate) {
            this.router.navigate(['/content-management', entity.key]);
            return;
          }

          this.record = {};
          this.fillForm({});
          return;
        }

        if (entity.key === 'chapters') this.loadCurators();
        this.loadRecord();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.recordLoad.unsubscribe();
  }

  // One option per board a subject applies to, so "Science" under two boards shows twice.
  loadSubjectOptions(): void {
    this.contentService.listSubjects().subscribe({
      next: (res: any) => {
        const subjects = res?.data?.results ?? res?.results ?? [];
        this.subjectOptions = subjects.flatMap((subject: any) =>
          (subject.boards || []).map((board: string) => ({
            value: subject._id,
            label: `${board} - ${subject.subjectName}`,
          }))
        );
      },
      error: (err: any) => this.utilityService.handleError(err),
    });
  }

  loadCurators(): void {
    this.contentService.listCurators().subscribe({ error: (err: any) => this.utilityService.handleError(err) });
  }

  loadRecord(): void {
    this.isLoading = true;

    this.contentService.getById(this.config.segment, this.recordId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.record = res?.data ?? res;
        this.isReadonly = this.record?.status !== CONTENT_STATUS.DRAFT;
        this.fillForm(this.record);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  // Records load from the list tab of the chapter status.
  private loadCuratorRecord(): void {
    this.isLoading = true;
    this.recordLoad.unsubscribe();

    const children = this.isCreate ? [] : [{ segment: this.config.segment, filters: { _id: this.recordId } }];

    this.recordLoad = this.contentService.loadCuratorChapter(this.chapterId, children).subscribe({
      next: ({ chapter, lists }) => {
        this.isLoading = false;
        const record = chapter && !this.isCreate ? lists[0][0] : {};
        if (!chapter || !record) {
          this.utilityService.showError(
            this.translateService.instant('This chapter is not available to you. Open the chapter from your dashboard, then try again.')
          );
          this.router.navigate(chapter ? ['/curation/chapters', this.chapterId] : ['/curation']);
          return;
        }
        if (this.isCreate && this.hasSubTopic) {
          const subTopic = this.route.snapshot.queryParamMap.get('subTopic');
          if (!subTopic) {
            this.router.navigate([this.selectionUrl]);
            return;
          }
          this.subTopic = subTopic;
        }
        this.chapter = chapter;
        this.record = record;
        this.isReadonly = chapter.status !== CONTENT_STATUS.DRAFT;
        if (!this.isCreate && this.hasSubTopic) this.subTopic = record.subTopics.join(' | ');
        this.fillForm(this.record);
        if (this.hasSubTopic && !record[this.sectionsField]?.length) this.loadSectionTemplate(chapter);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  private get isPlan(): boolean {
    return this.config.key === 'lesson-plans';
  }

  get hasSubTopic(): boolean {
    return this.isPlan || this.config.key === 'resources';
  }

  private get sectionsField(): string {
    return this.isPlan ? 'sections' : 'resources';
  }

  private get selectionUrl(): string {
    return this.isPlan ? CURATION_URL.lessonPlan : CURATION_URL.lessonResources;
  }

  private loadSectionTemplate(chapter: CurationChapter): void {
    this.templatePending = true;
    this.subscriptions.push(
      this.contentGenerationService
        .getSectionTemplate(chapter, this.isPlan ? 'lesson_plan' : 'lesson_resource')
        .pipe(map((template) => ({ template, sections: blankSections(template.sections) })))
        .subscribe({
          next: ({ template, sections }) => {
            this.templatePending = false;
            this.formValues[this.sectionsField] = sections;
            if (this.isCreate) this.newRecordFields = this.buildNewRecordFields(chapter, template._id);
          },
          error: (err: any) =>
            err instanceof Error ? this.utilityService.showError(err.message) : this.utilityService.handleError(err),
        })
    );
  }

  fieldType(field: ContentField): ContentFieldType {
    return (this.curatorMode && field.curatorType) || field.type;
  }

  isDropdownField(field: ContentField): boolean {
    const type = this.fieldType(field);
    return type === 'select' || type === 'subject-select';
  }

  isWideField(field: ContentField): boolean {
    return WIDE_FIELD_TYPES.includes(this.fieldType(field));
  }

  addVideo(field: ContentField): void {
    const video: LessonVideo = { title: '', url: '', selected: true };
    this.formValues[field.field].push(video);
  }

  removeVideo(field: ContentField, index: number): void {
    this.formValues[field.field].splice(index, 1);
  }

  dropdownConfig(field: ContentField): DropDownConfig {
    return {
      isBackground: false,
      placeHolderTxt: field.placeholder
        ? this.translateService.instant(field.placeholder)
        : this.translateService.instant('Pick {{field}}', { field: this.translateService.instant(field.label) }),
      labelTxt: this.translateService.instant(field.label),
      bindLabel: 'label',
      bindValue: 'value',
      required: !!(field.requiredOnCreate && this.isCreate),
    };
  }

  get visibleFields(): ContentField[] {
    return this.config.fields.filter((field) => {
      if (this.curatorMode && CURATOR_HIDDEN_FIELDS.includes(field.field)) return false;
      if (!this.isCreate && field.createOnly) return false;
      if (field.visibleWhen && !field.visibleWhen.values.includes(this.formValues[field.visibleWhen.field])) {
        return false;
      }
      return true;
    });
  }

  save(targetStatus: typeof CONTENT_STATUS.DRAFT | typeof CONTENT_STATUS.UNDER_REVIEW = CONTENT_STATUS.DRAFT): void {
    if (this.isReadonly) return;

    const body = this.isCreate
      ? this.buildCreateBody()
      : this.buildChangedBody();

    if (body && this.curatorMode && this.isCreate) Object.assign(body, { chapterId: this.chapterId }, this.newRecordFields);

    if (Object.keys(this.fieldErrors).length) {
      this.utilityService.showError(
        this.translateService.instant('Correct the fields marked with an error before you save.')
      );
      return;
    }

    if (!body) return;

    // A curator sends the whole chapter for review. The server rejects a status field on a record.
    const submitChapter = this.curatorMode && targetStatus === CONTENT_STATUS.UNDER_REVIEW;
    const unchanged = !Object.keys(body).length;

    if (unchanged && !submitChapter) {
      this.utilityService.showError(this.translateService.instant('No field has changed.'));
      return;
    }

    this.isSaving = true;

    const saved = this.isCreate
      ? this.contentService.create(this.config.segment, body, this.curatorMode).pipe(
          switchMap((res: any) => {
            if (targetStatus === CONTENT_STATUS.DRAFT || this.curatorMode) return of(res);

            const id = res?.data?.insertedIds?.[0];
            if (!id) throw new Error(this.translateService.instant('The record was created but its ID was not returned.'));

            return this.contentService.update(this.config.segment, id, {
              status: targetStatus,
            });
          })
        )
      : unchanged
        ? of(null)
        : this.contentService.update(this.config.segment, this.recordId, body, this.curatorMode);

    const request = submitChapter
      ? saved.pipe(
          switchMap(() => this.contentService.submit(this.chapterId)),
          catchError((err: any) => {
            // The record is already saved as a draft, so leave the form to avoid a duplicate on retry.
            this.utilityService.handleError(err);
            this.leave();
            return EMPTY;
          })
        )
      : saved;

    request.subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.umamiService.track('content-curated', { segment: this.config.key, action: this.isCreate ? 'create' : 'update' });
        this.utilityService.showSuccess(
          res?.message ||
            (this.isCreate
              ? `${this.config.singular} ${this.translateService.instant('added successfully')}`
              : `${this.config.singular} ${this.translateService.instant('updated successfully')}`)
        );
        this.leave();
      },
      error: (err: any) => {
        this.isSaving = false;
        // The create route validates like bulk upload, so a rejection's detail is in data.rows[0].errors, not the top-level message.
        const rowErrors = err.error?.data?.rows?.[0]?.errors;
        if (Array.isArray(rowErrors) && rowErrors.length) {
          this.utilityService.showError(rowErrors.join(' '));
          return;
        }
        this.utilityService.handleError(err);
      },
    });
  }

  private buildNewRecordFields(chapter: CurationChapter, templateId: string): NewRecordFields {
    const { subject, board, standard, topics } = chapter;
    const name = `${subject[0].subjectName}-${board} Class${standard} ${topics}`;
    return { ...(this.isPlan ? { name } : { lessonName: name }), subTopics: [this.subTopic], isAll: false, templateId };
  }

  // The backend runs the same check as the bulk upload, so this sends the values as they are.
  private buildCreateBody(): { [key: string]: any } | null {
    const body: { [key: string]: any } = {};
    const missing: string[] = [];

    this.visibleFields.forEach((field) => {
      let value: any;

      try {
        value = this.toRecordValue(field);
      } catch (err) {
        this.fieldErrors[field.field] = this.translateService.instant('This value is not valid JSON.');
        return;
      }

      const isEmpty =
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        if (field.requiredOnCreate) missing.push(this.translateService.instant(field.label));
        return;
      }

      body[field.field] = value;
    });

    if (Object.keys(this.fieldErrors).length) return null;

    if (missing.length) {
      this.utilityService.showError(
        `${this.translateService.instant('These fields need a value')}: ${missing.join(', ')}.`
      );
      return null;
    }

    return body;
  }

  cancel(): void {
    if (this.curatorMode && this.isCreate && this.hasSubTopic) this.router.navigate([this.selectionUrl]);
    else this.leave();
  }

  private leave(): void {
    this.router.navigate(
      this.curatorMode ? ['/curation/chapters', this.chapterId] : ['/content-management', this.config.key]
    );
  }

  onFieldChange(field: ContentField, value: any): void {
    this.formValues[field.field] = value;

    if (this.fieldType(field) !== 'json') {
      delete this.fieldErrors[field.field];
      return;
    }

    if (`${value}`.trim() === '') {
      delete this.fieldErrors[field.field];
      return;
    }

    try {
      JSON.parse(value);
      delete this.fieldErrors[field.field];
    } catch (err) {
      this.fieldErrors[field.field] = this.translateService.instant('This value is not valid JSON.');
    }
  }

  private fillForm(record: any): void {
    this.formValues = {};
    this.original = {};
    this.fieldErrors = {};

    // Loads every field, not just visibleFields, since answerType must be set before that getter runs.
    this.config.fields.forEach((field) => {
      const value = record?.[field.field];
      this.original[field.field] = value;
      this.formValues[field.field] = this.toControlValue(field, value);
    });
  }

  private toControlValue(field: ContentField, value: any): any {
    const type = this.fieldType(field);
    if (type === 'boolean') return value === true;

    if (type === 'sections' || type === 'videos') return structuredClone(value ?? []);

    if (value === null || value === undefined) return '';

    if (type === 'list') {
      return Array.isArray(value) ? value.join('\n') : `${value}`;
    }

    if (type === 'json') {
      return JSON.stringify(value, null, 2);
    }

    if (type === 'question-content') {
      return this.parseQuestionContent(value);
    }

    if (type === 'mcq-options') {
      return this.parseMcqOptions(value);
    }

    if (type === 'chapter-reference') {
      return { chapterNumber: value?.chapterNumber ?? '', title: value?.title ?? '' };
    }

    return `${value}`;
  }

  // Always shows the fixed A-D rows an MCQ needs, whatever came back from the server.
  private parseMcqOptions(value: any): { label: string; text: string }[] {
    const existing = Array.isArray(value) ? value : [];
    return MCQ_OPTION_LABELS.map((label, index) => {
      const item = existing[index];
      const text = typeof item === 'string' ? item : item?.text ?? '';
      return { label, text };
    });
  }

  // A question's text/answer is a plain string, or (per PR #93) a [{contentType, content}] list with an image.
  private parseQuestionContent(value: any): { text: string; image: { contentType: string; content: string } | null } {
    if (typeof value === 'string' || value == null) {
      return { text: value ?? '', image: null };
    }

    const parts = Array.isArray(value) ? value : [value];
    const text = parts
      .filter((part) => !part?.contentType || part.contentType === 'text/plain')
      .map((part) => (typeof part === 'string' ? part : part?.content ?? ''))
      .join('\n');
    const image = parts.find((part) => part?.contentType?.startsWith('image/')) ?? null;

    return { text, image: image ? { contentType: image.contentType, content: image.content } : null };
  }

  private toRecordValue(field: ContentField): any {
    const raw = this.formValues[field.field];

    switch (this.fieldType(field)) {
      case 'sections':
        return filledSections(raw);
      case 'videos': {
        delete this.fieldErrors[field.field];
        const videos = (raw as LessonVideo[]).filter((video) => video.title.trim() || video.url.trim());
        if (videos.some((video) => !video.url.trim())) {
          this.fieldErrors[field.field] = 'Add a link to every video, or remove the row.';
          return null;
        }
        return videos;
      }
      case 'boolean':
        return raw === true;
      case 'number':
        return `${raw}`.trim() === '' ? null : Number(raw);
      case 'list':
        return `${raw}`
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line !== '');
      case 'json':
        return `${raw}`.trim() === '' ? null : JSON.parse(raw);
      case 'question-content':
        return this.buildQuestionContent(raw);
      case 'mcq-options':
        return raw;
      case 'chapter-reference': {
        const chapterNumber = `${raw?.chapterNumber ?? ''}`.trim();
        const title = `${raw?.title ?? ''}`.trim();
        if (!chapterNumber && !title) return null;
        return { chapterNumber: chapterNumber ? Number(chapterNumber) : undefined, title: title || undefined };
      }
      default:
        return `${raw}`;
    }
  }

  private buildQuestionContent(raw: { text: string; image: { contentType: string; content: string } | null }): any {
    const text = (raw?.text ?? '').trim();
    const image = raw?.image ?? null;

    if (image && text) return [{ contentType: 'text/plain', content: text }, image];
    if (image) return [image];
    return text;
  }

  // The backend rejects an empty body and any field it does not own, so this sends only the changed fields.
  private buildChangedBody(): { [key: string]: any } {
    const body: { [key: string]: any } = {};

    this.visibleFields.forEach((field) => {
      if (this.fieldErrors[field.field] && this.fieldType(field) === 'json') return;

      let next: any;

      try {
        next = this.toRecordValue(field);
      } catch (err) {
        this.fieldErrors[field.field] = this.translateService.instant('This value is not valid JSON.');
        return;
      }

      if (next === null) return;

      const before = this.original[field.field];

      if (JSON.stringify(next) !== JSON.stringify(before ?? this.emptyOf(field))) {
        body[field.field] = next;
      }
    });

    return body;
  }

  // A record that never had this field must not count as changed when the control is empty.
  private emptyOf(field: ContentField): any {
    switch (this.fieldType(field)) {
      case 'boolean':
        return false;
      case 'list':
      case 'sections':
      case 'videos':
        return [];
      case 'number':
        return null;
      case 'mcq-options':
        return this.parseMcqOptions([]);
      case 'chapter-reference':
        return null;
      default:
        return '';
    }
  }

  onQuestionTextChange(field: ContentField, text: string): void {
    const current = this.formValues[field.field] ?? { text: '', image: null };
    this.formValues[field.field] = { ...current, text };
  }

  onQuestionImageRemoved(field: ContentField): void {
    const current = this.formValues[field.field] ?? { text: '', image: null };
    this.formValues[field.field] = { ...current, image: null };
  }

  async onQuestionImageSelected(field: ContentField, event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    (event.target as HTMLInputElement).value = '';
    if (file) await this.setQuestionImage(field, file);
  }

  async onQuestionContentPaste(field: ContentField, event: ClipboardEvent): Promise<void> {
    const file = Array.from(event.clipboardData?.items ?? [])
      .find((item) => item.type.startsWith('image/'))
      ?.getAsFile();
    if (!file) return;

    event.preventDefault();
    await this.setQuestionImage(field, file);
  }

  private async setQuestionImage(field: ContentField, file: File): Promise<void> {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    const [, contentType, content] = dataUrl.match(/^data:(.+);base64,(.*)$/) ?? [];
    if (!contentType || !content) return;

    const current = this.formValues[field.field] ?? { text: '', image: null };
    this.formValues[field.field] = { ...current, image: { contentType, content } };
  }

  onMcqOptionTextChange(field: ContentField, index: number, text: string): void {
    const rows = (this.formValues[field.field] ?? this.parseMcqOptions([])).slice();
    rows[index] = { ...rows[index], text };
    this.formValues[field.field] = rows;
  }

  // The chosen row's label becomes keyAnswer, e.g. "A" - McqOption.text is picked, not retyped.
  onMcqOptionCorrectChange(field: ContentField, index: number): void {
    const rows = this.formValues[field.field] ?? this.parseMcqOptions([]);
    this.formValues['keyAnswer'] = { text: rows[index]?.label ?? '', image: null };
  }

  isMcqOptionCorrect(field: ContentField, index: number): boolean {
    const rows = this.formValues[field.field] ?? this.parseMcqOptions([]);
    return this.formValues['keyAnswer']?.text === rows[index]?.label;
  }

  onChapterReferenceChange(field: ContentField, key: 'chapterNumber' | 'title', value: string): void {
    const current = this.formValues[field.field] ?? { chapterNumber: '', title: '' };
    this.formValues[field.field] = { ...current, [key]: value };
  }
}

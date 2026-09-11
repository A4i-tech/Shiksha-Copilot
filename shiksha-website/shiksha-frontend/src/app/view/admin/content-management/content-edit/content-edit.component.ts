import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  ContentEntityConfig,
  ContentField,
  getContentEntityConfig,
} from '../content-management.config';
import { ContentManagementService } from '../content-management.service';
import { ChapterPickerComponent } from '../chapter-picker/chapter-picker.component';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChapterPickerComponent],
})
export class ContentEditComponent implements OnInit, OnDestroy {
  config!: ContentEntityConfig;
  recordId = '';
  record: any = null;
  /** true when the route id is `new`, so the form adds a record */
  isCreate = false;

  /** form value of each field, as the control shows it */
  formValues: { [field: string]: any } = {};
  /** parse error of each JSON field */
  fieldErrors: { [field: string]: string } = {};

  isLoading = false;
  isSaving = false;

  /** {value, label} of every board a master subject applies to, for the chapter subject dropdown */
  subjectOptions: { value: string; label: string }[] = [];

  private original: { [field: string]: any } = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentManagementService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const entity = getContentEntityConfig(params.get('entity'));
        const id = params.get('id') || 'new';

        if (!entity) {
          this.router.navigate(['/content-management/chapters']);
          return;
        }

        this.config = entity;
        this.recordId = id;
        this.isCreate = id === 'new';

        if (entity.fields.some((field) => field.type === 'subject-select')) {
          this.loadSubjectOptions();
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

        this.loadRecord();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  loadRecord(): void {
    this.isLoading = true;

    this.contentService.getById(this.config.segment, this.recordId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.record = res?.data ?? res;
        this.fillForm(this.record);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  get visibleFields(): ContentField[] {
    return this.config.fields.filter((field) => {
      if (!this.isCreate && field.createOnly) return false;
      if (field.visibleWhen && !field.visibleWhen.values.includes(this.formValues[field.visibleWhen.field])) {
        return false;
      }
      return true;
    });
  }

  save(targetStatus: 'draft' | 'under_review' = 'draft'): void {
    const body = this.isCreate
      ? this.buildCreateBody()
      : this.buildChangedBody();

    if (Object.keys(this.fieldErrors).length) {
      this.utilityService.showError(
        'Correct the fields marked with an error before you save.'
      );
      return;
    }

    if (!body) return;

    if (!Object.keys(body).length) {
      this.utilityService.showError('No field has changed.');
      return;
    }

    this.isSaving = true;

    const request = this.isCreate
      ? this.contentService.create(this.config.segment, body).pipe(
          switchMap((res: any) => {
            if (targetStatus === 'draft') return of(res);

            const id = res?.data?.insertedIds?.[0];
            if (!id) throw new Error('The record was created but its ID was not returned.');

            return this.contentService.update(this.config.segment, id, {
              status: targetStatus,
            });
          })
        )
      : this.contentService.update(this.config.segment, this.recordId, body);

    request.subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.utilityService.showSuccess(
          res?.message ||
            (this.isCreate
              ? `${this.config.singular} added successfully`
              : `${this.config.singular} updated successfully`)
        );
        this.router.navigate(['/content-management', this.config.key]);
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

  // The backend runs the same check as the bulk upload, so this sends the values as they are.
  private buildCreateBody(): { [key: string]: any } | null {
    const body: { [key: string]: any } = {};
    const missing: string[] = [];

    this.visibleFields.forEach((field) => {
      let value: any;

      try {
        value = this.toRecordValue(field);
      } catch (err) {
        this.fieldErrors[field.field] = 'This value is not valid JSON.';
        return;
      }

      const isEmpty =
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        if (field.requiredOnCreate) missing.push(field.label);
        return;
      }

      body[field.field] = value;
    });

    if (Object.keys(this.fieldErrors).length) return null;

    if (missing.length) {
      this.utilityService.showError(
        `These fields need a value: ${missing.join(', ')}.`
      );
      return null;
    }

    return body;
  }

  cancel(): void {
    this.router.navigate(['/content-management', this.config.key]);
  }

  onFieldChange(field: ContentField, value: any): void {
    this.formValues[field.field] = value;

    if (field.type !== 'json') {
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
      this.fieldErrors[field.field] = 'This value is not valid JSON.';
    }
  }

  private fillForm(record: any): void {
    this.formValues = {};
    this.original = {};
    this.fieldErrors = {};

    // Load every field's value, not just the currently-visible ones: a value like `answerType`
    // must already be in formValues before the visibleFields getter can decide which of its
    // sibling fields (options, pairs, keyAnswer) to show.
    this.config.fields.forEach((field) => {
      const value = record?.[field.field];
      this.original[field.field] = value;
      this.formValues[field.field] = this.toControlValue(field, value);
    });
  }

  private toControlValue(field: ContentField, value: any): any {
    if (field.type === 'boolean') return value === true;

    if (value === null || value === undefined) return '';

    if (field.type === 'list') {
      return Array.isArray(value) ? value.join('\n') : `${value}`;
    }

    if (field.type === 'json') {
      return JSON.stringify(value, null, 2);
    }

    if (field.type === 'question-content') {
      return this.parseQuestionContent(value);
    }

    return `${value}`;
  }

  // A question's text/answer is a plain string, or (per PR #93) a list of
  // { contentType, content } parts when it carries an image alongside the text.
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

    switch (field.type) {
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
      if (this.fieldErrors[field.field]) return;

      let next: any;

      try {
        next = this.toRecordValue(field);
      } catch (err) {
        this.fieldErrors[field.field] = 'This value is not valid JSON.';
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
    switch (field.type) {
      case 'boolean':
        return false;
      case 'list':
        return [];
      case 'number':
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
}

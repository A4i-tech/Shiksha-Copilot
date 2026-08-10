import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  ContentEntityConfig,
  ContentField,
  getContentEntityConfig,
} from '../content-management.config';
import { ContentManagementService } from '../content-management.service';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  private original: { [field: string]: any } = {};
  private subscriptions: Subscription[] = [];

  /**
   * class constructor
   * @param route
   * @param router
   * @param contentService
   * @param utilityService
   */
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

  /**
   * Method to read the record and fill the form
   */
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

  /**
   * Method to give the fields of the current mode. The add form shows the
   * fields that the record needs at birth, the edit form hides them.
   * @returns
   */
  get visibleFields(): ContentField[] {
    return this.config.fields.filter((field) =>
      this.isCreate ? true : !field.createOnly
    );
  }

  /**
   * Method to save the form. The add form sends every field, the edit form
   * sends the changed fields only.
   */
  save(): void {
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
      ? this.contentService.create(this.config.segment, body)
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
        this.utilityService.handleError(err);
      },
    });
  }

  /**
   * Method to collect every filled field of the add form. The backend runs the
   * same check that the file upload runs, so this sends the values as they are.
   * @returns the body, or null when a required field is empty
   */
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

  /**
   * Method to leave the form without a save
   */
  cancel(): void {
    this.router.navigate(['/content-management', this.config.key]);
  }

  /**
   * Method to validate a JSON field on each change
   * @param field
   * @param value
   */
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

  /**
   * Method to fill the form from the record
   * @param record
   */
  private fillForm(record: any): void {
    this.formValues = {};
    this.original = {};
    this.fieldErrors = {};

    this.visibleFields.forEach((field) => {
      const value = record?.[field.field];
      this.original[field.field] = value;
      this.formValues[field.field] = this.toControlValue(field, value);
    });
  }

  /**
   * Method to convert a record value into the value of the control
   * @param field
   * @param value
   * @returns
   */
  private toControlValue(field: ContentField, value: any): any {
    if (field.type === 'boolean') return value === true;

    if (value === null || value === undefined) return '';

    if (field.type === 'list') {
      return Array.isArray(value) ? value.join('\n') : `${value}`;
    }

    if (field.type === 'json') {
      return JSON.stringify(value, null, 2);
    }

    return `${value}`;
  }

  /**
   * Method to convert the value of a control back into a record value
   * @param field
   * @returns
   */
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
      default:
        return `${raw}`;
    }
  }

  /**
   * Method to collect the fields that the admin changed. The backend rejects a
   * body with no field, and it also rejects a field that it does not own, so
   * this sends the changed fields only.
   * @returns
   */
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

  /**
   * Method to give the empty value of a field type. A record that never had the
   * field must not count as a change when the control stays empty.
   * @param field
   * @returns
   */
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
}

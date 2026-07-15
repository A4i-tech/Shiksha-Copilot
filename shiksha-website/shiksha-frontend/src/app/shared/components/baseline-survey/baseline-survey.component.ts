import { Component, Inject } from '@angular/core';
import {
  FormBuilder, FormGroup, FormArray, Validators,
  FormControl, AbstractControl, ValidatorFn
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaselineSurveyService } from 'src/app/core/services/baseline-survey.service';

@Component({
  selector: 'app-baseline-survey',
  templateUrl: './baseline-survey.component.html',
  styleUrls: ['./baseline-survey.component.scss']
})
export class BaselineSurveyComponent {
  surveyForm: FormGroup;
  submitting = false;
  reminding = false;
  submitted = false;
  error: string | null = null;

  /** -1 = intro screen, 0..totalSteps-1 = question steps */
  currentStep = -1;

  // Order of form controls that make up each step of the wizard.
  private stepControlNames: string[] = [
    'plans',
    'devices',
    'weeklyLessonPlans',
    'lessonPlanComponents',
    'timePerLessonPlan',
    'resourcesUsed',
    'timeForAssessments',
    'questionBalance',
    'otherNotes'
  ];

  get totalSteps(): number {
    return this.stepControlNames.length;
  }

  /** Used purely to *ngFor the tally track ticks */
  get stepProgressArray(): number[] {
    return Array.from({ length: this.totalSteps });
  }

  get isLastStep(): boolean {
    return this.currentStep === this.totalSteps - 1;
  }

  get nextButtonLabel(): string {
    return this.isLastStep ? 'Submit survey' : 'Next';
  }

  // Q1 – How do you currently prepare your lesson plans?
  planOptions = [
    'Paper-based (Notebook/Register)',
    'Digital documents (Word, Google Docs, PowerPoint, etc.)',
    'Other'
  ];

  // Q2 – Which devices do you use while preparing lesson plans?
  deviceOptions = [
    'School desktop/laptop/tablet',
    'Personal desktop/laptop/tablet',
    'Personal mobile phone',
    "Another person's device (family/friend/colleague)",
    'Books/Notes only (No digital device)',
    'Other'
  ];

  // Q3 – How many lesson plans per week?
  weeklyOptions = ['1', '2', '3', '4', 'More than 5'];

  // Q4 – Which components do you include?
  componentOptions = [
    'Hands-on activities',
    'Real-world examples / Analogies',
    'Stories',
    'Videos',
    'Classroom discussion',
    'None of the above',
    'Other'
  ];

  // Q5 – Time per lesson plan (radio)
  timePerLessonOptions = [
    'Less than 15 minutes',
    '15–30 minutes',
    '30–60 minutes',
    '60–90 minutes',
    'More than 90 minutes',
    'Other'
  ];

  // Q6 – Resources used
  resourceOptions = [
    'School textbooks',
    'Other textbooks / Reference books',
    'DIKSHA',
    'Educational websites (Khan Academy etc.)',
    'YouTube',
    'AI tools (ChatGPT, Shiksha Copilot, Gemini, etc.)',
    'Search engines (Google, Bing, etc.)',
    'Other'
  ];

  // Q7 – Time for formative assessment (radio)
  timeAssessmentOptions = [
    'Less than 15 minutes',
    '15–30 minutes',
    '30–60 minutes',
    '60–90 minutes',
    'More than 90 minutes',
    'Other'
  ];

  // Q8 – Question balance strategy (multi-select)
  questionBalanceOptions = [
    'I use my own experience',
    'I refer to previous question papers',
    'I discuss with colleagues',
    'I follow a blueprint/guidelines',
    'I do not specifically check this',
    'Other'
  ];

  // Maps each checkbox-array control to its "Other" free-text control,
  // so the text becomes required exactly when "Other" is checked.
  private otherFieldMap: { [key: string]: string } = {
    plans: 'plansOther',
    devices: 'devicesOther',
    lessonPlanComponents: 'lessonPlanComponentsOther',
    resourcesUsed: 'resourcesUsedOther',
    questionBalance: 'questionBalanceOther'
  };

  // Same idea, but for the radio-style questions handled via selectRadioValue().
  private radioOtherFieldMap: { [key: string]: string } = {
    timePerLessonPlan: 'timePerLessonPlanOther',
    timeForAssessments: 'timeForAssessmentsOther'
  };

  // Checkbox-array controls where one option is exclusive of all the others
  // (e.g. "None of the above" wipes out and disables every other choice).
  private exclusiveOptionMap: { [key: string]: string } = {
    lessonPlanComponents: 'None of the above'
  };

  get remindLaterCount(): number {
    return this.data?.remindLaterCount ?? 0;
  }

  get isMandatory(): boolean {
    return this.data?.isMandatory === true;
  }

  constructor(
    private fb: FormBuilder,
    private surveyService: BaselineSurveyService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BaselineSurveyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.surveyForm = this.fb.group({
      // Q1
      plans: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      plansOther: [''],
      // Q2
      devices: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      devicesOther: [''],
      // Q3
      weeklyLessonPlans: ['', Validators.required],
      // Q4
      lessonPlanComponents: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      lessonPlanComponentsOther: [''],
      // Q5
      timePerLessonPlan: ['', Validators.required],
      timePerLessonPlanOther: [''],
      // Q6
      resourcesUsed: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      resourcesUsedOther: [''],
      // Q7
      timeForAssessments: ['', Validators.required],
      timeForAssessmentsOther: [''],
      // Q8
      questionBalance: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      questionBalanceOther: [''],
      // Q9
      otherNotes: [''],
    });
  }

  /** Custom validator for minimum selected checkboxes */
  private minSelectedCheckboxes(min: number = 1): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!(control instanceof FormArray)) return null;
      const totalSelected = control.controls
        .map(c => c.value)
        .reduce((prev, next) => (next ? prev + 1 : prev), 0);
      return totalSelected >= min ? null : { required: true };
    };
  }

  /** Turns the required validator on/off for a given "Other" text control. */
  private updateOtherValidator(controlName: string, required: boolean): void {
    const control = this.surveyForm.get(controlName);
    if (!control) return;

    if (required) {
      control.setValidators([Validators.required]);
    } else {
      control.clearValidators();
      control.setValue('');
    }
    control.updateValueAndValidity();
  }

  toggleArray(controlName: string, value: string): void {
    const formArray = this.surveyForm.get(controlName) as FormArray;
    const exclusiveOption = this.exclusiveOptionMap[controlName];

    if (exclusiveOption) {
      if (value === exclusiveOption) {
        // Toggling "None of the above" itself: either select it alone, or clear it.
        const alreadySelected = this.isChecked(controlName, exclusiveOption);
        formArray.clear();
        if (!alreadySelected) {
          formArray.push(new FormControl(exclusiveOption));
        }
        const otherControlName = this.otherFieldMap[controlName];
        if (otherControlName) {
          this.updateOtherValidator(otherControlName, false);
        }
        formArray.updateValueAndValidity();
        formArray.markAsTouched();
        return;
      }

      // Selecting any other option should not coexist with "None of the above".
      if (this.isOptionDisabled(controlName, value)) {
        return; // guarded in the template too, but block here just in case
      }
    }

    const index = formArray.value.indexOf(value);
    if (index === -1) {
      formArray.push(new FormControl(value));
    } else {
      formArray.removeAt(index);
    }
    formArray.updateValueAndValidity();
    formArray.markAsTouched();

    const otherControlName = this.otherFieldMap[controlName];
    if (otherControlName) {
      this.updateOtherValidator(otherControlName, this.isChecked(controlName, 'Other'));
    }
  }

  isChecked(controlName: string, value: string): boolean {
    const formArray = this.surveyForm.get(controlName) as FormArray;
    return formArray.value.includes(value);
  }

  /**
   * True when `option` should be greyed out and unclickable because the
   * control's exclusive option (e.g. "None of the above") is currently selected.
   * "Other" is exempt — a teacher can still pick "None of the above" and
   * additionally specify something via "Other".
   */
  isOptionDisabled(controlName: string, option: string): boolean {
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    if (!exclusiveOption || option === exclusiveOption || option === 'Other') return false;
    return this.isChecked(controlName, exclusiveOption);
  }

  /** True when this control's exclusive option (e.g. "None of the above") is selected. */
  isExclusiveOptionActive(controlName: string): boolean {
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    if (!exclusiveOption) return false;
    return this.isChecked(controlName, exclusiveOption);
  }

  /** Text explaining why the other options are locked, for tooltips/notes. */
  exclusiveOptionMessage(controlName: string): string {
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    return exclusiveOption
      ? `Deselect "${exclusiveOption}" to choose other options, or use "Other" to add specifics.`
      : '';
  }

  /** Sets a single-value (radio-style) control and marks it touched */
  selectRadioValue(controlName: string, value: string): void {
    const control = this.surveyForm.get(controlName);
    control?.setValue(value);
    control?.markAsTouched();

    const otherControlName = this.radioOtherFieldMap[controlName];
    if (otherControlName) {
      this.updateOtherValidator(otherControlName, value === 'Other');
    }
  }

  // "Other" visibility getters
  get showPlansOther(): boolean { return this.isChecked('plans', 'Other'); }
  get showDevicesOther(): boolean { return this.isChecked('devices', 'Other'); }
  get showLessonComponentsOther(): boolean { return this.isChecked('lessonPlanComponents', 'Other'); }
  get showTimePerLessonOther(): boolean { return this.surveyForm.get('timePerLessonPlan')?.value === 'Other'; }
  get showResourcesOther(): boolean { return this.isChecked('resourcesUsed', 'Other'); }
  get showTimeAssessmentsOther(): boolean { return this.surveyForm.get('timeForAssessments')?.value === 'Other'; }
  get showQuestionBalanceOther(): boolean { return this.isChecked('questionBalance', 'Other'); }

  /** Moves from the intro screen into question 1 */
  startSurvey(): void {
    this.currentStep = 0;
  }

  goNext(): void {
    if (this.currentStep === -1) {
      this.startSurvey();
      return;
    }

    const controlName = this.stepControlNames[this.currentStep];
    const control = controlName ? this.surveyForm.get(controlName) : null;

    if (control && control.invalid) {
      control.markAsTouched();
      return;
    }

    // Block advancing if this step's "Other" text is required but still empty.
    const otherControlName = this.otherFieldMap[controlName] || this.radioOtherFieldMap[controlName];
    if (otherControlName) {
      const otherControl = this.surveyForm.get(otherControlName);
      if (otherControl && otherControl.invalid) {
        otherControl.markAsTouched();
        return;
      }
    }

    if (this.isLastStep) {
      this.onSubmit();
      return;
    }

    this.currentStep++;
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.surveyForm.invalid) {
      this.markTouched(this.surveyForm);
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.surveyService.submitSurvey(this.surveyForm.value).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.submitted = true;
          this.snackBar.open('Survey submitted successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          // brief pause so the "thank you" state is visible before the dialog closes
          setTimeout(() => this.dialogRef.close(true), 1300);
        } else {
          this.error = response.message || 'Failed to submit survey. Please try again.';
        }
      },
      error: (error) => {
        console.error('Error submitting survey:', error);
        this.error = 'An error occurred while submitting the survey. Please try again.';
        this.submitting = false;
      }
    });
  }

  onRemindLater(): void {
    if (this.isMandatory) return;
    this.reminding = true;
    this.surveyService.remindLater().subscribe({
      next: () => {
        this.reminding = false;
        this.dialogRef.close('remind');
      },
      error: () => {
        this.reminding = false;
        this.dialogRef.close('remind');
      }
    });
  }

  private markTouched(group: FormGroup | FormArray) {
    Object.values(group.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markTouched(control);
      }
    });
  }
}
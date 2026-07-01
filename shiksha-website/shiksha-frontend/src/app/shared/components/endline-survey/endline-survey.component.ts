
import { Component, Inject } from '@angular/core';
import {
  FormBuilder, FormGroup, FormArray, Validators,
  FormControl, AbstractControl, ValidatorFn
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getDayOfYear, getYear } from 'date-fns';
import { EndlineSurveyService } from 'src/app/core/services/endline-survey.service';

@Component({
  selector: 'app-endline-survey',
  templateUrl: './endline-survey.component.html',
  styleUrls: ['./endline-survey.component.scss']
})
export class EndlineSurveyComponent {
  surveyForm: FormGroup;
  submitting = false;
  error: string | null = null;

  // Shiksha Copilot specific options
  shikshaTimeOptions = ['< 5 minutes', '5 – 15 minutes', 'Under 30 minutes', 'Over 30 minutes'];
  shikshaUsabilityOptions = ['Can be used directly in class room', 'Requires some minor modifications', 'Requires significant modifications', 'Not very useful'];
  shikshaBenefitsOptions = [
    'Reduced time I spend on lesson planning',
    'Provides quality content',
    'Helped me to improve my knowledge',
    'Still exploring its usefulness'
  ];
  shikshaTimeUtilizationOptions = [
    'I spend saved time on self-improvement',
    'I dedicate more time to interacting with students and helping them with their questions.',
    'I use saved time to complete administrative tasks',
    'Other:'
  ];
  shikshaContentOptions = ['Questions', 'Real world examples', 'Activities','I have not used any of these in my classroom'];
  shikshaStudentImpactOptions = [
    'Encourages deeper thinking and curiosity',
    'Improves problem-solving and reasoning skills',
    'Engagement of students at different learning levels',
    'Helps students understand concepts',
    'I have not used it enough to notice changes'
  ];

  constructor(
    private fb: FormBuilder,
    private privateBxService: EndlineSurveyService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EndlineSurveyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.surveyForm = this.fb.group({
      // Shiksha Copilot Questions
      shikshaTimeUsage: ['', Validators.required],
      shikshaUsability: ['', Validators.required],
      shikshaBenefits: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      shikshaTimeUtilization: ['', Validators.required], // Changed from array to string
      shikshaTimeUtilizationOther: [''], // Will be validated conditionally
      shikshaContentUsed: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)]),
      shikshaStudentImpact: this.fb.array([], [Validators.required, this.minSelectedCheckboxes(1)])
    });

    // Add conditional validator for "Other" field
    this.surveyForm.get('shikshaTimeUtilization')?.valueChanges.subscribe(value => {
      const otherField = this.surveyForm.get('shikshaTimeUtilizationOther');
      if (value === 'Other:') {
        otherField?.setValidators([Validators.required]);
        otherField?.updateValueAndValidity();
      } else {
        otherField?.clearValidators();
        otherField?.updateValueAndValidity();
      }
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

  toggleArray(controlName: string, value: string): void {
    const formArray = this.surveyForm.get(controlName) as FormArray;
    const index = formArray.value.indexOf(value);
    if (index === -1) {
      formArray.push(new FormControl(value));
    } else {
      formArray.removeAt(index);
    }
    formArray.updateValueAndValidity();
  }

  isChecked(controlName: string, value: string): boolean {
    const formArray = this.surveyForm.get(controlName) as FormArray;
    return formArray.value.includes(value);
  }

  // Shiksha Copilot conditional getters
  get showOtherTimeUtilization(): boolean {
    return this.surveyForm.get('shikshaTimeUtilization')?.value === 'Other:';
  }

  // Dynamic visibility getters for special options
  get showSpecialBenefitsNote(): boolean {
    const benefits = this.surveyForm.get('shikshaBenefits')?.value || [];
    return benefits.includes('Still exploring its usefulness');
  }

  get showOtherBenefitsOptions(): boolean {
    const benefits = this.surveyForm.get('shikshaBenefits')?.value || [];
    return !benefits.includes('Still exploring its usefulness');
  }

  get showSpecialContentNote(): boolean {
    const content = this.surveyForm.get('shikshaContentUsed')?.value || [];
    return content.includes('I have not used any of these in my classroom');
  }

  get showOtherContentOptions(): boolean {
    const content = this.surveyForm.get('shikshaContentUsed')?.value || [];
    return !content.includes('I have not used any of these in my classroom');
  }

  get showSpecialImpactNote(): boolean {
    const impact = this.surveyForm.get('shikshaStudentImpact')?.value || [];
    return impact.includes('I have not used it enough to notice changes');
  }

  get showOtherImpactOptions(): boolean {
    const impact = this.surveyForm.get('shikshaStudentImpact')?.value || [];
    return !impact.includes('I have not used it enough to notice changes');
  }

  // Computed properties for filtered options
  get filteredBenefitsOptions(): string[] {
    return this.shikshaBenefitsOptions.filter(o => o !== 'Still exploring its usefulness');
  }

  get filteredContentOptions(): string[] {
    return this.shikshaContentOptions.filter(o => o !== 'I have not used any of these in my classroom');
  }

  get filteredImpactOptions(): string[] {
    return this.shikshaStudentImpactOptions.filter(o => o !== 'I have not used it enough to notice changes');
  }

  // Mutual exclusivity logic for Question 3 (Benefits)
  onBenefitsChange(value: string, event: any): void {
    const benefitsArray = this.surveyForm.get('shikshaBenefits') as FormArray;
    const isExploring = value === 'Still exploring its usefulness';
    const isChecked = event.target.checked;
    
    if (isExploring && isChecked) {
      // If "Still exploring" is being checked, clear all other options
      benefitsArray.clear();
      benefitsArray.push(this.fb.control(value));
    } else if (!isExploring && isChecked) {
      // If any other option is being checked, remove "Still exploring" if present
      const exploringIndex = benefitsArray.value.indexOf('Still exploring its usefulness');
      if (exploringIndex !== -1) {
        benefitsArray.removeAt(exploringIndex);
      }
      // Add the selected option if not already present
      if (!benefitsArray.value.includes(value)) {
        benefitsArray.push(this.fb.control(value));
      }
    } else if (!isChecked) {
      // If unchecking, remove the option
      const index = benefitsArray.value.indexOf(value);
      if (index !== -1) {
        benefitsArray.removeAt(index);
      }
    }
  }

  // Mutual exclusivity logic for Question 5 (Content Used)
  onContentUsedChange(value: string, event: any): void {
    const contentArray = this.surveyForm.get('shikshaContentUsed') as FormArray;
    const notUsed = value === 'I have not used any of these in my classroom';
    const isChecked = event.target.checked;
    
    if (notUsed && isChecked) {
      // If "Not used" is being checked, clear all other options
      contentArray.clear();
      contentArray.push(this.fb.control(value));
    } else if (!notUsed && isChecked) {
      // If any other option is being checked, remove "Not used" if present
      const notUsedIndex = contentArray.value.indexOf('I have not used any of these in my classroom');
      if (notUsedIndex !== -1) {
        contentArray.removeAt(notUsedIndex);
      }
      // Add the selected option if not already present
      if (!contentArray.value.includes(value)) {
        contentArray.push(this.fb.control(value));
      }
    } else if (!isChecked) {
      // If unchecking, remove the option
      const index = contentArray.value.indexOf(value);
      if (index !== -1) {
        contentArray.removeAt(index);
      }
    }
  }

  // Mutual exclusivity logic for Question 6 (Student Impact)
  onStudentImpactChange(value: string, event: any): void {
    const impactArray = this.surveyForm.get('shikshaStudentImpact') as FormArray;
    const notEnough = value === 'I have not used it enough to notice changes';
    const isChecked = event.target.checked;
    
    if (notEnough && isChecked) {
      // If "Not enough" is being checked, clear all other options
      impactArray.clear();
      impactArray.push(this.fb.control(value));
    } else if (!notEnough && isChecked) {
      // If any other option is being checked, remove "Not enough" if present
      const notEnoughIndex = impactArray.value.indexOf('I have not used it enough to notice changes');
      if (notEnoughIndex !== -1) {
        impactArray.removeAt(notEnoughIndex);
      }
      // Add the selected option if not already present
      if (!impactArray.value.includes(value)) {
        impactArray.push(this.fb.control(value));
      }
    } else if (!isChecked) {
      // If unchecking, remove the option
      const index = impactArray.value.indexOf(value);
      if (index !== -1) {
        impactArray.removeAt(index);
      }
    }
  }

  // Check if option should be disabled based on mutual exclusivity
  isOptionDisabled(fieldName: string, optionValue: string): boolean {
    const formArray = this.surveyForm.get(fieldName) as FormArray;
    const currentValues = formArray.value as string[];
    
    switch (fieldName) {
      case 'shikshaBenefits':
        const isExploringSelected = currentValues.includes('Still exploring its usefulness');
        return (isExploringSelected && optionValue !== 'Still exploring its usefulness') ||
               (!isExploringSelected && optionValue === 'Still exploring its usefulness');
      
      case 'shikshaContentUsed':
        const notUsedSelected = currentValues.includes('I have not used any of these in my classroom');
        return (notUsedSelected && optionValue !== 'I have not used any of these in my classroom') ||
               (!notUsedSelected && optionValue === 'I have not used any of these in my classroom');
      
      case 'shikshaStudentImpact':
        const notEnoughSelected = currentValues.includes('I have not used it enough to notice changes');
        return (notEnoughSelected && optionValue !== 'I have not used it enough to notice changes') ||
               (!notEnoughSelected && optionValue === 'I have not used it enough to notice changes');
      
      default:
        return false;
    }
  }

  onSubmit(): void {
    // Custom validation for "Other" field
    const timeUtilization = this.surveyForm.get('shikshaTimeUtilization')?.value;
    const otherField = this.surveyForm.get('shikshaTimeUtilizationOther');
    
    if (timeUtilization === 'Other:' && (!otherField?.value || otherField?.value.trim() === '')) {
      otherField?.markAsTouched();
      otherField?.setErrors({ required: true });
      this.error = 'Please specify your response in the text field.';
      return;
    }
    
    if (this.surveyForm.invalid) {
      this.markTouched(this.surveyForm);
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.surveyForm.value;

    this.privateBxService.submitSurvey(formValue).subscribe({
      next: (response: any) => {
        this.submitting = false;
        if (response.success) {
          this.snackBar.open('Endline Survey submitted successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        } else {
          this.error = response.message || 'Failed to submit survey. Please try again.';
        }
      },
      error: (error: any) => {
        console.error('Error submitting survey:', error);
        this.error = 'An error occurred while submitting the survey. Please try again.';
        this.submitting = false;
      }
    });
  }

  onClose(): void {
    if (this.data?.force) {
      return;
    }
    if (this.surveyForm.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }

  private markTouched(group: FormGroup | FormArray) {
    Object.values(group.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markTouched(control);
      }
    });
  }


academicYear: string = '';

ngOnInit(): void {
  this.academicYear = this.getAcademicYear();
}

private getAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Jan = 0

  // Assuming academic year starts in June
  return month >= 6
    ? `${year}-${(year + 1).toString().slice(-2)}`
    : `${year - 1}-${year.toString().slice(-2)}`;
}

  
}
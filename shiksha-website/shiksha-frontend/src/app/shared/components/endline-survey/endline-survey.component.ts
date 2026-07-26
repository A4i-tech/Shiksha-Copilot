import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EndlineSurveyService } from 'src/app/core/services/endline-survey.service';
import { DropDownConfig, DropdownOption } from '../../interfaces/dropdown.interface';

@Component({ selector: 'app-endline-survey', templateUrl: './endline-survey.component.html', styleUrls: ['./endline-survey.component.scss'] })
export class EndlineSurveyComponent {
  submitting = false;
  error = '';
  readonly options: Record<string, string[]> = {
    shikshaTimeUsage: ['< 5 minutes', '5 – 15 minutes', 'Under 30 minutes', 'Over 30 minutes'],
    shikshaUsability: ['Can be used directly in class room', 'Requires some minor modifications', 'Requires significant modifications', 'Not very useful'],
    shikshaBenefits: ['Reduced time I spend on lesson planning', 'Provides quality content', 'Helped me to improve my knowledge', 'Still exploring its usefulness'],
    shikshaTimeUtilization: ['I spend saved time on self-improvement', 'I dedicate more time to interacting with students and helping them with their questions.', 'I use saved time to complete administrative tasks', 'Other:'],
    shikshaContentUsed: ['Questions', 'Real world examples', 'Activities', 'I have not used any of these in my classroom'],
    shikshaStudentImpact: ['Encourages deeper thinking and curiosity', 'Improves problem-solving and reasoning skills', 'Engagement of students at different learning levels', 'Helps students understand concepts', 'I have not used it enough to notice changes'],
  };
  readonly dropdownOptions: Record<string, DropdownOption[]> = Object.fromEntries(Object.entries(this.options).map(([field, options]) => [field, options.map(value => ({ name: value, value }))]));
  readonly dropdownConfig: DropDownConfig = { isBackground: false, placeHolderTxt: 'Select', hideLabel: true };
  readonly exclusive: Record<string, string> = {
    shikshaBenefits: 'Still exploring its usefulness',
    shikshaContentUsed: 'I have not used any of these in my classroom',
    shikshaStudentImpact: 'I have not used it enough to notice changes',
  };
  readonly form = this.fb.group({
    shikshaTimeUsage: ['', Validators.required], shikshaUsability: ['', Validators.required],
    shikshaBenefits: this.fb.array<string>([], Validators.required),
    shikshaTimeUtilization: ['', Validators.required], shikshaTimeUtilizationOther: [''],
    shikshaContentUsed: this.fb.array<string>([], Validators.required),
    shikshaStudentImpact: this.fb.array<string>([], Validators.required),
  });

  constructor(private fb: FormBuilder, private service: EndlineSurveyService, private dialog: MatDialogRef<EndlineSurveyComponent>) {}

  toggle(field: string, option: string, checked: boolean) {
    const control = this.form.get(field) as FormArray;
    const exclusive = this.exclusive[field];
    if (checked && option === exclusive) { control.clear(); control.push(new FormControl(option, { nonNullable: true })); return; }
    const exclusiveIndex = control.value.indexOf(exclusive);
    if (checked && exclusiveIndex >= 0) control.removeAt(exclusiveIndex);
    const index = control.value.indexOf(option);
    if (checked && index < 0) control.push(new FormControl(option, { nonNullable: true }));
    if (!checked && index >= 0) control.removeAt(index);
  }

  checked(field: string, option: string) { return (this.form.get(field)?.value as string[]).includes(option); }
  submit() {
    if (this.form.invalid || (this.form.value.shikshaTimeUtilization === 'Other:' && !this.form.value.shikshaTimeUtilizationOther?.trim())) {
      this.form.markAllAsTouched(); this.error = 'Please answer all questions.'; return;
    }
    this.submitting = true; this.error = '';
    this.service.submitSurvey(this.form.getRawValue()).subscribe({
      next: () => this.dialog.close(true),
      error: (error) => { this.submitting = false; this.error = error.error?.message || 'Failed to submit survey.'; },
    });
  }
}

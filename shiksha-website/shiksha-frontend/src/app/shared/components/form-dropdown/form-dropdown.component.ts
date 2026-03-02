import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { FormDropDownConfig, FormDropDownOption, FormDropDownValue } from '../../interfaces/form-dropdown.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-dropdown.component.html',
  styleUrls: ['./form-dropdown.component.scss'],
})
export class FormDropdownComponent implements OnInit, OnChanges {
  constructor() { }
  /** Options for the dropdown; items may include optional `info` (string) for tooltip. */
  @Input() dropDownValues: FormDropDownOption[] = [];

  @Input() dropDownControlName!: string;

  @Input() dropDownCtrl!: FormControl;

  @Input() config!: FormDropDownConfig;

  @Input() submitted = false;

  @Input() mode!: string;

  @Output() valueChange: EventEmitter<FormDropDownValue | FormDropDownValue[]> = new EventEmitter<FormDropDownValue | FormDropDownValue[]>();


  formGroupTemp!: FormGroup;

  /**
   * Angular oninit lifecycle hook used for initialization
   */
  ngOnInit(): void {
    const obj: { [key: string]: FormControl } = {};
    obj[this.dropDownControlName] = new FormControl(null);
    this.formGroupTemp = new FormGroup(obj);
    this.filterDropDownValues();
  }

  /**
   * Angular onchanges lifecycle hook to handle input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropDownValues']) {
      this.filterDropDownValues();
    }
  }

  /**
   * Filter out invalid items from dropDownValues to prevent ng-select errors
   */
  private filterDropDownValues(): void {
    // Ensure dropDownValues is always an array
    if (!Array.isArray(this.dropDownValues)) {
      this.dropDownValues = [];
      return;
    }
    // Filter out null/undefined items to prevent ng-select errors
    this.dropDownValues = this.dropDownValues.filter(item => item != null);
  }

  /**
   * Function to remove chip value
   * @param i index
   */
  removeItem(i: number) {
    const raw = this.dropDownCtrl?.value;
    const currentVal: FormDropDownValue[] = Array.isArray(raw) ? [...raw] : [];
    const updatedArr = currentVal.filter((_, index) => index !== i);
    this.dropDownCtrl?.setValue(updatedArr);
    this.valueChange.emit(updatedArr);
  }

  /**
   * Function to emit value change
   * @param val
   */
  valueSelected(val: FormDropDownValue | FormDropDownValue[]) {
    this.valueChange.emit(val);
  }

  public onSelectAll() {
    if (this.config.selectAllValue) {
      const data = this.dropDownValues.map((e) =>
        this.config?.selectAllValue ? (e[this.config.selectAllValue as keyof FormDropDownOption] as FormDropDownValue) : (e as FormDropDownValue)
      );
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data);
    } else {
      const values = this.dropDownValues as unknown as FormDropDownValue[];
      this.dropDownCtrl.setValue(values);
      this.valueChange.emit(values);
    }
  }

  public onClearAll() {
    this.dropDownCtrl.setValue([]);
    this.valueChange.emit([] as FormDropDownValue[]);
  }

  toggleSelection(item: FormDropDownValue) {
    const raw = this.dropDownCtrl?.value;
    const currentVal: FormDropDownValue[] = Array.isArray(raw) ? [...raw] : [];
    const index = currentVal.findIndex((i: FormDropDownValue) => i === item);
    if (index === -1) {
      currentVal.push(item);
      this.dropDownCtrl.setValue(currentVal);
    } else {
      currentVal.splice(index, 1);
      this.dropDownCtrl.setValue(currentVal);
    }
  }

  toggleSelectAll(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target?.checked) {
      if (this.config.selectAllValue) {
        const data = this.dropDownValues.map((e) =>
          this.config?.selectAllValue ? (e[this.config.selectAllValue as keyof FormDropDownOption] as FormDropDownValue) : (e as FormDropDownValue)
        );
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
      } else {
        const values = this.dropDownValues as unknown as FormDropDownValue[];
        this.dropDownCtrl.setValue(values);
        this.valueChange.emit(values);
      }
    } else {
      this.dropDownCtrl.setValue([]);
      this.valueChange.emit([] as FormDropDownValue[]);
    }
  }

  isSelectAll() {
    const raw = this.dropDownCtrl.value;
    const currentVal: FormDropDownValue[] = Array.isArray(raw) ? raw : [];
    return currentVal.length === this.dropDownValues?.length;
  }

  isSelected(item: FormDropDownValue) {
    const raw = this.dropDownCtrl.value;
    const currentVal: FormDropDownValue[] = Array.isArray(raw) ? raw : [];
    return currentVal.some((i: FormDropDownValue) => i === item);
  }

  public get hasSelections(): boolean {
    const raw = this.dropDownCtrl.value;
    const currentVal: FormDropDownValue[] = Array.isArray(raw) ? raw : [];
    return currentVal.length > 0;
  }

  /**
   * Returns option info text for use in tooltip/aria-label.
   * This is not user-entered text and does not require additional sanitization.
   */
  getSafeInfo(item: FormDropDownOption): string {
    return item?.info ?? '';
  }

  /**
   * Get the display label for a value by looking it up in dropDownValues
   * @param value The value to look up (e.g., abbreviation)
   * @returns The label to display (e.g., boardName) or the value itself if not found
   */
  getLabelForValue(value: FormDropDownValue | FormDropDownOption): string {
    if (value == null || value === '') {
      return '';
    }

    // If bindValue and bindLable are configured, look up the label
    if (this.config.bindValue && this.config.bindLable && this.dropDownValues?.length > 0) {
      // Find the item in dropDownValues that matches the value
      const item = this.dropDownValues.find(
        (item) => item && (item[this.config.bindValue!] as FormDropDownValue) === value
      );

      // Return the label if found (coerce to string to avoid [object Object] for non-string values)
      if (item && this.config.bindLable && item[this.config.bindLable] != null) {
        const raw = item[this.config.bindLable] as FormDropDownValue;
        return typeof raw === 'string' ? raw : String(raw);
      }
    }

    // Fallback: return the value itself (or empty string if value is falsy)
    return value != null && value !== '' ? String(value) : '';
  }

  /**
   * Get the original item object for a value by looking it up in dropDownValues
   * @param value The value to look up
   * @returns The original option object, or undefined if not found
   */
  getItemForValue(value: FormDropDownValue | FormDropDownOption): FormDropDownOption | undefined {
    if (value == null || value === '') {
      return undefined;
    }

    if (this.config.bindValue && this.dropDownValues?.length > 0) {
      // If value is an object, try to match by its bindValue property
      if (typeof value === 'object' && (value as any)[this.config.bindValue] !== undefined) {
        return this.dropDownValues.find(
          (item) => item && (item[this.config.bindValue!] as any) === (value as any)[this.config.bindValue!]
        );
      }

      return this.dropDownValues.find(
        (item) => item && (item[this.config.bindValue!] as FormDropDownValue) === value
      );
    }

    return typeof value === 'object' ? (value as FormDropDownOption) : undefined;
  }
}

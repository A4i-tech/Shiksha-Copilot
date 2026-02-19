import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FormDropDownConfig, FormDropDownOption } from '../../interfaces/form-dropdown.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, TranslateModule, MatTooltipModule],
  templateUrl: './form-dropdown.component.html',
  styleUrls: ['./form-dropdown.component.scss'],
})
export class FormDropdownComponent implements OnInit, OnChanges {
  constructor(private readonly sanitizer: DomSanitizer) {}
  /** Options for the dropdown; items may include optional `info` (string) for tooltip. */
  @Input() dropDownValues: FormDropDownOption[] = [];

  @Input() dropDownControlName!: string;

  @Input() dropDownCtrl!: UntypedFormControl;

  @Input() config!: FormDropDownConfig;

  @Input() submitted = false;

  @Input() mode!: string;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();


  formGroupTemp!: UntypedFormGroup;

  /**
   * Angular oninit lifecycle hook used for initialization
   */
  ngOnInit(): void {
    const obj: any = {};
    obj[this.dropDownControlName] = new UntypedFormControl(null);
    this.formGroupTemp = new UntypedFormGroup(obj);
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
    let updatedArr: string[] = structuredClone(this.dropDownCtrl?.value);
    updatedArr = updatedArr.filter(item => item !== this.dropDownCtrl?.value[i]);
    this.dropDownCtrl?.setValue(updatedArr)
    this.valueChange.emit(updatedArr.join());
  }

  /**
   * Function to emit value change
   * @param val 
   */
  valueSelected(val: any) {
    this.valueChange.emit(val);
  }

  public onSelectAll() {
    if (this.config.selectAllValue) {
      let data = this.dropDownValues.map((e) =>
        this.config?.selectAllValue ? e[this.config.selectAllValue] : e
      );
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data.toString());
    } else {
      this.dropDownCtrl.setValue(this.dropDownValues);
      this.valueChange.emit(this.dropDownValues.join());
    }
  }

  public onClearAll() {
    this.dropDownCtrl.setValue([]);
    this.valueChange.emit('');
  }

  toggleSelection(item: any) {
    let currentVal = this.dropDownCtrl?.value;
    const index = currentVal.findIndex((i: any) => i === item);
    if (index === -1) {
      currentVal.push(item);
      this.dropDownCtrl.setValue(currentVal);
    } else {
      currentVal.splice(index, 1);
      this.dropDownCtrl.setValue(currentVal);
    }
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      if (this.config.selectAllValue) {
        let data = this.dropDownValues.map((e) =>
          this.config?.selectAllValue ? e[this.config.selectAllValue] : e
        );
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data.join());
      } else {
        this.dropDownCtrl.setValue(this.dropDownValues);
        this.valueChange.emit(this.dropDownValues.join());
      }
    } else {
      this.dropDownCtrl.setValue([]);
      this.valueChange.emit('');
    }
  }

  isSelectAll() {
    return this.dropDownCtrl.value?.length === this.dropDownValues?.length;
  }

  isSelected(item: any) {
    return this.dropDownCtrl.value.some((i: any) => i === item);
  }

  public get hasSelections(): boolean {
    return this.dropDownCtrl.value?.length > 0;
  }

  /**
   * Sanitizes option info text for safe use in tooltip/aria-label (prevents XSS if info is user/API-sourced).
   */
  getSafeInfo(item: FormDropDownOption): string {
    const raw = item?.info ?? '';
    if (typeof raw !== 'string') return '';
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, raw);
    return sanitized ?? '';
  }

  /**
   * Get the display label for a value by looking it up in dropDownValues
   * @param value The value to look up (e.g., abbreviation)
   * @returns The label to display (e.g., boardName) or the value itself if not found
   */
  getLabelForValue(value: any): string {
    if (value == null || value === '') {
      return '';
    }

    // If bindValue and bindLable are configured, look up the label
    if (this.config.bindValue && this.config.bindLable && this.dropDownValues?.length > 0) {
      // Find the item in dropDownValues that matches the value
      const item = this.dropDownValues.find(
        (item) => item && item[this.config.bindValue!] === value
      );

      // Return the label if found (coerce to string to avoid [object Object] for non-string values)
      if (item && this.config.bindLable && item[this.config.bindLable] != null) {
        const raw = item[this.config.bindLable];
        return typeof raw === 'string' ? raw : String(raw);
      }
    }

    // Fallback: return the value itself (or empty string if value is falsy)
    return value != null && value !== '' ? String(value) : '';
  }
}

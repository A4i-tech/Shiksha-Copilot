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
  private static nextId = 0;
  inputId = `form-dropdown-${FormDropdownComponent.nextId++}`;

  constructor() { }
  /** Options for the dropdown; items may include optional `info` (string) for tooltip. */
  @Input() dropDownValues: FormDropDownOption[] = [];

  @Input() dropDownControlName!: string;

  @Input() dropDownCtrl!: FormControl;

  @Input() config!: FormDropDownConfig;

  @Input() submitted = false;

  @Input() mode!: string;

  @Output() valueChange: EventEmitter<FormDropDownValue | FormDropDownValue[] | null> = new EventEmitter<FormDropDownValue | FormDropDownValue[] | null>();


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
   * Function to emit value change
   * @param val
   */
  valueSelected(val: FormDropDownValue | FormDropDownValue[] | null) {
    this.valueChange.emit(val);
  }

  public onSelectAll() {
    if (this.config.selectAllValue) {
      const data = this.dropDownValues.map((e) =>
        this.config?.selectAllValue ? (e[this.config.selectAllValue as keyof FormDropDownOption] as FormDropDownValue) : (e as unknown as FormDropDownValue)
      );
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data);
    } else {
      const data = this.dropDownValues.map(e =>
        this.config.bindValue ? (e[this.config.bindValue] as FormDropDownValue) : (e as unknown as FormDropDownValue)
      );
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data);
    }
  }

  public onClearAll() {
    const emptyValue = this.config.multi ? [] : null;
    this.dropDownCtrl.setValue(emptyValue);
    this.valueChange.emit(emptyValue as any);
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
          this.config?.selectAllValue ? (e[this.config.selectAllValue as keyof FormDropDownOption] as FormDropDownValue) : (e as unknown as FormDropDownValue)
        );
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
      } else {
        const data = this.dropDownValues.map(e =>
          this.config.bindValue ? (e[this.config.bindValue] as FormDropDownValue) : (e as unknown as FormDropDownValue)
        );
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
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

}

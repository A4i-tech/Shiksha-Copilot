import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropDownConfig, DropdownValue } from '../../interfaces/dropdown.interface';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DropdownComponent), multi: true }],
})
export class DropdownComponent implements AfterViewInit, ControlValueAccessor {
  private static nextId = 0;
  readonly inputId = `dropdown-${DropdownComponent.nextId++}`;
  private readonly internalControl = new FormControl<DropdownValue | DropdownValue[] | null>(null);

  constructor(private translateService: TranslateService) {}

  get isEnglishActive(): boolean {
    return (this.translateService.currentLang || this.translateService.defaultLang) === 'en';
  }

  @Input() dropDownValues: Record<string, unknown>[] = [];
  @Input() dropDownCtrl?: FormControl;
  @Input() config!: DropDownConfig;
  @Input() submitted = false;
  @Input() mode = '';
  @ViewChild(NgSelectComponent) select!: NgSelectComponent;

  @Output() valueChange = new EventEmitter<unknown>();
  @Output() valueUpdate = new EventEmitter<DropdownValue | DropdownValue[] | null>();

  onChange: (value: DropdownValue | DropdownValue[] | null) => void = () => {};
  onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.select.searchInput.nativeElement.autocomplete = 'new-password';
  }

  get control(): FormControl { return this.dropDownCtrl ?? this.internalControl; }
  get labelText(): string { return this.config.fieldName || this.config.labelTxt || this.config.placeHolderTxt; }
  get selectedItem(): DropdownValue | DropdownValue[] | null { return this.control.value; }
  set selectedItem(value: DropdownValue | DropdownValue[] | null) { this.control.setValue(value, { emitEvent: false }); }

  writeValue(value: DropdownValue | DropdownValue[] | null): void { this.internalControl.setValue(value, { emitEvent: false }); }
  registerOnChange(fn: (value: DropdownValue | DropdownValue[] | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(disabled: boolean): void {
    if (disabled) this.internalControl.disable({ emitEvent: false });
    else this.internalControl.enable({ emitEvent: false });
  }

  valueSelected(selectedOption: unknown): void {
    this.emit(this.control.value, selectedOption);
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const value = checked ? this.allValues() : [];
    this.control.setValue(value);
    this.emit(value, value);
  }

  isSelectAll(): boolean {
    return this.control.value?.length === this.dropDownValues.length;
  }

  private emit(value: DropdownValue | DropdownValue[] | null, selectedOption: unknown): void {
    this.onChange(value);
    this.valueChange.emit(selectedOption);
    this.valueUpdate.emit(value);
  }

  private allValues(): DropdownValue[] {
    const valueKey = this.config.selectAllValue || this.config.bindValue;
    if (!valueKey) return this.dropDownValues as unknown as DropdownValue[];
    return this.dropDownValues.map((option) => option[valueKey] as DropdownValue);
  }
}

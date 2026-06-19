/**
 * Specific type for dropdown values to avoid generic 'any' behavior.
 */
export type FormDropDownValue = string | number;

/**
 * Option item for dropdown; used to define the structure of items passed to the FormDropdownComponent's dropDownValues.
 */
export interface FormDropDownOption {
  name: string;
  value: FormDropDownValue;
  info?: string;
  [key: string]: unknown;
}

/**
 * Configuration object for the FormDropdownComponent.
 * Specifies behavior, appearance, and bind properties for the dropdown.
 */
export interface FormDropDownConfig {
  isBackground: boolean;
  height: string;
  placeHolderTxt: string;
  disabled?: boolean;
  fieldName: string;
  multi?: boolean;
  clearableOff?: boolean;
  hideLabel?: boolean;
  searchable?: boolean;
  hideChips?: boolean;
  bindLable?: string;
  bindValue?: string;
  chipValueType?: string;
  chipClearableOff?: boolean;
  selectAllOption?: boolean;
  selectAllValue?: string;
  required?: boolean;
  openOnSelect?: boolean;
}

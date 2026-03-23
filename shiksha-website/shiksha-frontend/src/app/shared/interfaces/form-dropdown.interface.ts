/**
 * Option item for dropdown; may include optional `info` (string) for tooltip.
 * When `info` comes from user or API input, it is sanitized before use in the UI.
 */
export interface FormDropDownOption {
  name?: string;
  value?: string;
  info?: string;
  [key: string]: unknown;
}

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
  chipClearableOff?:boolean;
  selectAllOption?:boolean;
  selectAllValue?:string;
  required?: boolean;
  openOnSelect?: boolean;
}

export type DropdownValue = string | number;

export interface DropdownOption {
  name: string;
  value: DropdownValue;
  info?: string;
  [key: string]: unknown;
}

export interface DropDownConfig {
  isBackground: boolean;
  placeHolderTxt: string;
  disabled?: boolean;
  fieldName?: string;
  labelTxt?: string;
  info?: string;
  multi?: boolean;
  clearableOff?: boolean;
  hideLabel?: boolean;
  searchable?: boolean;
  addTag?: boolean;
  wrapValue?: boolean;
  bindLabel?: string;
  bindValue?: string;
  selectAllOption?: boolean;
  selectAllValue?: string;
  required?: boolean;
  openOnSelect?: boolean;
}

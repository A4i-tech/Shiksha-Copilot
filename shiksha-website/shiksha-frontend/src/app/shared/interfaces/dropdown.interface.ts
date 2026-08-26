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
  showDescription?: boolean;
  selectAllOption?: boolean;
  selectAllValue?: string;
  required?: boolean;
  openOnSelect?: boolean;
  // Set when placeHolderTxt/labelTxt/fieldName is already-resolved display text
  // (e.g. from getLabel) rather than a translation key, so it isn't re-translated.
  skipTranslate?: boolean;
}

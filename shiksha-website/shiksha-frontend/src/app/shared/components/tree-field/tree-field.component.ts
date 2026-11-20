import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { GROUP_KEYS, SLOT_KEYS, isObject } from '../../utility/section-content.util';

// Same blank shape as the last item. An activity id takes the given number.
function blankLike(value: any, number = 0): any {
  if (Array.isArray(value)) return value.map((item) => blankLike(item));
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        GROUP_KEYS.includes(key) ? item : key === 'id' ? `${(item as string).replace(/\d+$/, '')}${number}` : blankLike(item),
      ])
    );
  }
  return '';
}

// One past the highest id number in the list, so a removed id never repeats.
const nextNumber = (items: any[]) => Math.max(0, ...items.map((item) => Number(`${item.id}`.match(/\d+$/)?.[0] ?? 0))) + 1;

@Component({
  selector: 'app-tree-field',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './tree-field.component.html',
})
export class TreeFieldComponent {
  /** the object or array that holds the value, so a text edit writes back in place */
  @Input() parent: any;
  @Input() key!: string | number;
  @Input() label = '';

  get value(): any {
    return this.parent[this.key];
  }

  get isText(): boolean {
    return typeof this.value === 'string';
  }

  get isFixedText(): boolean {
    return this.isText && SLOT_KEYS.includes(`${this.key}`);
  }

  get isObject(): boolean {
    return isObject(this.value);
  }

  get entries(): string[] {
    return Object.keys(this.value);
  }

  // Questions and activities grow and shrink. Difficulty and type groups stay.
  get isRepeatable(): boolean {
    return Array.isArray(this.value) && this.value.every((item) => isObject(item) && !GROUP_KEYS.some((group) => group in item));
  }

  isTextItem(item: any): boolean {
    return typeof item === 'string';
  }

  pretty(key: string | number): string {
    const text = `${key}`.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  itemLabel(index: number): string {
    return `${this.label || this.pretty(this.key)} ${index + 1}`;
  }

  add(): void {
    this.value.push(blankLike(this.value[this.value.length - 1], nextNumber(this.value)));
  }

  remove(index: number): void {
    this.value.splice(index, 1);
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentChange, QuillModule } from 'ngx-quill';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const MARKED_OPTIONS = { async: false as const, breaks: true };

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
gfm(turndown);

// Prevent turndown from escaping underscores inside math spans ($...$)
turndown.addRule('math-inline', {
  filter(node) {
    return node.nodeName === 'SPAN' && /^\$[^$]/.test(node.textContent ?? '');
  },
  replacement(content) {
    return content;
  },
});

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
];

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnChanges {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  htmlContent: string = '';
  modules = { toolbar: TOOLBAR };
  private userHasEdited = false;
  private lastEmittedValue = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && (!this.userHasEdited || this.value !== this.lastEmittedValue)) {
      this.userHasEdited = false;
      this.htmlContent = marked.parse(this.value ?? '', MARKED_OPTIONS);
    }
  }

  onContentChanged(event: ContentChange) {
    if (event.source !== 'user') return;
    this.userHasEdited = true;
    if (!event.html) {
      this.lastEmittedValue = '';
      this.valueChange.emit('');
      return;
    }
    const markdown = turndown.turndown(event.html);
    this.lastEmittedValue = markdown;
    this.valueChange.emit(markdown);
  }
}

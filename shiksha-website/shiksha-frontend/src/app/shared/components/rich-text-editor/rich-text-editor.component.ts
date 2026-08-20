import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentChange, QuillModule } from 'ngx-quill';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const renderer = new marked.Renderer();
renderer.del = (text) => `<s>${text}</s>`;

const MARKED_OPTIONS = { async: false as const, breaks: true, renderer };

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
gfm(turndown);

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
];

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [FormsModule, QuillModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnChanges {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  htmlContent: string = '';
  modules = { toolbar: TOOLBAR };
  private lastEmittedValue = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.value !== this.lastEmittedValue) {
      this.htmlContent = marked.parse(this.value ?? '', MARKED_OPTIONS);
    }
  }

  onContentChanged(event: ContentChange) {
    if (event.source !== 'user') return;
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

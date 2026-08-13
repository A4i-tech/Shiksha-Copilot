import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-objective-label',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './objective-label.component.html',
})
export class ObjectiveLabelComponent {
  @Input() fullName: string = '';
  @Input() shortName: string = '';

  helpOpen = false;

  get hasAbbreviation(): boolean {
    return !!this.shortName && this.shortName !== this.fullName;
  }
}

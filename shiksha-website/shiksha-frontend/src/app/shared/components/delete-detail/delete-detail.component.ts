import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { A11yModule } from '@angular/cdk/a11y';

export interface DeleteDetailConfig {
  heading: string;
  confirmationText: string;
  primaryButtonLabel: string;
  primaryButtonType: string;
  cancelButtonLabel?:string;
  secondaryButtonLabel?: string;
  secondaryButtonType?: string;
  idleTime?:number
}

@Component({
  selector: 'app-delete-detail',
  standalone:true,
  imports:[TranslateModule, CommonModule, A11yModule],
  templateUrl: './delete-detail.component.html',
  styleUrls: ['./delete-detail.component.scss']
})
export class DeleteDetailComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<string>();

  @Input() config!: DeleteDetailConfig;

  @Input() showCancelBtn = true;

  private previousActiveElement: HTMLElement | null = null;

  ngOnInit() {
    this.previousActiveElement = document.activeElement as HTMLElement;
  }

  ngOnDestroy() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.showCancelBtn) {
      this.closePopUp('close');
    }
  }

  closePopUp(val?:any) {
    this.close.emit(val);
  }

  onPrimaryAction() {
    this.close.emit(this.config.primaryButtonType);
  }
}

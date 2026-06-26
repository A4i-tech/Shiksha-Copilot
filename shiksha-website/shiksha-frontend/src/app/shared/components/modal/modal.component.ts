import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ModalService } from './modal.service';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone:true,
  imports:[CommonModule, A11yModule]
})
export class ModalComponent implements OnInit, OnDestroy {
  private previousActiveElement: HTMLElement | null = null;

  constructor(private modalService: ModalService){}

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
    this.closeModal();
  }

  closeModal(){
    this.modalService.showDeleteUserDialog = false;
    this.modalService.showRenegenerateDialog = false;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

}

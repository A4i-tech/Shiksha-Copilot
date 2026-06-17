import { Component, EventEmitter, Input, OnInit, OnDestroy, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../modal/modal.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-disable-popup',
  standalone: true,
  imports: [CommonModule, A11yModule],
  templateUrl: './disable-popup.component.html',
  styleUrls: ['./disable-popup.component.scss']
})
export class DisablePopupComponent implements OnInit, OnDestroy {
  private previousActiveElement: HTMLElement | null = null;

  ngOnInit(): void {
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

  @Input() modalHeader!:string;

  @Input() modalSubHeader!:string;

  @Input() tableData:any;

  @Input() users_of_school: any;

  @Output() sendDetails = new EventEmitter<void>();


  /**
   * Class constructor
   * @param modalService ModalService
   */
  constructor(private modalService: ModalService, public toast:UtilityService){}

  /**
   * Function to close popup
   */
  closeModal(){  
    this.modalService.showDeleteUserDialog=false;
  }

  /**
   * Function to disable user
   */
  disableUser(){    
    this.sendDetails.emit(this.tableData);

    this.modalService.showDeleteUserDialog = false;
  }

}

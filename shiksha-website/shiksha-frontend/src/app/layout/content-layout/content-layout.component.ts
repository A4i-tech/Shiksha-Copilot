import { Component } from '@angular/core';
import { LoaderMessageService } from '../../core/services/loader-message.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent {
  isSidebarOpen: boolean = false;

  constructor(public loaderMessage: LoaderMessageService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

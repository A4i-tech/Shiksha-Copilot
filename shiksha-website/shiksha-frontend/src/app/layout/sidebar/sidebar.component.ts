import { Component,effect } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuItem } from 'src/app/shared/interfaces/menu.interface';
import { menuItem } from 'src/app/shared/utility/sidebar.util';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']  
})
export class SidebarComponent {
  isSidebarOpen: boolean = false;
  menuItems: MenuItem[] = menuItem;
  
  /**
   * Class constructor
   * @param router Router
   * @param utilitService UtilityService
   * @param sidebarService SidebarService
   */
  constructor(
    private router: Router,
    public utilitService: UtilityService,
    public sidebarService: SidebarService
  ) {
    effect(() => this.isSidebarOpen = this.sidebarService.sidebarOpen());
  }

  closeSidebar(event: MouseEvent) {
    event?.stopPropagation();
    this.sidebarService.sidebarOpen.set(false);
    this.sidebarService.headerOptionShow.set(false);
  }

  /**
   * Function to which match the current route with the substring provided
   * @param substring
   * @returns
   */
  isActive(substring: any): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes(substring);
  }
}

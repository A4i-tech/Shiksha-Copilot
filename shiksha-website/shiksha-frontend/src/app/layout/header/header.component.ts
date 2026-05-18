import { Component, HostListener, OnDestroy, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;

  showLogoutConfirm!: boolean;
  activeGenerationCount = 0;
  private generationStatusStream: EventSource | null = null;
  private generationStatusReconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Class constructor
   * @param sidebarService 
   * @param utilityService 
   */
  constructor(
    public sidebarService: SidebarService,
    public utilityService: UtilityService,
    public router: Router
  ) {

    effect(()=>{
      if(!this.sidebarService.headerOptionShow()){
        this.isMenuOpen = false
      }
    })
  }

  ngOnInit(): void {
    if (this.utilityService.hasPermission(['power'])) {
      this.connectGenerationStatusStream();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if(this.isMenuOpen){
      this.sidebarService.headerOptionShow.set(true)
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.isMenuOpen = false;
    }
  }

  openSidebar() {
    this.sidebarService.sidebarOpen.set(true);
  }

  openModalForLogoutConfirm(){
    this.showLogoutConfirm = true;
  }

  closeModal(value: string) {
    if (value === 'logout') {
      this.utilityService.logout();      
    }
    this.showLogoutConfirm = false;
  }

  private async connectGenerationStatusStream() {
    this.clearGenerationStatusStream();

    const res = await fetch(`${environment.apiUrl}/presentation/events/token`, {method: "POST", headers: {"Authorization": localStorage.getItem('token') || ""}});
    const token = await res.text();

    this.generationStatusStream = new EventSource(`${environment.apiUrl}/presentation/events/${token}`);

    this.generationStatusStream.onmessage = (event: MessageEvent<string>) => {
      const count = Number(event.data);
      this.activeGenerationCount = Number.isFinite(count) ? count : 0;
    };

    this.generationStatusStream.onerror = () => {
      this.clearGenerationStatusStream();
      this.generationStatusReconnectTimeout = setTimeout(() => this.connectGenerationStatusStream(), 5000);
    };
  }

  private clearGenerationStatusStream() {
    if (this.generationStatusStream) {
      this.generationStatusStream.close();
      this.generationStatusStream = null;
    }
    if (this.generationStatusReconnectTimeout) {
      clearTimeout(this.generationStatusReconnectTimeout);
      this.generationStatusReconnectTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.clearGenerationStatusStream();
  }
}

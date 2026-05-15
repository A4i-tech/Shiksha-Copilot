import { Component, HostListener, OnDestroy, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ContentGenerationService } from 'src/app/view/user/content-generation/content-generation.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly generationStatusPollMs = 5000;

  isMenuOpen = false;

  showLogoutConfirm!: boolean;
  activeGenerationCount = 0;
  private generationStatusTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Class constructor
   * @param sidebarService 
   * @param utilityService 
   */
  constructor(
    public sidebarService: SidebarService,
    public utilityService: UtilityService,
    public router: Router,
    private contentGenerationService: ContentGenerationService
  ) {

    effect(()=>{
      if(!this.sidebarService.headerOptionShow()){
        this.isMenuOpen = false
      }
    })
  }

  ngOnInit(): void {
    if (this.utilityService.hasPermission(['power'])) {
      this.loadActiveGenerationCount();
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

  private loadActiveGenerationCount() {
    this.clearGenerationStatusPolling();
    const currentMonth = this.getCurrentMonth();
    const params = {
      currentPage: 1,
      pageSize: 6,
      selectedType: 'all',
      selectedMonth: currentMonth.split('-')[1],
      presentationMonth: currentMonth,
      isGenerated: 'true',
    };

    forkJoin({
      lessonList: this.contentGenerationService.getAllList(params).pipe(catchError(_ => of(null))),
      presentationList: this.contentGenerationService.getPresentationJobs(params).pipe(catchError(_ => of([]))),
    }).subscribe({
      next: (res: any) => {
        const lessonCount = Array.isArray(res.lessonList?.data)
          ? res.lessonList.data.filter((item: any) => item.status === 'running').length
          : 0;
        const presentationCount = Array.isArray(res.presentationList)
          ? res.presentationList.filter((item: any) => !['complete', 'idle', 'error'].includes(item.status)).length
          : 0;
        this.activeGenerationCount = lessonCount + presentationCount;
        this.generationStatusTimeout = setTimeout(() => this.loadActiveGenerationCount(), this.generationStatusPollMs);
      },
      error: () => {
        this.generationStatusTimeout = setTimeout(() => this.loadActiveGenerationCount(), this.generationStatusPollMs);
      }
    });
  }

  private clearGenerationStatusPolling() {
    if (!this.generationStatusTimeout) return;
    clearTimeout(this.generationStatusTimeout);
    this.generationStatusTimeout = null;
  }

  private getCurrentMonth(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${today.getFullYear()}-${month}`;
  }

  ngOnDestroy(): void {
    this.clearGenerationStatusPolling();
  }
}

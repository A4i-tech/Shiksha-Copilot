import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { UtilityService } from 'src/app/core/services/utility.service';

interface VideoItem {
  title: string;
  link: SafeResourceUrl;
}

interface VideoSection {
  videos: VideoItem[];
  badgeText: string;
  badgeClass: string;
  titleKey: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class HelpComponent {
  readonly activeSection: VideoSection;

  private readonly kannadaVideos: VideoItem[] = [
    { title: 'User Registration', link: this.utilityService.trustUrl('https://youtu.be/qsGd7vCfceo') },
    { title: 'Content Generation', link: this.utilityService.trustUrl('https://youtu.be/qlma8Ah08MY') },
    { title: 'Learning Outcomes', link: this.utilityService.trustUrl('https://youtu.be/1pSDq3UMFk4') },
    { title: 'Lesson Resources', link: this.utilityService.trustUrl('https://youtu.be/GgRNcouN7GU') },
    { title: 'My Schedules', link: this.utilityService.trustUrl('https://youtu.be/NoUajPGaoTE') },
    { title: 'Dashboard Overview', link: this.utilityService.trustUrl('https://youtu.be/cCSbQAAW3vo') },
    { title: 'Chatbot Assistance', link: this.utilityService.trustUrl('https://youtu.be/pVsWGb04Rrs') },
    { title: 'Lesson Plan Regeneration', link: this.utilityService.trustUrl('https://youtu.be/-v0IobwLfZs') },
    { title: 'Question Paper Generation', link: this.utilityService.trustUrl('https://youtu.be/CS7hr4j4w6Y') },
  ];

  private readonly teluguVideos: VideoItem[] = [
    { title: 'User Registration (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/DWhDVAWOWrE?si=x6BFiE63zzXy6Lch') },
    { title: 'Edu Chatbot (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/hrqmDiH8f04?si=aVNnysH5Vrv1Rcol') },
    { title: 'Content Generation (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/T0v9EoG6iSc?si=T4Av2UjDnc64GdQ0') },
    { title: 'Lesson Plan explanation (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/UqNXHuBPskA?si=ApZDuHcjlgnc7vZP') },
    { title: 'Lesson Resources (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/Jft0FU_2j2M?si=Sode9g7uiXXm0Sdq') },
    { title: 'Question Paper Generation (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/i4v1B6KcSSk?si=CLAd0NntadCfWVyy') },
    { title: 'My Schedules (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/o3eiDeomKHo?si=9xOY80yZW0V12as9') },
    { title: 'Dashboard Overview (Telugu)', link: this.utilityService.trustUrl('https://youtu.be/2oDRVCRVGKM?si=PrGar2kwrTa0citt') },
  ];

  constructor(private utilityService: UtilityService) {
    this.activeSection = this.buildSection();
  }

  private buildSection(): VideoSection {
    const state: string = this.utilityService.loggedInUserData?.state ?? '';
    if (state === 'Telangana') {
      return {
        videos: this.teluguVideos,
        badgeText: 'తెలుగు',
        badgeClass: 'badge-telugu',
        titleKey: 'Telugu Videos',
      };
    }
    // Default: Karnataka + any other state → Kannada
    return {
      videos: this.kannadaVideos,
      badgeText: 'ಕನ್ನಡ',
      badgeClass: 'badge-kannada',
      titleKey: 'Videos',
    };
  }
}

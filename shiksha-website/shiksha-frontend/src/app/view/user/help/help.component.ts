import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { UtilityService } from 'src/app/core/services/utility.service';

interface Video { title: string; link: SafeResourceUrl; }

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class HelpComponent {
  readonly isTelangana = (this.utilityService.loggedInUserData.school?.state || this.utilityService.loggedInUserData.profiles.admin?.state) === 'Telangana';
  readonly videos: Video[] = (this.isTelangana ? [
    ['User Registration (Telugu)', 'https://youtu.be/DWhDVAWOWrE'],
    ['Edu Chatbot (Telugu)', 'https://youtu.be/hrqmDiH8f04'],
    ['Content Generation (Telugu)', 'https://youtu.be/T0v9EoG6iSc'],
    ['Lesson Plan explanation (Telugu)', 'https://youtu.be/UqNXHuBPskA'],
    ['Lesson Resources (Telugu)', 'https://youtu.be/Jft0FU_2j2M'],
    ['Question Paper Generation (Telugu)', 'https://youtu.be/i4v1B6KcSSk'],
    ['My Schedules (Telugu)', 'https://youtu.be/o3eiDeomKHo'],
    ['Dashboard Overview (Telugu)', 'https://youtu.be/2oDRVCRVGKM'],
  ] : [
    ['User Registration', 'https://youtu.be/qsGd7vCfceo'],
    ['Content Generation', 'https://youtu.be/qlma8Ah08MY'],
    ['Learning Outcomes', 'https://youtu.be/1pSDq3UMFk4'],
    ['Lesson Resources', 'https://youtu.be/GgRNcouN7GU'],
    ['My Schedules', 'https://youtu.be/NoUajPGaoTE'],
    ['Dashboard Overview', 'https://youtu.be/cCSbQAAW3vo'],
    ['Chatbot Assistance', 'https://youtu.be/pVsWGb04Rrs'],
    ['Lesson Plan Regeneration', 'https://youtu.be/-v0IobwLfZs'],
    ['Question Paper Generation', 'https://youtu.be/CS7hr4j4w6Y'],
  ]).map(([title, url]) => ({ title, link: this.utilityService.trustUrl(url) }));

  constructor(private utilityService: UtilityService) {}
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProfileImageComponent implements OnChanges {
  @Input() profileImage: any;

  @Input() size: any;

  imageFailed = false;

  constructor(private utilityService: UtilityService) {}

  ngOnChanges(): void {
    this.imageFailed = false;
  }

  get firstCharacter(): string {
    return this.utilityService.loggedInUserData?.identity?.name?.charAt(0).toUpperCase() || '';
  }
}

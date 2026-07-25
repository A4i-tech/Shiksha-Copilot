import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../core/services/utility.service';
import { menuItem } from '../shared/utility/sidebar.util';

@Component({
  standalone: true,
  selector: 'app-landing',
  template: '',
})
export class LandingComponent implements OnInit {
  constructor(private router: Router, private utility: UtilityService) {}

  ngOnInit() {
    const user = this.utility.loggedInUserData;
    if (user.profiles.teacher && !user.profiles.teacher.isProfileCompleted) {
      this.router.navigate(['/profile']);
    } else {
      const item = menuItem.find((item) => this.utility.hasPermission(item.permission));
      if (item) this.router.navigate([item.route]);
    }
  }
}

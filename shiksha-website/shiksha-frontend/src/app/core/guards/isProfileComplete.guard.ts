import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

export const IsProfileCompleteGuard: CanActivateFn = () => {
  const utility = inject(UtilityService);
  const router = inject(Router);

  const teacher = utility.loggedInUserData.profiles.teacher;
  if (!teacher || teacher.isProfileCompleted) return true;
  utility.showWarning('Please complete the profile for further access');
  router.navigate(['/profile']);
  return false;
};

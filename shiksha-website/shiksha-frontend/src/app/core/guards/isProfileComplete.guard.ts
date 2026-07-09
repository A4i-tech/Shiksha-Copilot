import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UtilityService } from '../services/utility.service';

export const IsProfileCompleteGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const data: string = localStorage.getItem('userData') ?? '';
  const loggedInUser = JSON.parse(data);
  const utilityServcie = inject(UtilityService);
  const router = inject(Router);

  // Staff/admin have no teacher profile; only incomplete teachers are blocked.
  const teacher = loggedInUser.profiles.teacher;
  if (!teacher || teacher.isProfileCompleted) {
    return true;
  }
  utilityServcie.showWarning('Please complete the profile for further access');
  router.navigate(['/profile']);
  return false;
};

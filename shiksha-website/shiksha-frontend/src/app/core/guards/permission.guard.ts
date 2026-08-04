import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
} from '@angular/router';
import { UtilityService } from '../services/utility.service';

export const PermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const utility = inject(UtilityService);
  return utility.hasPermission(route.data['permissions']);
};

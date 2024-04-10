import { CanActivateFn } from '@angular/router';

export const preventBackButtonGuard: CanActivateFn = (route, state) => {
  return false;
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function isAuthenticated(): boolean {
  return sessionStorage.getItem('isAuthenticated') === 'true';
}

/** Empty URL (`/`): send to home or login without mounting a page. */
export const rootRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.createUrlTree(isAuthenticated() ? ['/home'] : ['/login']);
};

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (isAuthenticated()) return true;
  return router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (isAuthenticated()) return router.createUrlTree(['/home']);
  return true;
};
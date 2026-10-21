import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessionService } from './session.service';

/**
 * Keeps the pages that write away from a visitor that has not signed in.
 *
 * The guard is a convenience of the interface. The API is public, so the
 * guard is not a security boundary: a client can always call the API
 * directly. A real deployment would have to check the token of the session in
 * the API.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (session.isSignedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

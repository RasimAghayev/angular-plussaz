import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { SessionService } from './session.service';

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('sends a visitor that has not signed in to the sign in page', () => {
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/posts-add' } as never),
    );

    expect(result).toEqual(
      router.createUrlTree(['/login'], { queryParams: { returnUrl: '/posts-add' } }),
    );
  });

  it('lets a signed in visitor through', () => {
    TestBed.inject(SessionService).signIn({
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/posts-add' } as never),
    );

    expect(result).toBe(true);
  });
});

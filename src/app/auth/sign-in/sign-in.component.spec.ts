import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { SessionService } from '../../core/session.service';
import { UserService } from '../../posts/user.service';
import { SignInComponent } from './sign-in.component';

const USERS = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' },
    company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net' },
  },
];

describe('SignInComponent', () => {
  const userService = { list: vi.fn() };
  const router = { navigateByUrl: vi.fn() };

  beforeEach(async () => {
    userService.list.mockReset().mockReturnValue(of(USERS));
    router.navigateByUrl.mockReset();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('does not ask the API when the name is empty', () => {
    const fixture = TestBed.createComponent(SignInComponent);
    fixture.detectChanges();

    fixture.componentInstance['signIn']();

    expect(userService.list).not.toHaveBeenCalled();
  });

  it('keeps the user of the API in the session', () => {
    const fixture = TestBed.createComponent(SignInComponent);
    fixture.detectChanges();

    fixture.componentInstance['form'].setValue({ username: 'Bret' });
    fixture.componentInstance['signIn']();

    const session = TestBed.inject(SessionService);
    expect(session.isSignedIn()).toBe(true);
    expect(session.user()?.username).toBe('Bret');
  });

  it('refuses a name the API does not know', () => {
    const fixture = TestBed.createComponent(SignInComponent);
    fixture.detectChanges();

    fixture.componentInstance['form'].setValue({ username: 'Nobody' });
    fixture.componentInstance['signIn']();

    expect(TestBed.inject(SessionService).isSignedIn()).toBe(false);
    expect(TestBed.inject(NotificationService).errorMessage()).toContain('Nobody');
  });

  it('goes to the list after the sign in', () => {
    const fixture = TestBed.createComponent(SignInComponent);
    fixture.detectChanges();

    fixture.componentInstance['form'].setValue({ username: 'Bret' });
    fixture.componentInstance['signIn']();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/posts-list');
  });
});

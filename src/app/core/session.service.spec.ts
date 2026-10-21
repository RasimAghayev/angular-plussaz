import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

const STORAGE_KEY = 'angular-plussaz.session.v1';

const USER = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
};

describe('SessionService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts without a user', () => {
    const service = TestBed.inject(SessionService);

    expect(service.isSignedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('keeps the user of the session', () => {
    const service = TestBed.inject(SessionService);

    service.signIn(USER);

    expect(service.isSignedIn()).toBe(true);
    expect(service.user()?.username).toBe('Bret');
  });

  it('ends the session', () => {
    const service = TestBed.inject(SessionService);
    service.signIn(USER);

    service.signOut();

    expect(service.isSignedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('reads the session of an earlier visit', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(USER));

    const service = TestBed.inject(SessionService);

    expect(service.user()?.username).toBe('Bret');
  });

  it('ignores a broken entry of the storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');

    const service = TestBed.inject(SessionService);

    expect(service.isSignedIn()).toBe(false);
  });

  it('ignores an entry of the storage that holds no user', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'one' }));

    const service = TestBed.inject(SessionService);

    expect(service.isSignedIn()).toBe(false);
  });
});

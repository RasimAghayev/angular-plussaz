import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../core/api-base-url';
import { NotificationService } from '../core/notification.service';
import { User } from './user.model';
import { UserService } from './user.service';

const BASE = 'https://api.test';

const USER: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031',
  website: 'hildegard.org',
  address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' },
  company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net' },
};

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE },
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('asks the API for the users', () => {
    let received: User[] | undefined;
    service.list().subscribe((users) => (received = users));

    const request = httpMock.expectOne(`${BASE}/users/`);
    expect(request.request.method).toBe('GET');
    request.flush([USER]);

    expect(received).toEqual([USER]);
  });

  it('tells the user when the API fails', () => {
    service.list().subscribe({ error: () => undefined });

    httpMock
      .expectOne(`${BASE}/users/`)
      .flush('not found', { status: 404, statusText: 'Not Found' });

    expect(TestBed.inject(NotificationService).errorMessage()).toBe('not found');
  });
});

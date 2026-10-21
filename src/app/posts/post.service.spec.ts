import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../core/api-base-url';
import { NotificationService } from '../core/notification.service';
import { Post } from './post.model';
import { PostService } from './post.service';

const BASE = 'https://api.test';

const POST: Post = { id: 1, userId: 1, title: 'A title', body: 'A body' };

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE },
      ],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('asks the API for the posts', () => {
    let received: Post[] | undefined;
    service.list().subscribe((posts) => (received = posts));

    const request = httpMock.expectOne(`${BASE}/posts/`);
    expect(request.request.method).toBe('GET');
    request.flush([POST]);

    expect(received).toEqual([POST]);
  });

  it('asks the API for one post', () => {
    let received: Post | undefined;
    service.get(1).subscribe((post) => (received = post));

    const request = httpMock.expectOne(`${BASE}/posts/1`);
    expect(request.request.method).toBe('GET');
    request.flush(POST);

    expect(received).toEqual(POST);
  });

  it('sends a new post to the API', () => {
    service.create({ title: 'A title', body: 'A body' }).subscribe();

    const request = httpMock.expectOne(`${BASE}/posts/`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'A title', body: 'A body' });
    request.flush({ ...POST, id: 101 });
  });

  it('sends the change of a post to the API', () => {
    service.update(1, { title: 'A title', body: 'A body' }).subscribe();

    const request = httpMock.expectOne(`${BASE}/posts/1`);
    expect(request.request.method).toBe('PUT');
    request.flush(POST);
  });

  it('asks the API to remove a post', () => {
    service.delete(1).subscribe();

    const request = httpMock.expectOne(`${BASE}/posts/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('repeats a read when the API answers with a server error', async () => {
    service.list().subscribe({ error: () => undefined });

    httpMock
      .expectOne(`${BASE}/posts/`)
      .flush('the server is busy', { status: 500, statusText: 'Server Error' });

    await new Promise((resolve) => setTimeout(resolve, 300));

    httpMock.expectOne(`${BASE}/posts/`).flush([]);
  });

  it('does not repeat a read when the API answers that the post is not there', () => {
    service.get(99).subscribe({ error: () => undefined });

    httpMock
      .expectOne(`${BASE}/posts/99`)
      .flush('not found', { status: 404, statusText: 'Not Found' });

    httpMock.expectNone(`${BASE}/posts/99`);
  });

  it('never repeats a write', () => {
    service.create({ title: 'A title', body: 'A body' }).subscribe({ error: () => undefined });

    httpMock
      .expectOne(`${BASE}/posts/`)
      .flush('the server is busy', { status: 500, statusText: 'Server Error' });

    httpMock.expectNone(`${BASE}/posts/`);
  });

  it('tells the user when the API fails', () => {
    const notification = TestBed.inject(NotificationService);

    service.list().subscribe({ error: () => undefined });
    httpMock
      .expectOne(`${BASE}/posts/`)
      .flush('the post is not there', { status: 404, statusText: 'Not Found' });

    expect(notification.errorMessage()).toBe('the post is not there');
  });

  it('tells the user when the API cannot be reached', async () => {
    const notification = TestBed.inject(NotificationService);

    service.list().subscribe({ error: () => undefined });

    // The read is repeated twice, so the answer of the API comes three times.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const request = httpMock.expectOne(`${BASE}/posts/`);
      request.error(new ProgressEvent('the network is gone'), {
        status: 0,
        statusText: 'Unknown Error',
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    expect(notification.errorMessage()).toContain('could not be reached');
  });
});

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_BASE_URL } from '../core/api-base-url';
import { describeApiError } from '../core/api-error';
import { withReadRetry } from '../core/api-retry';
import { NotificationService } from '../core/notification.service';
import { Post, PostDraft } from './post.model';

/**
 * The posts of the API.
 *
 * A read is repeated when the API is unreachable or answers with a server
 * error. A write is never repeated: a second attempt would create a second
 * post.
 */
@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly notification = inject(NotificationService);

  /** Every post of the API. */
  list(): Observable<Post[]> {
    return withReadRetry(() => this.http.get<Post[]>(this.url('/posts/'))).pipe(
      catchError((error) => this.fail(error)),
    );
  }

  /** One post of the API. */
  get(id: number): Observable<Post> {
    return withReadRetry(() => this.http.get<Post>(this.url(`/posts/${id}`))).pipe(
      catchError((error) => this.fail(error)),
    );
  }

  /** Creates a post. */
  create(draft: PostDraft): Observable<Post> {
    return this.http
      .post<Post>(this.url('/posts/'), draft)
      .pipe(catchError((error) => this.fail(error)));
  }

  /** Updates a post. */
  update(id: number, draft: PostDraft): Observable<Post> {
    return this.http
      .put<Post>(this.url(`/posts/${id}`), draft)
      .pipe(catchError((error) => this.fail(error)));
  }

  /** Removes a post. */
  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(this.url(`/posts/${id}`))
      .pipe(catchError((error) => this.fail(error)));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private fail(error: HttpErrorResponse): Observable<never> {
    const message = describeApiError(error);
    this.notification.setError(message);
    return throwError(() => new Error(message));
  }
}

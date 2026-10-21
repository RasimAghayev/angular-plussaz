import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_BASE_URL } from '../core/api-base-url';
import { describeApiError } from '../core/api-error';
import { withReadRetry } from '../core/api-retry';
import { NotificationService } from '../core/notification.service';
import { User } from './user.model';

/** The users of the API. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly notification = inject(NotificationService);

  /** Every user of the API. */
  list(): Observable<User[]> {
    return withReadRetry(() => this.http.get<User[]>(this.url('/users/'))).pipe(
      catchError((error) => this.fail(error)),
    );
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

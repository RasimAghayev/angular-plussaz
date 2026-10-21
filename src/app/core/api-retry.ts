import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

/** How many times a read is repeated when the API fails. */
export const READ_RETRIES = 2;

/** The pause between two attempts, in milliseconds. */
export const RETRY_DELAY_MS = 250;

/**
 * Whether another attempt is worth it.
 *
 * A read is repeated when the API cannot be reached or answers with a server
 * error. The answer of the API that the resource is not there is final, so it
 * is not repeated.
 */
function isWorthRetrying(error: unknown): boolean {
  return error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500);
}

/**
 * Repeats a read when the API fails.
 *
 * The request is given as a function, so every attempt sends a new request.
 * A write is never passed through this helper: a second attempt would write
 * twice.
 */
export function withReadRetry<T>(request: () => Observable<T>): Observable<T> {
  const attempt = (left: number): Observable<T> =>
    request().pipe(
      catchError((error: unknown) => {
        if (left > 0 && isWorthRetrying(error)) {
          return timer(RETRY_DELAY_MS).pipe(switchMap(() => attempt(left - 1)));
        }
        return throwError(() => error);
      }),
    );

  return attempt(READ_RETRIES);
}

import { HttpErrorResponse } from '@angular/common/http';

/**
 * Turns the answer of the API into a sentence for the user.
 *
 * The API is a public mock, so its answers carry no contract. The helper
 * looks for the two fields the common shapes use, and falls back to the
 * status of the answer.
 */
export function describeApiError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'The API could not be reached. Check the network and the address of the API.';
  }

  const body = error.error as { detail?: string; message?: string } | string | null;

  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  if (body && typeof body === 'object') {
    if (typeof body.detail === 'string' && body.detail.length > 0) {
      return body.detail;
    }
    if (typeof body.message === 'string' && body.message.length > 0) {
      return body.message;
    }
  }

  return `The API answered with the status ${error.status}.`;
}

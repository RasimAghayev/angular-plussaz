import { HttpErrorResponse } from '@angular/common/http';

import { describeApiError } from './api-error';

describe('describeApiError', () => {
  it('tells the user that the API could not be reached', () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });

    expect(describeApiError(error)).toContain('could not be reached');
  });

  it('uses the body of the answer when it is a text', () => {
    const error = new HttpErrorResponse({ status: 404, error: 'the post is not there' });

    expect(describeApiError(error)).toBe('the post is not there');
  });

  it('uses the field of the answer when it is an object', () => {
    const error = new HttpErrorResponse({ status: 422, error: { detail: 'the title is missing' } });

    expect(describeApiError(error)).toBe('the title is missing');
  });

  it('uses the message of the answer when it is an object', () => {
    const error = new HttpErrorResponse({
      status: 422,
      error: { message: 'the title is missing' },
    });

    expect(describeApiError(error)).toBe('the title is missing');
  });

  it('falls back to the status of the answer', () => {
    const error = new HttpErrorResponse({ status: 500 });

    expect(describeApiError(error)).toBe('The API answered with the status 500.');
  });
});

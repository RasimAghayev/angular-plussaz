import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('shows the message of a success', () => {
    service.setSuccess('The post was created.');

    expect(service.successMessage()).toBe('The post was created.');
    expect(service.errorMessage()).toBeNull();
  });

  it('shows the message of a failure', () => {
    service.setError('The API could not be reached.');

    expect(service.errorMessage()).toBe('The API could not be reached.');
    expect(service.successMessage()).toBeNull();
  });

  it('drops the message of a success when a failure arrives', () => {
    service.setSuccess('The post was created.');
    service.setError('The API could not be reached.');

    expect(service.successMessage()).toBeNull();
    expect(service.errorMessage()).toBe('The API could not be reached.');
  });

  it('drops both messages', () => {
    service.setSuccess('The post was created.');
    service.clear();

    expect(service.successMessage()).toBeNull();
    expect(service.errorMessage()).toBeNull();
  });
});

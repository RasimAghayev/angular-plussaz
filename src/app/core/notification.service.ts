import { Injectable, signal } from '@angular/core';

/**
 * The messages the application shows to the user.
 *
 * The messages live in signals, so the interface reads them without a
 * subscription and the change detection of the zoneless application reacts to
 * them.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly success = signal<string | null>(null);
  private readonly error = signal<string | null>(null);

  /** The message of a successful action, or null. */
  readonly successMessage = this.success.asReadonly();

  /** The message of a failed action, or null. */
  readonly errorMessage = this.error.asReadonly();

  /** Shows the message of a successful action and drops the message of a failure. */
  setSuccess(message: string): void {
    this.error.set(null);
    this.success.set(message);
  }

  /** Shows the message of a failed action and drops the message of a success. */
  setError(message: string): void {
    this.success.set(null);
    this.error.set(message);
  }

  /** Drops both messages. */
  clear(): void {
    this.success.set(null);
    this.error.set(null);
  }
}

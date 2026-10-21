import { Injectable, computed, signal } from '@angular/core';

import { SessionUser } from './session-user';

const STORAGE_KEY = 'angular-plussaz.session.v1';

/**
 * The session of the demonstration.
 *
 * The application talks to a public mock API that has no authentication at
 * all, so the session is a convenience of the interface and not a security
 * boundary: the name of the user is kept in the storage of the browser, in
 * plain text, and it holds nothing secret. A real deployment would keep a
 * token of the API here instead, and the API would check it.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly state = signal<SessionUser | null>(this.read());

  /** The user of the session, or null when there is none. */
  readonly user = this.state.asReadonly();

  /** Whether a user is signed in. */
  readonly isSignedIn = computed(() => this.state() !== null);

  /** Starts the session of the given user. */
  signIn(user: SessionUser): void {
    this.state.set(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // The storage of the browser can be refused. The session then lives as
      // long as the tab is open.
    }
  }

  /** Ends the session. */
  signOut(): void {
    this.state.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to do: the state of the session is already gone.
    }
  }

  private read(): SessionUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Partial<SessionUser>;
      if (typeof parsed?.id !== 'number' || typeof parsed?.username !== 'string') {
        return null;
      }
      return {
        id: parsed.id,
        name: typeof parsed.name === 'string' ? parsed.name : parsed.username,
        username: parsed.username,
        email: typeof parsed.email === 'string' ? parsed.email : '',
      };
    } catch {
      // A broken or unreadable entry is the same as no session at all.
      return null;
    }
  }
}

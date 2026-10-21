import { Injectable, computed, signal } from '@angular/core';

import { environment } from '../../environments/environment';

/** The shape of the configuration file the deployment may place next to the application. */
export interface RuntimeConfig {
  apiBaseUrl?: string;
}

/**
 * The configuration of the running application.
 *
 * The file `config.json` is optional. When the web server cannot deliver it,
 * the address that was compiled into the bundle is used, so the application
 * starts in every environment.
 */
@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly config = signal<RuntimeConfig>({});

  /** The address of the API. */
  readonly apiBaseUrl = computed(() => this.config().apiBaseUrl ?? environment.apiBaseUrl);

  /**
   * Reads the configuration file.
   *
   * The file is asked for relative to the base of the application, so the
   * application keeps working under a path other than the root of the host.
   */
  async load(): Promise<void> {
    try {
      const response = await fetch(new URL('config.json', document.baseURI), { cache: 'no-store' });
      if (!response.ok) {
        return;
      }
      const body = (await response.json()) as RuntimeConfig;
      if (typeof body?.apiBaseUrl === 'string' && body.apiBaseUrl.length > 0) {
        this.config.set(body);
      }
    } catch {
      // The configuration file is optional. A missing or broken file leaves the
      // compiled address in place.
    }
  }
}

/**
 * The address of the JSON API the application talks to.
 *
 * The value is read from the runtime configuration of the deployment, so the
 * same image can be pointed at another API without a new build. When the
 * deployment carries no configuration, the address compiled into the bundle is
 * used.
 */
import { InjectionToken, inject } from '@angular/core';

import { RuntimeConfigService } from './runtime-config.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => inject(RuntimeConfigService).apiBaseUrl(),
});

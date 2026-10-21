import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { RuntimeConfigService } from './core/runtime-config.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // The fetch backend is the one the zoneless application needs: it reports
    // the answers of the network to the change detection.
    provideHttpClient(withFetch()),
    // The address of the API is read before the first page is drawn, so no
    // request leaves the browser with the wrong address.
    provideAppInitializer(() => inject(RuntimeConfigService).load()),
  ],
};

import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationService } from './core/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly notification = inject(NotificationService);

  constructor() {
    // A message stays on the screen for five seconds and then disappears. The
    // timer is cancelled when a new message arrives, so the messages do not
    // disappear earlier than their own five seconds.
    effect((onCleanup) => {
      const message = this.notification.successMessage() ?? this.notification.errorMessage();
      if (!message) {
        return;
      }
      const timer = setTimeout(() => this.notification.clear(), 5000);
      onCleanup(() => clearTimeout(timer));
    });
  }
}

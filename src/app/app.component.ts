import { NotificationService } from './notification.service';
import { Component, isDevMode } from '@angular/core';
import { tap } from 'rxjs';
import { LocalService } from './local.service';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-PlussAz';
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap((message) => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 5000);
      }
    })
  );
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap((message) => {
      if (message) {
      setTimeout(() => {
        this.notificationService.clearAllMessages();
      }, 5000);
    }
    })
  );

  constructor(
    private notificationService: NotificationService,
    private localStore: LocalService
  ) {}
  ngOnInit(): void {
    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }
    this.localStore.saveData(false,'id', 'jk123');
  }
}

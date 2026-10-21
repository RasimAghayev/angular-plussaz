import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly session = inject(SessionService);
  protected readonly title = 'Angular PlussAz';

  private readonly router = inject(Router);

  protected signOut(): void {
    this.session.signOut();
    this.router.navigateByUrl('/posts-list');
  }
}

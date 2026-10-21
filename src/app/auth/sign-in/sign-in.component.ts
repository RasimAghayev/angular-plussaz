import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../../core/notification.service';
import { SessionService } from '../../core/session.service';
import { UserService } from '../../posts/user.service';

/**
 * The sign in of the demonstration.
 *
 * The API is a public mock and has no accounts, so there is nothing to
 * authenticate. The page asks for the name of a user of the API and keeps it
 * in the session. That is a convenience of the interface, not a security
 * boundary: the API answers every caller.
 */
@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly session = inject(SessionService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(200)]],
  });

  protected readonly submitting = signal(false);

  protected signIn(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const username = this.form.getRawValue().username.trim();
    if (username.length === 0) {
      this.form.controls.username.setErrors({ required: true });
      return;
    }

    this.submitting.set(true);

    this.userService.list().subscribe({
      next: (users) => {
        this.submitting.set(false);
        const user = users.find((candidate) => candidate.username === username);

        if (!user) {
          this.notification.setError(`The API knows no user called "${username}".`);
          return;
        }

        this.session.signIn({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        });
        this.notification.setSuccess(`Signed in as ${user.name}.`);
        this.router.navigateByUrl(this.returnUrl());
      },
      error: () => this.submitting.set(false),
    });
  }

  /**
   * The page the visitor wanted to see before the guard sent them here.
   *
   * Only a path of this application is accepted, so the parameter cannot send
   * the visitor to another host.
   */
  private returnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl && returnUrl.startsWith('/') ? returnUrl : '/posts-list';
  }
}

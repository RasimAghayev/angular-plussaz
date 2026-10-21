import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService } from '../../core/notification.service';
import { PostService } from '../post.service';

/** The page that creates a post. */
@Component({
  selector: 'app-posts-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.component.html',
})
export class AddPostComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    body: ['', [Validators.required, Validators.maxLength(500)]],
  });

  protected readonly submitting = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.postService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notification.setSuccess('The post was created.');
        this.router.navigateByUrl('/posts-list');
      },
      error: () => this.submitting.set(false),
    });
  }
}

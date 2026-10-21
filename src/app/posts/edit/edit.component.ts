import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../../core/notification.service';
import { PostService } from '../post.service';

/** The page that updates a post. */
@Component({
  selector: 'app-posts-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './edit.component.html',
})
export class EditPostComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    body: ['', [Validators.required, Validators.maxLength(500)]],
  });

  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly postId = signal<number | null>(null);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const raw = params.get('id');
      const id = Number(raw);

      if (!raw || !Number.isInteger(id) || id <= 0) {
        this.notification.setError('The address of the post carries no number of a post.');
        this.router.navigateByUrl('/posts-list');
        return;
      }

      this.postId.set(id);
      this.load(id);
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.postId();
    if (id === null) {
      return;
    }

    this.submitting.set(true);

    this.postService.update(id, this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notification.setSuccess('The post was updated.');
        this.router.navigateByUrl('/posts-list');
      },
      error: () => this.submitting.set(false),
    });
  }

  private load(id: number): void {
    this.loading.set(true);

    this.postService.get(id).subscribe({
      next: (post) => {
        this.form.setValue({ title: post.title, body: post.body });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/posts-list');
      },
    });
  }
}

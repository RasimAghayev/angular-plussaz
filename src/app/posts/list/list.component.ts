import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PaginationComponent } from '../../components/pagination/pagination.component';
import { NotificationService } from '../../core/notification.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';

/** How many posts a page holds. */
const PAGE_SIZE = 10;

/** The list of the posts of the API. */
@Component({
  selector: 'app-posts-list',
  imports: [RouterLink, PaginationComponent],
  templateUrl: './list.component.html',
})
export class ListPostsComponent {
  private readonly postService = inject(PostService);
  private readonly notification = inject(NotificationService);

  protected readonly posts = signal<Post[]>([]);
  protected readonly loading = signal(true);
  protected readonly page = signal(1);
  protected readonly pageSize = PAGE_SIZE;

  /** The posts of the page that is on the screen. */
  protected readonly pagePosts = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.posts().slice(start, start + this.pageSize);
  });

  constructor() {
    this.postService.list().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected deletePost(post: Post): void {
    this.postService.delete(post.id).subscribe({
      next: () => {
        this.posts.update((posts) => posts.filter((candidate) => candidate.id !== post.id));
        this.notification.setSuccess(`The post "${post.title}" was removed.`);
      },
    });
  }

  protected goToPage(page: number): void {
    this.page.set(page);
  }
}

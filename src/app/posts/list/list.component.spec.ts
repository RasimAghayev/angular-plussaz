import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ListPostsComponent } from './list.component';

@Component({ template: '' })
class DummyComponent {}

const POSTS: Post[] = [
  { id: 1, userId: 1, title: 'The first post', body: 'The first body' },
  { id: 2, userId: 1, title: 'The second post', body: 'The second body' },
];

describe('ListPostsComponent', () => {
  const postService = {
    list: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    postService.list.mockReset().mockReturnValue(of(POSTS));
    postService.delete.mockReset().mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [ListPostsComponent],
      providers: [
        { provide: PostService, useValue: postService },
        provideRouter([
          { path: 'posts-list', component: DummyComponent },
          { path: 'posts-edit/:id', component: DummyComponent },
        ]),
      ],
    }).compileComponents();
  });

  it('shows the posts of the API', async () => {
    const fixture = TestBed.createComponent(ListPostsComponent);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('article').length).toBe(2);
    expect(element.textContent).toContain('The first post');
  });

  it('removes a post from the list', async () => {
    const fixture = TestBed.createComponent(ListPostsComponent);
    await fixture.whenStable();

    fixture.componentInstance['deletePost'](POSTS[0]);
    await fixture.whenStable();

    expect(postService.delete).toHaveBeenCalledWith(1);
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('The first post');
    expect(TestBed.inject(NotificationService).successMessage()).toContain('The first post');
  });

  it('asks the API for the posts only once', async () => {
    const fixture = TestBed.createComponent(ListPostsComponent);
    await fixture.whenStable();

    expect(postService.list).toHaveBeenCalledTimes(1);
  });
});

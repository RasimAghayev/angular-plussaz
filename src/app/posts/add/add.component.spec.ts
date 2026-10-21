import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { PostService } from '../post.service';
import { AddPostComponent } from './add.component';

describe('AddPostComponent', () => {
  const postService = { create: vi.fn() };
  const router = { navigateByUrl: vi.fn() };

  beforeEach(async () => {
    postService.create.mockReset().mockReturnValue(of({ id: 1, userId: 1, title: 't', body: 'b' }));
    router.navigateByUrl.mockReset();

    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  it('does not send an empty post', () => {
    const fixture = TestBed.createComponent(AddPostComponent);
    fixture.detectChanges();

    fixture.componentInstance['submit']();

    expect(postService.create).not.toHaveBeenCalled();
  });

  it('sends the post to the API', () => {
    const fixture = TestBed.createComponent(AddPostComponent);
    fixture.detectChanges();

    fixture.componentInstance['form'].setValue({ title: 'A title', body: 'A body' });
    fixture.componentInstance['submit']();

    expect(postService.create).toHaveBeenCalledWith({ title: 'A title', body: 'A body' });
  });

  it('returns to the list after the post was created', () => {
    const fixture = TestBed.createComponent(AddPostComponent);
    fixture.detectChanges();

    fixture.componentInstance['form'].setValue({ title: 'A title', body: 'A body' });
    fixture.componentInstance['submit']();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/posts-list');
    expect(TestBed.inject(NotificationService).successMessage()).toBe('The post was created.');
  });
});

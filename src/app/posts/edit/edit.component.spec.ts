import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { PostService } from '../post.service';
import { EditPostComponent } from './edit.component';

const POST = { id: 7, userId: 1, title: 'A title', body: 'A body' };

describe('EditPostComponent', () => {
  const postService = { get: vi.fn(), update: vi.fn() };
  const router = { navigateByUrl: vi.fn() };

  beforeEach(async () => {
    postService.get.mockReset().mockReturnValue(of(POST));
    postService.update.mockReset().mockReturnValue(of(POST));
    router.navigateByUrl.mockReset();

    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '7' }) } },
      ],
    }).compileComponents();
  });

  it('fills the form with the post of the API', async () => {
    const fixture = TestBed.createComponent(EditPostComponent);
    await fixture.whenStable();

    expect(postService.get).toHaveBeenCalledWith(7);
    expect(fixture.componentInstance['form'].getRawValue()).toEqual({
      title: 'A title',
      body: 'A body',
    });
  });

  it('sends the change of the post to the API', async () => {
    const fixture = TestBed.createComponent(EditPostComponent);
    await fixture.whenStable();

    fixture.componentInstance['form'].setValue({ title: 'Another title', body: 'Another body' });
    fixture.componentInstance['submit']();

    expect(postService.update).toHaveBeenCalledWith(7, {
      title: 'Another title',
      body: 'Another body',
    });
  });

  it('returns to the list after the post was updated', async () => {
    const fixture = TestBed.createComponent(EditPostComponent);
    await fixture.whenStable();

    fixture.componentInstance['submit']();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/posts-list');
    expect(TestBed.inject(NotificationService).successMessage()).toBe('The post was updated.');
  });
});

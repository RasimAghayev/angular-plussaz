import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { SessionService } from '../../core/session.service';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class DummyComponent {}

describe('HeaderComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([
          { path: 'posts-list', component: DummyComponent },
          { path: 'posts-add', component: DummyComponent },
        ]),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('asks a visitor to sign in', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Sign in');
    expect(element.textContent).not.toContain('New post');
  });

  it('offers the pages that write to a signed in visitor', () => {
    TestBed.inject(SessionService).signIn({
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('New post');
    expect(element.textContent).toContain('Leanne Graham');
  });

  it('ends the session', () => {
    const session = TestBed.inject(SessionService);
    session.signIn({
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    fixture.componentInstance['signOut']();

    expect(session.isSignedIn()).toBe(false);
    expect(TestBed.inject(Router).url).toBe('/');
  });
});

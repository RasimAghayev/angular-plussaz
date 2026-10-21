import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

@Component({ template: '' })
class DummyComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: 'posts-list', component: DummyComponent },
          { path: 'posts-add', component: DummyComponent },
          { path: 'login', component: DummyComponent },
        ]),
      ],
    }).compileComponents();
  });

  it('creates the application', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the frame of the pages', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-header')).toBeTruthy();
    expect(element.querySelector('app-footer')).toBeTruthy();
    expect(element.querySelector('router-outlet')).toBeTruthy();
  });

  it('shows the message of a failure', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    fixture.componentInstance['notification'].setError('The API could not be reached.');
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('The API could not be reached.');
  });
});

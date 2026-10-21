import { TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();
  });

  it('draws one button for every page', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalItems', 25);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.page-item').length).toBe(5);
  });

  it('draws nothing when the list holds one page', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalItems', 5);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('nav')).toBeNull();
  });

  it('tells the list about another page', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalItems', 25);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const wanted: number[] = [];
    fixture.componentInstance['pageChange'].subscribe((page) => wanted.push(page));

    fixture.componentInstance['goTo'](3);

    expect(wanted).toEqual([3]);
  });

  it('stays on the page that is on the screen', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalItems', 25);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const wanted: number[] = [];
    fixture.componentInstance['pageChange'].subscribe((page) => wanted.push(page));

    fixture.componentInstance['goTo'](2);
    fixture.componentInstance['goTo'](0);
    fixture.componentInstance['goTo'](9);

    expect(wanted).toEqual([]);
  });
});

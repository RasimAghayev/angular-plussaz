import { Component, computed, input, output } from '@angular/core';

/**
 * The pages of a list.
 *
 * The component draws the pages and tells the list when another page is
 * wanted. It holds no data of its own.
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  /** How many items the list holds. */
  readonly totalItems = input.required<number>();

  /** How many items a page holds. */
  readonly pageSize = input.required<number>();

  /** The page that is on the screen. */
  readonly currentPage = input.required<number>();

  /** The page the visitor asked for. */
  readonly pageChange = output<number>();

  /** How many pages the list has. */
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize())),
  );

  /** The numbers of the pages. */
  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_unused, index) => index + 1),
  );

  protected goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <nav class="pagination" aria-label="Episode pagination">
      <button
        class="pagination-btn"
        [disabled]="currentPage() <= 1"
        (click)="pageChange.emit(currentPage() - 1)"
        aria-label="Previous page">
        &laquo; Prev
      </button>

      <span class="pagination-info">
        Page {{ currentPage() }} of {{ totalPages() }}
      </span>

      <button
        class="pagination-btn"
        [disabled]="currentPage() >= totalPages()"
        (click)="pageChange.emit(currentPage() + 1)"
        aria-label="Next page">
        Next &raquo;
      </button>
    </nav>
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
    }
    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #4a90d9;
      border-radius: 4px;
      background: #fff;
      color: #4a90d9;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .pagination-btn:hover:not(:disabled) {
      background: #4a90d9;
      color: #fff;
    }
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination-info {
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();
}

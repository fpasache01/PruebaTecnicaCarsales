import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <input
        #searchInput
        type="search"
        [ngModel]="searchTerm()"
        (ngModelChange)="searchTerm.set($event)"
        (keydown.enter)="search.emit(searchTerm())"
        placeholder="Search episodes by name..."
        class="search-input"
        aria-label="Search episodes" />
      <button class="search-btn" (click)="search.emit(searchTerm())">
        Search
      </button>
      @if (searchTerm()) {
        <button class="clear-btn" (click)="clear()">
          Clear
        </button>
      }
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .search-input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      outline: none;
      border-color: #4a90d9;
    }
    .search-btn, .clear-btn {
      padding: 0.6rem 1.2rem;
      border: 1px solid #4a90d9;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .search-btn {
      background: #4a90d9;
      color: #fff;
    }
    .search-btn:hover {
      background: #357abd;
    }
    .clear-btn {
      background: #fff;
      color: #4a90d9;
    }
    .clear-btn:hover {
      background: #f5f5f5;
    }
  `]
})
export class SearchBarComponent {
  readonly search = output<string>();
  readonly searchTerm = signal('');

  clear(): void {
    this.searchTerm.set('');
    this.search.emit('');
  }
}

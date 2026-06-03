import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-display',
  standalone: true,
  template: `
    <div class="error-container" role="alert">
      <p class="error-message">{{ message() }}</p>
      <button class="retry-btn" (click)="retry.emit()">Retry</button>
    </div>
  `,
  styles: [`
    .error-container {
      padding: 1.5rem;
      border: 1px solid #e74c3c;
      border-radius: 8px;
      background: #fdf0ef;
      text-align: center;
      margin: 1rem 0;
    }
    .error-message {
      color: #c0392b;
      margin: 0 0 1rem;
      font-size: 1rem;
    }
    .retry-btn {
      padding: 0.5rem 1.5rem;
      border: 1px solid #e74c3c;
      border-radius: 4px;
      background: #fff;
      color: #e74c3c;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .retry-btn:hover {
      background: #e74c3c;
      color: #fff;
    }
  `]
})
export class ErrorDisplayComponent {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}

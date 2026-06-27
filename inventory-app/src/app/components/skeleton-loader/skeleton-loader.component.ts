import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-loader" [attr.data-test-id]="dataTestId">
      @for (item of rowsArray; track item) {
        <div class="skeleton-row" [style.height]="rowHeight"></div>
      }
    </div>
  `,
  styles: [`
    .skeleton-loader {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .skeleton-row {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() rows = 5;
  @Input() rowHeight = '48px';
  @Input() dataTestId = 'skeleton-loader';

  get rowsArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}
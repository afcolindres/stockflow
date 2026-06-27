import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../services/inventory.store';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { IStockAlert } from '../../models/alert.model';

@Component({
  selector: 'app-alerts-panel',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="alerts-panel-container" data-test-id="alerts-panel-container">
      <h2>Alertas de Stock</h2>
      
      @if (store.loading$()) {
        <app-skeleton-loader [rows]="3" rowHeight="64px" dataTestId="skeleton-loader"></app-skeleton-loader>
      } @else {
        <div class="alerts-list" data-test-id="alerts-panel-list">
          @for (alert of store.alerts$(); track alert.productId) {
            <div
              class="alert-item"
              [class.alert-low]="alert.severity === 'LOW'"
              [class.alert-critical]="alert.severity === 'CRITICAL'"
              [attr.data-test-id]="'alert-item-' + alert.productId"
            >
              <span 
                class="alert-severity"
                [attr.data-test-id]="'alert-severity-' + alert.productId"
              >
                {{ alert.severity }}
              </span>
              <div class="alert-info">
                <strong>{{ alert.productName }}</strong>
                <span class="alert-stock">
                  Stock: {{ alert.currentStock }} / {{ alert.minStock }}
                </span>
              </div>
            </div>
          } @empty {
            <div class="no-alerts">
              <p>No hay alertas activas</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .alerts-panel-container {
      padding: 24px;
    }
    .alerts-panel-container h2 {
      margin: 0 0 24px 0;
      color: #183473;
    }
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .alert-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
    }
    .alert-low {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
    }
    .alert-critical {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
    }
    .alert-severity {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .alert-low .alert-severity {
      background: #ffc107;
      color: #856404;
    }
    .alert-critical .alert-severity {
      background: #dc3545;
      color: white;
    }
    .alert-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .alert-info strong {
      color: #333;
    }
    .alert-stock {
      color: #666;
      font-size: 14px;
    }
    .no-alerts {
      text-align: center;
      padding: 32px;
      color: #666;
    }
  `]
})
export class AlertsPanelComponent implements OnInit {
  store = inject(InventoryStore);

  async ngOnInit() {
    await this.store.loadAlerts();
  }
}
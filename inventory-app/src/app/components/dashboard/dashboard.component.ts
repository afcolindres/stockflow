import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../services/inventory.store';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="dashboard-container" data-test-id="dashboard-container">
      <h2>Dashboard</h2>
      
      @if (store.loading$()) {
        <div class="kpi-grid">
          <app-skeleton-loader [rows]="4" rowHeight="100px" dataTestId="skeleton-loader"></app-skeleton-loader>
        </div>
      } @else {
        <div class="kpi-grid">
          <div class="kpi-card" data-test-id="dashboard-total-products">
            <span class="kpi-label">Total Productos</span>
            <span class="kpi-value">{{ store.totalProducts() }}</span>
          </div>
          
          <div class="kpi-card" data-test-id="dashboard-total-alerts">
            <span class="kpi-label">Alertas Activas</span>
            <span class="kpi-value kpi-warning">{{ store.activeAlerts() }}</span>
          </div>
          
          <div class="kpi-card" data-test-id="dashboard-critical-alerts">
            <span class="kpi-label">Alertas Críticas</span>
            <span class="kpi-value kpi-danger">{{ store.criticalAlerts() }}</span>
          </div>
          
          <div class="kpi-card" data-test-id="dashboard-total-value">
            <span class="kpi-label">Valor Inventario</span>
            <span class="kpi-value">L{{ store.totalValue() | number:'1.2-2' }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }
    .dashboard-container h2 {
      margin: 0 0 24px 0;
      color: #183473;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .kpi-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .kpi-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
    .kpi-value {
      font-size: 32px;
      font-weight: 600;
      color: #183473;
    }
    .kpi-warning {
      color: #ffc107;
    }
    .kpi-danger {
      color: #dc3545;
    }
  `]
})
export class DashboardComponent implements OnInit {
  store = inject(InventoryStore);

  async ngOnInit() {
    await Promise.all([
      this.store.loadProducts(),
      this.store.loadAlerts()
    ]);
  }
}
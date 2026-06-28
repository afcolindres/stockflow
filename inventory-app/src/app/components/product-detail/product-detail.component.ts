import { Component, inject, OnInit, OnDestroy, signal, ViewChild, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { IProduct } from "../../models/product.model";
import { IMovement } from "../../models/movement.model";
import { InventoryStore } from "../../services/inventory.store";
import { SkeletonLoaderComponent } from "../skeleton-loader/skeleton-loader.component";

interface ProductStats {
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  averagePerMonth?: number;
  lastMovement: string | null;
}

@Component({
  selector: "app-product-detail-page",
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
  template: `
    <div class="detail-container" data-test-id="product-detail-container">
      <nav class="breadcrumb">
        <a routerLink="/products" data-test-id="breadcrumb-products"
          >Productos</a
        >
        <span class="separator">›</span>
        <span class="current">Detalle</span>
      </nav>

      @if (loading()) {
        <app-skeleton-loader [rows]="3" rowHeight="60px"></app-skeleton-loader>
      } @else if (product()) {
        <div class="product-card" data-test-id="product-detail-card">
          <h2>{{ product()!.name }}</h2>
          <p class="sku">SKU: {{ product()!.sku }}</p>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Categoría</span>
              <span class="value">{{ product()!.category }}</span>
            </div>
            <div class="info-item">
              <span class="label">Stock Actual</span>
              <span class="value">{{ product()!.currentStock }}</span>
            </div>
            <div class="info-item">
              <span class="label">Stock Mínimo</span>
              <span class="value">{{ product()!.minStock }}</span>
            </div>
            <div class="info-item">
              <span class="label">Precio Unitario</span>
              <span class="value"
                >L{{ product()!.unitPrice | number: "1.2-2" }}</span
              >
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h3>Historial de Movimientos</h3>
            <button
              #btnLoadHistory
              class="btn-load-history"
              (click)="loadHistoryData()"
              [disabled]="loadingHistory() || historyLoaded()"
            >
              {{
                loadingHistory()
                  ? "Cargando..."
                  : historyLoaded()
                    ? "Historial Cargado"
                    : "Ver Historial"
              }}
            </button>
          </div>

          @defer (on interaction(btnLoadHistory)) {
            <div class="history-section" data-test-id="movement-history-list">
              @if (loadingHistory()) {
                <div class="loading" data-test-id="movement-history-loading">
                  <div class="spinner"></div>
                  <span>Cargando historial...</span>
                </div>
              } @else if (history().length > 0) {
                <table class="history-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Razón</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (m of history(); track m.id) {
                      <tr>
                        <td>
                          <span
                            [class]="m.type === 'IN' ? 'type-in' : 'type-out'"
                            >{{ m.type }}</span
                          >
                        </td>
                        <td>{{ m.quantity }}</td>
                        <td>{{ m.reason }}</td>
                        <td>{{ m.timestamp | date: "dd/MM/yyyy HH:mm" }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
                @if (historyTotalPages() > 0) {
                  <div class="paginator" data-test-id="history-paginator">
                    <button
                      [disabled]="historyPage() === 0"
                      (click)="changeHistoryPage(-1)"
                      data-test-id="history-paginator-prev"
                    >
                      Anterior
                    </button>
                    <span class="page-info"
                      >Página {{ historyPage() + 1 }} de
                      {{ historyTotalPages() }}</span
                    >
                    <button
                      [disabled]="historyPage() >= historyTotalPages() - 1"
                      (click)="changeHistoryPage(1)"
                      data-test-id="history-paginator-next"
                    >
                      Siguiente
                    </button>
                  </div>
                }
              } @else {
                <div class="no-history">No hay movimientos registrados</div>
              }
            </div>
          } @placeholder {
            <div class="placeholder">
              <p class="placeholder-message">
                Presione "Ver Historial" para cargar los movimientos
              </p>
              <app-skeleton-loader
                [rows]="5"
                rowHeight="40px"
              ></app-skeleton-loader>
            </div>
          } @loading {
            <div class="loading" data-test-id="movement-history-loading">
              <div class="spinner"></div>
              <span>Cargando historial...</span>
            </div>
          } @error {
            <div class="error-message" data-test-id="movement-history-error">
              Error al cargar el historial
            </div>
          }
        </div>

        <div class="section">
          <h3>Estadísticas Avanzadas</h3>
          <div #statsTrigger class="stats-trigger" style="height: 1px;"></div>

          @defer (on viewport) {
            <div class="stats-card" data-test-id="product-stats" #statsSection>
              @if (loadingStats()) {
                <div class="loading" data-test-id="product-stats-loading">
                  <div class="spinner"></div>
                  <span>Cargando estadísticas...</span>
                </div>
              } @else if (stats()) {
                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-value">{{
                      stats()!.totalMovements
                    }}</span>
                    <span class="stat-label">Total Movimientos</span>
                  </div>
                  <div class="stat-item stat-in">
                    <span class="stat-value">{{ stats()!.totalIn }}</span>
                    <span class="stat-label">Entradas</span>
                  </div>
                  <div class="stat-item stat-out">
                    <span class="stat-value">{{ stats()!.totalOut }}</span>
                    <span class="stat-label">Salidas</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{
                      stats()!.averagePerMonth?.toFixed(1) || "0.0"
                    }}</span>
                    <span class="stat-label">Promedio/Mes</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{
                      stats()!.lastMovement || "N/A"
                    }}</span>
                    <span class="stat-label">Último Movimiento</span>
                  </div>
                </div>
              }
            </div>
          } @placeholder {
            <div class="placeholder">
              <app-skeleton-loader
                [rows]="2"
                rowHeight="50px"
              ></app-skeleton-loader>
            </div>
          } @loading {
            <div class="loading" data-test-id="product-stats-loading">
              <div class="spinner"></div>
              <span>Cargando estadísticas...</span>
            </div>
          } @error {
            <div class="error-message" data-test-id="product-stats-error">
              Error al cargar estadísticas
            </div>
          }
        </div>
      } @else {
        <div class="error-message">Producto no encontrado</div>
      }
    </div>
  `,
  styles: [
    `
      .detail-container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        font-size: 14px;
      }
      .breadcrumb a {
        color: #183473;
        text-decoration: none;
      }
      .breadcrumb a:hover {
        text-decoration: underline;
      }
      .breadcrumb .separator {
        color: #999;
      }
      .breadcrumb .current {
        color: #666;
      }
      .product-card {
        background: white;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;
      }
      .product-card h2 {
        margin: 0 0 8px;
        color: #183473;
      }
      .product-card .sku {
        color: #666;
        margin: 0 0 20px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .info-item .label {
        font-size: 12px;
        color: #666;
      }
      .info-item .value {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
      .section {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;
      }
      .section h3 {
        margin: 0 0 16px;
        color: #183473;
        font-size: 18px;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .section-header h3 {
        margin: 0;
      }
      .btn-load-history {
        padding: 8px 16px;
        background: #183473;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .btn-load-history:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .history-table {
        width: 100%;
        border-collapse: collapse;
      }
      .history-table th,
      .history-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      .history-table th {
        background: #f8f9fa;
        font-weight: 600;
      }
      .type-in {
        color: #28a745;
        font-weight: 500;
      }
      .type-out {
        color: #dc3545;
        font-weight: 500;
      }
      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 24px;
        color: #666;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #eee;
        border-top-color: #183473;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .error-message {
        text-align: center;
        color: #dc3545;
        padding: 16px;
        background: #f8d7da;
        border-radius: 4px;
      }
      .placeholder {
        padding: 12px;
      }
      .placeholder-message {
        text-align: center;
        color: #666;
        margin-bottom: 12px;
        font-size: 14px;
      }
      .no-history {
        text-align: center;
        color: #666;
        padding: 24px;
        font-style: italic;
      }
      .paginator {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;
      }
      .paginator button {
        padding: 8px 16px;
        border: 1px solid #183473;
        background: white;
        color: #183473;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .paginator button:hover:not(:disabled) {
        background: #183473;
        color: white;
      }
      .paginator button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .page-info {
        color: #666;
        font-size: 14px;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #183473;
      }
      .stat-label {
        font-size: 12px;
        color: #666;
      }
      .stat-in .stat-value {
        color: #28a745;
      }
      .stat-out .stat-value {
        color: #dc3545;
      }
    `,
  ],
})
export class ProductDetailPage implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  store = inject(InventoryStore);

  @ViewChild("statsTrigger") statsTriggerRef: any;

  product = signal<IProduct | null>(null);
  history = signal<IMovement[]>([]);
  stats = signal<ProductStats | null>(null);
  loading = signal(true);
  loadingStats = signal(false);
  loadingHistory = signal(false);
  historyLoaded = signal(false);
  statsLoaded = signal(false);
  historyPage = signal(0);
  historyTotalPages = signal(0);
  historyTotalElements = signal(0);

  private observer: IntersectionObserver | null = null;

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (isNaN(id)) {
      this.loading.set(false);
      return;
    }
    try {
      const productData = await this.store.getProductById(id);
      this.product.set(productData);
    } catch {
      this.product.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private setupIntersectionObserver() {
    if (typeof IntersectionObserver === "undefined") return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.statsLoaded()) {
            this.loadStats();
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      if (this.statsTriggerRef?.nativeElement) {
        this.observer?.observe(this.statsTriggerRef.nativeElement);
      }
    }, 100);
  }

  async loadHistoryData(page = 0) {
    const productId = this.product()?.id;
    if (!productId) return;
    this.loadingHistory.set(true);
    this.historyLoaded.set(true);
    try {
      const result = await this.store.getMovementHistory(productId, page, 10);
      this.history.set(result.content);
      this.historyTotalPages.set(result.totalPages);
      this.historyTotalElements.set(result.totalElements);
      this.historyPage.set(page);
    } catch {
      /* Error */
    } finally {
      this.loadingHistory.set(false);
    }
  }

  async changeHistoryPage(delta: number) {
    const newPage = this.historyPage() + delta;
    if (newPage >= 0 && newPage < this.historyTotalPages()) {
      await this.loadHistoryData(newPage);
    }
  }

  async loadStats() {
    const productId = this.product()?.id;
    if (!productId || this.statsLoaded()) return;
    this.loadingStats.set(true);
    try {
      const result = await this.store.getProductStats(productId);
      if (result) {
        this.stats.set({
          totalMovements: result.totalMovements,
          totalIn: result.totalIn,
          totalOut: result.totalOut,
          averagePerMonth: result.averagePerMonth,
          lastMovement: result.lastMovement
            ? new Date(result.lastMovement).toLocaleDateString()
            : null,
        });
        this.statsLoaded.set(true);
      }
    } catch {
      this.stats.set(null);
    } finally {
      this.loadingStats.set(false);
    }
  }
}

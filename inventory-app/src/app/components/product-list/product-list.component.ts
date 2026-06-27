import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryStore } from '../../services/inventory.store';
import { IProduct } from '../../models/product.model';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent],
  template: `
    <div class="product-list-container" data-test-id="product-list-container">
      <div class="product-list-header">
        <h2>Productos</h2>
        <div class="product-list-filters">
          <select
            class="filter-category"
            data-test-id="filter-category"
            [(ngModel)]="selectedCategory"
            (change)="onCategoryChange()"
          >
            <option value="">Todas las categorías</option>
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>
      </div>

      @if (store.loading$()) {
        <app-skeleton-loader [rows]="5" rowHeight="48px" dataTestId="skeleton-loader"></app-skeleton-loader>
      } @else {
        <table class="product-table" data-test-id="product-list-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Stock Mín</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (product of store.products$(); track product.id) {
              <tr [attr.data-test-id]="'product-row-' + product.sku">
                <td>{{ product.sku }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.currentStock }}</td>
                <td>{{ product.minStock }}</td>
                <td>L{{ product.unitPrice | number: '1.2-2' }}</td>
                <td>
                  <span
                    [class]="getStockClass(product)"
                    [attr.data-test-id]="'product-stock-badge-' + product.sku"
                  >
                    {{ getStockStatus(product) }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <div class="paginator" data-test-id="filter-paginator">
          <button
            [disabled]="currentPage === 0"
            (click)="onPageChange(currentPage - 1)"
            data-test-id="paginator-prev"
          >
            Anterior
          </button>
          <span class="page-info">
            Página {{ currentPage + 1 }} de {{ totalPages }}
          </span>
          <button
            [disabled]="currentPage >= totalPages - 1"
            (click)="onPageChange(currentPage + 1)"
            data-test-id="paginator-next"
          >
            Siguiente
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 24px;
    }
    .product-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .product-list-header h2 {
      margin: 0;
      color: #183473;
    }
    .filter-category {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      min-width: 200px;
    }
    .product-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .product-table th,
    .product-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .product-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    .product-table tr:hover {
      background: #f8f9fa;
    }
    .stock-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .stock-ok {
      background: #d4edda;
      color: #155724;
    }
    .stock-low {
      background: #fff3cd;
      color: #856404;
    }
    .stock-critical {
      background: #f8d7da;
      color: #721c24;
    }
    .paginator {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
    }
    .paginator button {
      padding: 8px 16px;
      border: 1px solid #183473;
      background: white;
      color: #183473;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
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
  `]
})
export class ProductListComponent implements OnInit {
  store = inject(InventoryStore);

  selectedCategory = '';
  currentPage = 0;
  totalPages = 0;
  categories: string[] = [];

  async ngOnInit() {
    await Promise.all([
      this.store.loadProducts(),
      this.store.loadCategories()
    ]);
    this.categories = this.store.categories$();
    this.updatePagination();
  }

  updatePagination() {
    const filters = this.store.filters$();
    const pagination = this.store.pagination$();
    this.selectedCategory = filters.category;
    this.currentPage = filters.page;
    this.totalPages = pagination.totalPages;
  }

  onCategoryChange() {
    this.store.setFilters({ category: this.selectedCategory, page: 0 });
    this.store.loadProducts().then(() => this.updatePagination());
  }

  onPageChange(page: number) {
    this.store.setFilters({ page });
    this.store.loadProducts().then(() => this.updatePagination());
  }

  getStockStatus(product: IProduct): string {
    if (product.currentStock > product.minStock) return 'OK';
    if (product.currentStock <= product.minStock / 2) return 'CRÍTICO';
    return 'BAJO';
  }

  getStockClass(product: IProduct): string {
    if (product.currentStock > product.minStock) return 'stock-badge stock-ok';
    if (product.currentStock <= product.minStock / 2) return 'stock-badge stock-critical';
    return 'stock-badge stock-low';
  }
}
import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { InventoryStore } from '../../services/inventory.store';
import { IProduct } from '../../models/product.model';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Registrar Movimiento</h3>
          <button class="close-btn" (click)="onClose()" data-test-id="movement-form-close">&times;</button>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" data-test-id="movement-form">
          <div class="form-group">
            <label for="product">Producto</label>
            <div class="autocomplete-container">
              <input
                type="text"
                id="product-search"
                [formControl]="searchControl"
                placeholder="Buscar producto por nombre o SKU..."
                (focus)="showDropdown.set(true)"
                data-test-id="movement-form-product-search"
                autocomplete="off"
              />
              @if (selectedProduct()) {
                <div class="selected-product">
                  <span class="product-name">{{ selectedProduct()!.name }}</span>
                  <span class="product-sku">({{ selectedProduct()!.sku }})</span>
                  <button type="button" class="clear-btn" (click)="clearProduct()">&times;</button>
                </div>
              }
              @if (showDropdown() && !selectedProduct()) {
                <div class="dropdown">
                  @if (loading()) {
                    <div class="dropdown-item loading">Buscando...</div>
                  } @else if (searchResults().length > 0) {
                    @for (product of searchResults(); track product.id) {
                      <div 
                        class="dropdown-item" 
                        (click)="selectProduct(product)"
                        (mousedown)="selectProductClick(product)"
                      >
                        <span class="product-name">{{ product.name }}</span>
                        <span class="product-sku">({{ product.sku }})</span>
                        <span class="product-stock">Stock: {{ product.currentStock }}</span>
                      </div>
                    }
                  } @else if (searchControl.value && searchControl.value.length >= 2) {
                    <div class="dropdown-item no-results">No se encontraron productos</div>
                  }
                </div>
              }
            </div>
            @if (form.get('productId')?.invalid && form.get('productId')?.touched) {
              <span class="error">Producto es obligatorio</span>
            }
          </div>

          <div class="form-group">
            <label for="type">Tipo de Movimiento</label>
            <select
              id="type"
              formControlName="type"
              data-test-id="movement-form-type"
            >
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantity">Cantidad</label>
            <input
              type="number"
              id="quantity"
              formControlName="quantity"
              min="1"
              data-test-id="movement-form-quantity"
            />
            @if (form.get('quantity')?.invalid && form.get('quantity')?.touched) {
              <span class="error">Cantidad debe ser mayor a 0</span>
            }
          </div>

          <div class="form-group">
            <label for="reason">Razón</label>
            <input
              type="text"
              id="reason"
              formControlName="reason"
              data-test-id="movement-form-reason"
            />
            @if (form.get('reason')?.invalid && form.get('reason')?.touched) {
              <span class="error">Razón es obligatoria</span>
            }
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-cancel"
              (click)="onClose()"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="form.invalid || store.loading$()"
              data-test-id="movement-form-submit"
            >
              {{ store.loading$() ? 'Registrando...' : 'Registrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 24px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-header h3 {
      margin: 0;
      color: #183473;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #333;
    }
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #183473;
    }
    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .form-actions button {
      flex: 1;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-cancel {
      background: #f8f9fa;
      border: 1px solid #ddd;
      color: #333;
    }
    .form-actions button[type="submit"] {
      background: #183473;
      color: white;
      border: none;
    }
    .form-actions button[type="submit"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .autocomplete-container {
      position: relative;
    }
    .autocomplete-container input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .autocomplete-container input:focus {
      outline: none;
      border-color: #183473;
    }
    .selected-product {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #e8f0fe;
      border-radius: 4px;
      margin-top: 8px;
    }
    .selected-product .product-name {
      font-weight: 500;
      color: #183473;
    }
    .selected-product .product-sku {
      color: #666;
      font-size: 12px;
    }
    .clear-btn {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #666;
      padding: 0 4px;
    }
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      max-height: 250px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-top: 4px;
    }
    .dropdown-item {
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #eee;
    }
    .dropdown-item:last-child {
      border-bottom: none;
    }
    .dropdown-item:hover {
      background: #f8f9fa;
    }
    .dropdown-item .product-name {
      font-weight: 500;
      color: #333;
    }
    .dropdown-item .product-sku {
      color: #666;
      font-size: 12px;
    }
    .dropdown-item .product-stock {
      margin-left: auto;
      color: #183473;
      font-size: 12px;
    }
    .dropdown-item.loading,
    .dropdown-item.no-results {
      color: #666;
      font-style: italic;
    }
  `]
})
export class MovementFormComponent implements OnInit {
  @Input() products: IProduct[] = [];
  @Output() close = new EventEmitter<void>();
  
  store = inject(InventoryStore);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  searchControl = this.fb.control('');
  
  searchResults = signal<IProduct[]>([]);
  selectedProduct = signal<IProduct | null>(null);
  showDropdown = signal(false);
  loading = signal(false);

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.form = this.fb.group({
      productId: ['', Validators.required],
      type: ['IN', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required]
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async (query) => {
      if (query && query.length >= 2) {
        this.loading.set(true);
        const results = await this.store.searchProducts(query, 20);
        this.searchResults.set(results);
        this.loading.set(false);
      } else {
        this.searchResults.set([]);
      }
    });

    this.searchControl.valueChanges.subscribe((value) => {
      if (value && value.length >= 2) {
        this.searchSubject.next(value);
      } else {
        this.searchResults.set([]);
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        this.showDropdown.set(false);
      }
    });
  }

  selectProduct(product: IProduct) {
    this.selectedProduct.set(product);
    this.searchControl.setValue('');
    this.form.get('productId')?.setValue(product.id);
    this.showDropdown.set(false);
    this.searchResults.set([]);
  }

  selectProductClick(product: IProduct) {
    this.selectProduct(product);
  }

  clearProduct() {
    this.selectedProduct.set(null);
    this.form.get('productId')?.setValue('');
  }

  async onSubmit() {
    if (this.form.valid) {
      const { productId, type, quantity, reason } = this.form.value;
      const success = await this.store.createMovement({
        productId,
        type,
        quantity,
        reason
      });
      
      if (success) {
        this.onClose();
      }
    }
  }

  onClose() {
    this.form.reset({ type: 'IN', quantity: 1 });
    this.selectedProduct.set(null);
    this.searchControl.setValue('');
    this.searchResults.set([]);
    this.close.emit();
  }
}
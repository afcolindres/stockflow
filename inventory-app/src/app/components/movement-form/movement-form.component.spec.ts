import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MovementFormComponent } from './movement-form.component';
import { InventoryStore } from '../../services/inventory.store';
import { IProduct } from '../../models/product.model';
import { of } from 'rxjs';

describe('MovementFormComponent', () => {
  let component: MovementFormComponent;
  let fixture: ComponentFixture<MovementFormComponent>;
  let mockStore: any;
  let mockProducts: IProduct[];

  beforeEach(async () => {
    mockProducts = [
      { id: 1, sku: 'ELEC-001', name: 'Laptop', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 },
      { id: 2, sku: 'HOME-001', name: 'Silla', category: 'Hogar', currentStock: 3, minStock: 5, unitPrice: 200 },
    ];

    mockStore = {
      loading$: () => false,
      searchProducts: jest.fn().mockResolvedValue(mockProducts),
      createMovement: jest.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MovementFormComponent],
      providers: [
        FormBuilder,
        { provide: InventoryStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementFormComponent);
    component = fixture.componentInstance;
    component.products = mockProducts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form with required validators', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('productId')).toBeDefined();
      expect(component.form.get('type')).toBeDefined();
      expect(component.form.get('quantity')).toBeDefined();
      expect(component.form.get('reason')).toBeDefined();
    });

    it('should have default values', () => {
      expect(component.form.get('type')?.value).toBe('IN');
      expect(component.form.get('quantity')?.value).toBe(1);
    });

    it('should mark form as invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('should reset form fields', () => {
      component.form.get('type')?.setValue('OUT');
      component.form.get('quantity')?.setValue(5);
      component.form.get('reason')?.setValue('Test reason');

      component.resetForm();

      expect(component.form.get('type')?.value).toBe('IN');
      expect(component.form.get('quantity')?.value).toBe(1);
      expect(component.form.get('reason')?.value).toBe('');
    });

    it('should clear selected product', () => {
      component.selectedProduct.set(mockProducts[0]);

      component.resetForm();

      expect(component.selectedProduct()).toBeNull();
    });

    it('should clear search results', () => {
      component.searchResults.set(mockProducts);

      component.resetForm();

      expect(component.searchResults()).toEqual([]);
    });
  });

  describe('selectProduct', () => {
    it('should set selected product', () => {
      const product = mockProducts[0];

      component.selectProduct(product);

      expect(component.selectedProduct()).toEqual(product);
    });

    it('should update form productId', () => {
      const product = mockProducts[0];

      component.selectProduct(product);

      expect(component.form.get('productId')?.value).toBe(product.id);
    });

    it('should clear search results', () => {
      component.selectProduct(mockProducts[0]);

      expect(component.searchResults()).toEqual([]);
    });

    it('should hide dropdown', () => {
      component.showDropdown.set(true);

      component.selectProduct(mockProducts[0]);

      expect(component.showDropdown()).toBe(false);
    });
  });

  describe('clearProduct', () => {
    it('should clear selected product', () => {
      component.selectedProduct.set(mockProducts[0]);

      component.clearProduct();

      expect(component.selectedProduct()).toBeNull();
    });

    it('should clear productId in form', () => {
      component.form.get('productId')?.setValue(1);

      component.clearProduct();

      expect(component.form.get('productId')?.value).toBe('');
    });
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      const emitSpy = jest.spyOn(component.close, 'emit');

      component.onClose();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should reset form on close', () => {
      component.onClose();

      expect(component.form.get('type')?.value).toBe('IN');
    });
  });

  describe('onSubmit', () => {
    it('should not submit invalid form', async () => {
      component.form.get('productId')?.setValue('');
      component.form.get('reason')?.setValue('');

      await component.onSubmit();

      expect(mockStore.createMovement).not.toHaveBeenCalled();
    });

    it('should submit valid form', async () => {
      component.form.get('productId')?.setValue(1);
      component.form.get('type')?.setValue('IN');
      component.form.get('quantity')?.setValue(5);
      component.form.get('reason')?.setValue('Test reason');

      await component.onSubmit();

      expect(mockStore.createMovement).toHaveBeenCalledWith({
        productId: 1,
        type: 'IN',
        quantity: 5,
        reason: 'Test reason',
      });
    });

    it('should close form on successful submit', async () => {
      const emitSpy = jest.spyOn(component.close, 'emit');
      component.form.get('productId')?.setValue(1);
      component.form.get('type')?.setValue('IN');
      component.form.get('quantity')?.setValue(5);
      component.form.get('reason')?.setValue('Test reason');

      await component.onSubmit();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('search functionality', () => {
    it('should update search results on input', fakeAsync(() => {
      component.searchControl.setValue('Laptop');
      tick(400);

      expect(mockStore.searchProducts).toHaveBeenCalled();
    }));

    it('should clear results for short queries', () => {
      component.searchResults.set(mockProducts);

      component.searchControl.setValue('a');

      expect(component.searchResults()).toEqual([]);
    });
  });

  describe('signals', () => {
    it('should initialize with default signals', () => {
      expect(component.searchResults()).toEqual([]);
      expect(component.selectedProduct()).toBeNull();
      expect(component.showDropdown()).toBe(false);
      expect(component.loading()).toBe(false);
    });
  });
});
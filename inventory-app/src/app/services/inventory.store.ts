import { Injectable, signal, computed, effect, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { IProduct } from "../models/product.model";
import { IStockAlert } from "../models/alert.model";
import { IMovementRequest } from "../models/movement.model";
import { InventoryService } from "./inventory.service";
import { ToastService } from "./toast.service";

export interface FilterState {
  category: string;
  page: number;
  size: number;
}

@Injectable({ providedIn: "root" })
export class InventoryStore {
  private readonly inventoryService = inject(InventoryService);
  private readonly toastService = inject(ToastService);

  private readonly products = signal<IProduct[]>([]);
  private readonly alerts = signal<IStockAlert[]>([]);
  private readonly selectedProduct = signal<IProduct | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  private readonly filters = signal<FilterState>({
    category: "",
    page: 0,
    size: 10,
  });

  private readonly pagination = signal({ totalPages: 0, totalElements: 0 });
  private readonly categories = signal<string[]>([]);

  readonly products$ = this.products.asReadonly();
  readonly alerts$ = this.alerts.asReadonly();
  readonly selectedProduct$ = this.selectedProduct.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();
  readonly filters$ = this.filters.asReadonly();
  readonly pagination$ = this.pagination.asReadonly();
  readonly categories$ = this.categories.asReadonly();

  readonly totalProducts = computed(() => this.pagination().totalElements);
  readonly activeAlerts = computed(() => this.alerts().length);
  readonly criticalAlerts = computed(
    () => this.alerts().filter((a) => a.severity === "CRITICAL").length,
  );
  readonly totalStock = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock, 0),
  );

  readonly totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0),
  );

  constructor() {
    effect(() => {
      const currentFilters = this.filters();
      localStorage.setItem("inventory-filters", JSON.stringify(currentFilters));
    });

    effect(() => {
      const alerts = this.alerts();
      if (alerts.length > 0) {
        this.toastService.show(`${alerts.length} alertas activas`, "info");
      }
    });

    this.loadFiltersFromStorage();
  }

  private loadFiltersFromStorage(): void {
    const stored = localStorage.getItem("inventory-filters");
    if (stored) {
      try {
        const filters = JSON.parse(stored) as FilterState;
        this.filters.set(filters);
      } catch {
        // Ignore parse errors
      }
    }
  }

  setFilters(filters: Partial<FilterState>): void {
    this.filters.update((current) => ({ ...current, ...filters }));
  }

  async loadProducts(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const currentFilters = this.filters();
      const response = await firstValueFrom(
        this.inventoryService.getProducts(
          currentFilters.page,
          currentFilters.size,
          currentFilters.category || undefined,
        ),
      );

      if (response?.data?.content) {
        this.products.set(response.data.content);
        this.pagination.set({
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
        this.filters.update(f => ({
          ...f,
          page: response.data.currentPage,
          size: response.data.size
        }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cargar productos";
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  async loadAlerts(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.inventoryService.getAlerts());

      if (response?.data) {
        this.alerts.set(response.data);
      } else {
        this.alerts.set([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cargar alertas";
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCategories(): Promise<void> {
    try {
      const response = await firstValueFrom(this.inventoryService.getCategories());
      if (response?.data) {
        this.categories.set(response.data.sort());
      }
    } catch {
      this.categories.set([]);
    }
  }

  async createMovement(request: IMovementRequest): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.inventoryService.createMovement(request),
      );

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        this.toastService.show(
          response.message || "Movimiento registrado",
          "success",
        );
        await this.loadProducts();
        await this.loadAlerts();
        await this.loadCategories();
        return true;
      }

      return false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrar movimiento";
      this.error.set(message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  selectProduct(product: IProduct | null): void {
    this.selectedProduct.set(product);
  }

  clearError(): void {
    this.error.set(null);
  }
}

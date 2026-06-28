import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./components/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: "products",
    loadComponent: () =>
      import("./components/product-list/product-list.component").then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: "products/:id",
    loadComponent: () =>
      import("./components/product-detail/product-detail.component").then(
        (m) => m.ProductDetailPage,
      ),
  },
  {
    path: "alerts",
    loadComponent: () =>
      import("./components/alerts-panel/alerts-panel.component").then(
        (m) => m.AlertsPanelComponent,
      ),
  },
];

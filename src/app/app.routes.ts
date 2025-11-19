import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'store-inventory',
    loadComponent: () =>
      import(
        './presentation/pages/store-inventory/store-inventory.component'
      ).then((m) => m.StoreInventoryComponent),
  },
  {
    path: 'create-product',
    loadComponent: () =>
      import(
        './presentation/pages/create-products/create-products.component'
      ).then((m) => m.CreateProductsComponent),
  },
  {
    path: '',
    redirectTo: 'store-inventory',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'store-inventory',
  },
];

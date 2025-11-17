import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'store-inventory',
    loadComponent: () =>
      import('./presentation/store-inventory/store-inventory.component').then(
        (m) => m.StoreInventoryComponent
      ),
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

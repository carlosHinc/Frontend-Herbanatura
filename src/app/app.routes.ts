import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inventario/productos',
    loadComponent: () =>
      import(
        './presentation/pages/store-inventory/store-inventory.component'
      ).then((m) => m.StoreInventoryComponent),
  },
  {
    path: 'inventario/crear-producto',
    loadComponent: () =>
      import(
        './presentation/pages/create-products/create-products.component'
      ).then((m) => m.CreateProductsComponent),
  },
  {
    path: 'inventario/registrar-pedido',
    loadComponent: () =>
      import('./presentation/pages/create-order/create-order.component').then(
        (m) => m.CreateOrderComponent
      ),
  },
  {
    path: 'registro-venta',
    loadComponent: () =>
      import('./presentation/pages/create-sale/create-sale.component').then(
        (m) => m.CreateSaleComponent
      ),
  },
  {
    path: 'pedidos-realizados',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/order-list/order-list.component').then(
            (m) => m.OrderListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './presentation/pages/order-details/order-details.component'
          ).then((m) => m.OrderDetailsComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'inventario/productos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'inventario/productos',
  },
];

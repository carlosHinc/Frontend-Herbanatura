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
    path: 'inventario/proximos-a-vencer',
    loadComponent: () =>
      import(
        './presentation/pages/get-products-expiring/get-products-expiring.component'
      ).then((m) => m.GetProductsExpiringComponent),
  },
  {
    path: 'inventario/editar-producto/:id',
    loadComponent: () =>
      import(
        './presentation/pages/update-product/update-product.component'
      ).then((m) => m.UpdateProductComponent),
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
    path: 'ventas',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/sales-list/sales-list.component').then(
            (m) => m.SalesListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './presentation/pages/sale-details/sale-details.component'
          ).then((m) => m.SaleDetailsComponent),
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

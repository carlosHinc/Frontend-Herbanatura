import { Routes } from '@angular/router';
import { authGuard } from '@infrastructure/guards/auth.guard';
import { permissionsGuard } from '@infrastructure/guards/permissions.guard';
import { SystemActionsCode } from '@domain/auth/auth.response';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./presentation/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./presentation/pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'inventario/productos',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.VIEW_PRODUCTS]),
    ],
    loadComponent: () =>
      import('./presentation/pages/store-inventory/store-inventory.component').then(
        (m) => m.StoreInventoryComponent,
      ),
  },
  {
    path: 'inventario/crear-producto',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.CREATE_PRODUCT]),
    ],
    loadComponent: () =>
      import('./presentation/pages/create-products/create-products.component').then(
        (m) => m.CreateProductsComponent,
      ),
  },
  {
    path: 'inventario/crear-proveedor',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.REGISTER_SUPPLIER]),
    ],
    loadComponent: () =>
      import('./presentation/pages/create-supplier/create-supplier.component').then(
        (m) => m.CreateSupplierComponent,
      ),
  },
  {
    path: 'inventario/editar-proveedor/:id',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.EDIT_SUPPLIER]),
    ],
    loadComponent: () =>
      import('./presentation/pages/update-supplier/update-supplier.component').then(
        (m) => m.UpdateSupplierComponent,
      ),
  },
  {
    path: 'inventario/proveedores',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.VIEW_SUPPLIERS]),
    ],
    loadComponent: () =>
      import('./presentation/pages/suppliers/suppliers-list.component').then(
        (m) => m.SuppliersListComponent,
      ),
  },
  {
    path: 'inventario/registrar-pedido',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.CREATE_PURCHASE_ORDER]),
    ],
    loadComponent: () =>
      import('./presentation/pages/create-order/create-order.component').then(
        (m) => m.CreateOrderComponent,
      ),
  },
  {
    path: 'inventario/proximos-a-vencer',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.VIEW_PRODUCTS_NEARING_EXPIRATION]),
    ],
    loadComponent: () =>
      import('./presentation/pages/get-products-expiring/get-products-expiring.component').then(
        (m) => m.GetProductsExpiringComponent,
      ),
  },
  {
    path: 'inventario/productos-vencidos',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.VIEW_PRODUCTS_EXPIRED]),
    ],
    loadComponent: () =>
      import('./presentation/pages/expired-products/expired-products.component').then(
        (m) => m.ExpiredProductsComponent,
      ),
  },
  {
    path: 'inventario/editar-producto/:id',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.EDIT_PRODUCT]),
    ],
    loadComponent: () =>
      import('./presentation/pages/update-product/update-product.component').then(
        (m) => m.UpdateProductComponent,
      ),
  },
  {
    path: 'registro-venta',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.SALES_REGISTER]),
    ],
    loadComponent: () =>
      import('./presentation/pages/create-sale/create-sale.component').then(
        (m) => m.CreateSaleComponent,
      ),
  },
  {
    path: 'pedidos-realizados',
    canActivate: [
      authGuard,
      permissionsGuard([SystemActionsCode.VIEW_PURCHASE_ORDERS]),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/order-list/order-list.component').then(
            (m) => m.OrderListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./presentation/pages/order-details/order-details.component').then(
            (m) => m.OrderDetailsComponent,
          ),
      },
    ],
  },
  {
    path: 'ventas',
    canActivate: [authGuard, permissionsGuard([SystemActionsCode.VIEW_SALES])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/sales-list/sales-list.component').then(
            (m) => m.SalesListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./presentation/pages/sale-details/sale-details.component').then(
            (m) => m.SaleDetailsComponent,
          ),
      },
    ],
  },
  {
    path: 'inventario/productos/historial/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./presentation/pages/product-history/product-history.component').then(
        (m) => m.ProductHistoryComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];

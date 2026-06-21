import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core';
import { MenuItem } from '../interfaces/menu.interface';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';
import { SystemActionsCode } from '@domain/auth/auth.response';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly authTokenService = inject(AuthTokenService);
  private _isCollapsed = signal(false);
  private _openSubmenu = signal<string | null>(null);

  // Señales para reactive state
  isCollapsed = this._isCollapsed.asReadonly();
  openSubmenu = this._openSubmenu.asReadonly();

  private menuConfig: MenuItem[] = [
    {
      id: 'inventory',
      title: 'Inventario',
      icon: 'bi-boxes',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Productos',
          icon: 'bi-box',
          route: '/inventario/productos',
          badgeColor: 'success',
          permission: SystemActionsCode.VIEW_PRODUCTS,
        },
        {
          title: 'Crear Producto',
          icon: 'bi-clipboard2-plus',
          route: '/inventario/crear-producto',
          permission: SystemActionsCode.CREATE_PRODUCT,
        },
        {
          title: 'Proximos A Vencer',
          icon: 'bi-calendar-date',
          route: '/inventario/proximos-a-vencer',
          badgeColor: 'warning',
          permission: SystemActionsCode.VIEW_PRODUCTS_NEARING_EXPIRATION,
        },
        {
          title: 'Productos Vencidos',
          icon: 'bi-exclamation-triangle',
          route: '/inventario/productos-vencidos',
          badgeColor: 'danger',
          permission: SystemActionsCode.VIEW_PRODUCTS_EXPIRED,
        },
      ],
    },
    {
      id: 'suppliers',
      title: 'Proveedores',
      icon: 'bi-person-fill-up',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Listado Proveedores',
          icon: 'bi-person-vcard-fill',
          route: '/inventario/proveedores',
          permission: SystemActionsCode.VIEW_SUPPLIERS,
        },
        {
          title: 'Registrar Proveedor',
          icon: 'bi-person-plus-fill',
          route: '/inventario/crear-proveedor',
          permission: SystemActionsCode.REGISTER_SUPPLIER,
        },
      ],
    },
    {
      id: 'sales',
      title: 'Ventas',
      icon: 'bi-currency-exchange',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Ventas Realizadas',
          icon: 'bi-cash-coin',
          route: '/ventas',
          permission: SystemActionsCode.VIEW_SALES,
        },
        {
          title: 'Registro Venta',
          icon: 'bi-currency-exchange',
          route: '/registro-venta',
          permission: SystemActionsCode.SALES_REGISTER,
        },
      ],
    },
    {
      id: 'orders',
      title: 'Pedidos',
      icon: 'bi-card-list',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Pedidos Realizados',
          icon: 'bi-card-list',
          route: '/pedidos-realizados',
          permission: SystemActionsCode.VIEW_PURCHASE_ORDERS,
        },
        {
          title: 'Registrar Pedido',
          icon: 'bi-cart-plus',
          route: '/inventario/registrar-pedido',
          badgeColor: 'warning',
          permission: SystemActionsCode.CREATE_PURCHASE_ORDER,
        },
      ],
    },
  ];

  private getUserPermissionCodes(): string[] {
    const permissions = this.authTokenService.getPermissions();
    if (!permissions) return [];
    return permissions.map((p) => p.code);
  }

  private hasPermission(requiredPermission?: string): boolean {
    if (!requiredPermission) return true;
    const userPermissions = this.getUserPermissionCodes();
    return userPermissions.includes(requiredPermission);
  }

  getMenuItems(): MenuItem[] {
    return this.menuConfig
      .filter((item) => this.hasPermission(item.permission))
      .map((item) => {
        if (item.submenu) {
          return {
            ...item,
            submenu: item.submenu.filter((submenu) =>
              this.hasPermission(submenu.permission),
            ),
          };
        }
        return item;
      })
      .filter(
        (item) => !item.submenu || (item.submenu && item.submenu.length > 0),
      );
  }

  toggleSidebar(): void {
    this._isCollapsed.set(!this._isCollapsed());
    if (this._isCollapsed()) {
      this._openSubmenu.set(null);
    }
  }

  toggleSubmenu(menuId: string): void {
    if (this._isCollapsed()) return;

    const currentOpen = this._openSubmenu();
    this._openSubmenu.set(currentOpen === menuId ? null : menuId);
  }

  isSubmenuOpen(menuId: string): boolean {
    return this._openSubmenu() === menuId;
  }

  closeAllSubmenus(): void {
    this._openSubmenu.set(null);
  }
}

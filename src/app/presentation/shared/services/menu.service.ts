import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
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
        },
        {
          title: 'Crear Producto',
          icon: 'bi-clipboard2-plus',
          route: '/inventario/crear-producto',
        },
        {
          title: 'Registrar Pedido',
          icon: 'bi-cart-plus',
          route: '/inventario/registrar-pedido',
          badgeColor: 'warning',
        },
      ],
    },
    {
      id: 'sale',
      title: 'Registro Ventas',
      icon: 'bi-currency-exchange',
      route: '/registro-venta',
      hasSubmenu: false,
    },
    {
      id: 'orders-list',
      title: 'Pedidos Realizados',
      icon: 'bi-card-list',
      route: '/pedidos-realizados',
      hasSubmenu: false,
    },
  ];

  getMenuItems(): MenuItem[] {
    return this.menuConfig;
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

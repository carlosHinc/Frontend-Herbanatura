import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private _isCollapsed = signal(false);
  private _openSubmenu = signal<string | null>(null);

  // Señales para reactive state
  isCollapsed = this._isCollapsed.asReadonly();
  openSubmenu = this._openSubmenu.asReadonly();

  // Configuración del menú
  private menuConfig: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard',
      hasSubmenu: false
    },
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
          badge: '150',
          badgeColor: 'success'
        },
        { 
          title: 'Categorías', 
          icon: 'bi-tags', 
          route: '/inventario/categorias' 
        },
        { 
          title: 'Stock Bajo', 
          icon: 'bi-exclamation-triangle', 
          route: '/inventario/stock-bajo',
          badge: '5',
          badgeColor: 'warning'
        },
        { 
          title: 'Movimientos', 
          icon: 'bi-arrow-left-right', 
          route: '/inventario/movimientos' 
        }
      ]
    },
    {
      id: 'suppliers',
      title: 'Proveedores',
      icon: 'bi-truck',
      route: '/proveedores',
      hasSubmenu: false
    },
    {
      id: 'sales',
      title: 'Ventas',
      icon: 'bi-cart-check',
      hasSubmenu: true,
      submenu: [
        { 
          title: 'Nueva Venta', 
          icon: 'bi-plus-circle', 
          route: '/ventas/nueva' 
        },
        { 
          title: 'Historial', 
          icon: 'bi-clock-history', 
          route: '/ventas/historial' 
        },
        { 
          title: 'Devoluciones', 
          icon: 'bi-arrow-return-left', 
          route: '/ventas/devoluciones' 
        }
      ]
    },
    {
      id: 'customers',
      title: 'Clientes',
      icon: 'bi-people',
      route: '/clientes',
      hasSubmenu: false
    },
    {
      id: 'reports',
      title: 'Reportes',
      icon: 'bi-bar-chart',
      hasSubmenu: true,
      submenu: [
        { 
          title: 'Ventas', 
          icon: 'bi-graph-up', 
          route: '/reportes/ventas' 
        },
        { 
          title: 'Inventario', 
          icon: 'bi-box-seam', 
          route: '/reportes/inventario' 
        },
        { 
          title: 'Financieros', 
          icon: 'bi-currency-dollar', 
          route: '/reportes/financieros' 
        }
      ]
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: 'bi-gear',
      hasSubmenu: true,
      submenu: [
        { 
          title: 'General', 
          icon: 'bi-sliders', 
          route: '/configuracion/general' 
        },
        { 
          title: 'Usuarios', 
          icon: 'bi-person-gear', 
          route: '/configuracion/usuarios' 
        },
        { 
          title: 'Respaldos', 
          icon: 'bi-cloud-arrow-up', 
          route: '/configuracion/respaldos' 
        }
      ]
    }
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
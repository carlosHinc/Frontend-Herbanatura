import { Injectable } from '@angular/core';
import { DataTableConfig } from '@presentation/shared/components/organisms/data-table/data-table.interface';
import { Product } from '@domain/products/products.entity';

/**
 * ViewModel que maneja la configuración de la tabla de productos
 * Centraliza la definición de columnas, renderizado y acciones
 */
@Injectable()
export class ProductsTableConfigViewModel {
  
  /**
   * Genera la configuración completa de la tabla de productos
   * @param products - Array de productos a mostrar en la tabla
   * @param onEdit - Callback cuando se hace clic en editar
   * @param onDelete - Callback cuando se hace clic en eliminar
   * @returns Configuración completa de DataTable
   */
  getTableConfig(
    products: Product[],
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
  ): DataTableConfig<Product> {
    return {
      columns: this.getColumns(),
      actions: this.getActions(onEdit, onDelete),
      data: products,
      trackBy: (index: number, item: Product) => item.id,
    };
  }

  /**
   * Define las columnas de la tabla
   * Cada columna especifica cómo se muestra y formatea la información
   */
  private getColumns() {
    return [
      {
        key: 'name',
        header: 'Nombre',
        customClass: 'product-name',
      },
      {
        key: 'laboratory',
        header: 'Laboratorio',
        customClass: 'laboratory',
      },
      {
        key: 'description',
        header: 'Descripción',
        customClass: 'description',
        render: (product: Product) => product.description || 'Sin descripción',
      },
      {
        key: 'salesPrice',
        header: 'Precio de Venta',
        customClass: 'price',
        render: (product: Product) => this.formatPrice(product.salesPrice),
      },
      {
        key: 'stock',
        header: 'Stock',
        sortable: true,
        renderHtml: (product: Product) => this.renderStockBadge(product.stock),
      },
    ];
  }

  /**
   * Define las acciones disponibles para cada fila
   * @param onEdit - Función a ejecutar al editar
   * @param onDelete - Función a ejecutar al eliminar
   */
  private getActions(
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
  ) {
    return [
      {
        label: 'Editar',
        icon: '✏️',
        handler: (product: Product) => onEdit(product.id),
        class: 'btn-edit',
        title: 'Editar',
      },
      {
        label: 'Eliminar',
        icon: '🗑️',
        handler: (product: Product) => onDelete(product.id),
        class: 'btn-delete',
        title: 'Eliminar',
      },
    ];
  }

  /**
   * Formatea el precio en formato de moneda colombiana
   * @param price - Precio a formatear
   * @returns String con formato de moneda
   */
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Renderiza el badge de stock con clase especial si está bajo
   * @param stock - Cantidad en stock
   * @returns HTML string del badge
   */
  private renderStockBadge(stock: number): string {
    const lowStockClass = stock < 10 ? 'low-stock' : '';
    return `<span class="stock-badge ${lowStockClass}">${stock}</span>`;
  }

  /**
   * Umbral para considerar stock bajo
   */
  readonly LOW_STOCK_THRESHOLD = 10;
}

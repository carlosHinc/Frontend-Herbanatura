import { Injectable } from '@angular/core';
import { DataTableConfig } from '@presentation/shared/components/organisms/data-table/data-table.interface';
import { Supplier } from '@domain/suppliers/suppliers.entity';

@Injectable()
export class SuppliersTableConfigViewModel {
  getTableConfig(
    suppliers: Supplier[],
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
  ): DataTableConfig<Supplier> {
    return {
      columns: this.getColumns(),
      actions: this.getActions(onEdit, onDelete),
      data: suppliers,
      trackBy: (index: number, item: Supplier) => item.id,
    };
  }

  private getColumns() {
    return [
      { key: 'name', header: 'Nombre', customClass: 'supplier-name' },
      {
        key: 'cellphone',
        header: 'Celular',
        customClass: 'supplier-cellphone',
      },
      { key: 'address', header: 'Dirección', customClass: 'supplier-address' },
      {
        key: 'comments',
        header: 'Comentarios',
        customClass: 'supplier-comments',
      },
    ];
  }

  private getActions(
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
  ) {
    return [
      {
        label: 'Editar',
        icon: '✏️',
        handler: (s: Supplier) => onEdit(s.id),
        class: 'btn-edit',
        title: 'Editar',
      },
      {
        label: 'Eliminar',
        icon: '🗑️',
        handler: (s: Supplier) => onDelete(s.id),
        class: 'btn-delete',
        title: 'Eliminar',
      },
    ];
  }
}

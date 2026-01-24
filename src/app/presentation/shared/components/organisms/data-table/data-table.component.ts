import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataTableConfig,
  SortOrder,
  SortEvent,
} from './data-table.interface';

@Component({
  standalone: true,
  selector: 'ds-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T = any> {
  // Inputs
  config = input.required<DataTableConfig<T>>();

  // Outputs
  sort = output<SortEvent>();

  // Estado interno
  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortOrder = signal<SortOrder>(null);

  // Método para ordenar
  onSort(columnKey: string): void {
    const column = this.config().columns.find((col) => col.key === columnKey);

    if (!column?.sortable) {
      return;
    }

    // Determinar el nuevo orden
    let newOrder: SortOrder = null;

    if (this.sortColumn() === columnKey) {
      // Si es la misma columna, ciclar el orden
      if (this.sortOrder() === null) {
        newOrder = 'asc';
      } else if (this.sortOrder() === 'asc') {
        newOrder = 'desc';
      } else {
        newOrder = null;
      }
    } else {
      // Si es una columna diferente, empezar en ascendente
      newOrder = 'asc';
    }

    this.sortColumn.set(newOrder === null ? null : columnKey);
    this.sortOrder.set(newOrder);

    this.sort.emit({
      column: columnKey,
      order: newOrder,
    });
  }

  // Método para obtener el ícono de ordenamiento
  getSortIcon(columnKey: string): string {
    if (this.sortColumn() !== columnKey) {
      return '⇅';
    }

    const order = this.sortOrder();
    if (order === 'asc') return '↑';
    if (order === 'desc') return '↓';
    return '⇅';
  }

  // Método para verificar si una columna está activa en el ordenamiento
  isSortActive(columnKey: string): boolean {
    return this.sortColumn() === columnKey && this.sortOrder() !== null;
  }

  // Método para obtener el valor de una celda
  getCellValue(row: T, column: any): string | number {
    if (column.render) {
      return column.render(row);
    }
    return (row as any)[column.key];
  }

  // Método para trackBy
  trackByFn(index: number, item: T): any {
    const trackBy = this.config().trackBy;
    return trackBy ? trackBy(index, item) : index;
  }
}

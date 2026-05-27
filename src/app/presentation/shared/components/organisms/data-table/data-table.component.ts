import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataTableConfig,
  DataTableColumn,
  SortOrder,
  SortEvent,
} from './data-table.interface';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  standalone: true,
  selector: 'ds-data-table',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T> {
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
    if (this.sortColumn() !== columnKey || this.sortOrder() === null) {
      return '⇅';
    }

    return this.sortOrder() === 'asc' ? '↑' : '↓';
  }

  // Método para verificar si una columna está activa en el ordenamiento
  isSortActive(columnKey: string): boolean {
    return this.sortColumn() === columnKey && this.sortOrder() !== null;
  }

  // Método para obtener la configuración del botón de ordenamiento
  getSortButtonConfig(columnKey: string, columnHeader: string) {
    return {
      text: columnHeader + ' ' + this.getSortIcon(columnKey),
      modifiers: this.isSortActive(columnKey)
        ? 'btn--column btn--active-blue'
        : 'btn--column',
      title: 'Ordenar por ' + columnHeader,
    };
  }

  // Método para obtener el valor de una celda
  getCellValue(row: T, column: DataTableColumn<T>): string | number {
    if (column.render) {
      return column.render(row);
    }
    return (row as Record<string, string | number>)[column.key];
  }

  // Método para trackBy
  trackByFn(index: number, item: T): string | number {
    const trackBy = this.config().trackBy;
    return trackBy ? trackBy(index, item) : index;
  }
}

import { Injectable, signal } from '@angular/core';
import {
  PaginatorConfig,
  PageChangeEvent,
} from '@presentation/shared/components/molecules/paginator/paginator.interface';
import { SortEvent } from '@presentation/shared/components/organisms/data-table/data-table.interface';

export interface PaginationSortState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc' | null;
}

@Injectable()
export class PaginationSortViewModel<T> {
  // Estado
  protected readonly searchTerm = signal<string>('');
  protected readonly currentPage = signal<number>(1);
  protected readonly itemsPerPage = signal<number>(5);
  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortOrder = signal<'asc' | 'desc' | null>(null);

  // Signals públicos de solo lectura
  readonly searchTerm$ = this.searchTerm.asReadonly();
  readonly currentPage$ = this.currentPage.asReadonly();
  readonly sortOrder$ = this.sortOrder.asReadonly();

  constructor() {}

  /**
   * Configura el número de items por página
   */
  setItemsPerPage(items: number): void {
    this.itemsPerPage.set(items);
  }

  /**
   * Filtra items basándose en el término de búsqueda
   * @param items - Array de items a filtrar
   * @param searchableFields - Función que retorna los campos a buscar de cada item
   */
  filterItems(items: T[], searchableFields: (item: T) => string[]): T[] {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return items;
    }

    return items.filter((item) => {
      const fields = searchableFields(item);
      return fields.some((field) => field?.toLowerCase().includes(term));
    });
  }

  /**
   * Ordena items basándose en el orden actual
   * @param items - Array de items a ordenar
   * @param getValue - Función que retorna el valor a comparar de cada item
   */
  sortItems(items: T[], getValue: (item: T) => string | number | Date): T[] {
    const sort = this.sortOrder();

    if (!sort) {
      return items;
    }

    return [...items].sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sort === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();

      if (sort === 'asc') {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
  }

  /**
   * Retorna items paginados
   * @param items - Array de items a paginar
   */
  paginateItems(items: T[]): T[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return items.slice(start, end);
  }

  /**
   * Calcula el total de páginas
   * @param totalItems - Total de items
   */
  calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.itemsPerPage());
  }

  /**
   * Genera un mensaje de búsqueda vacía
   */
  getEmptySearchMessage(): string {
    return `No se encontraron resultados que coincidan con "${this.searchTerm()}"`;
  }

  /**
   * Genera la configuración del paginador
   * @param totalItems - Total de items filtrados
   */
  getPaginatorConfig(totalItems: number): PaginatorConfig {
    return {
      currentPage: this.currentPage(),
      totalPages: this.calculateTotalPages(totalItems),
      totalItems,
      itemsPerPage: this.itemsPerPage(),
      maxVisiblePages: 5,
      showInfo: true,
      infoTemplate: 'Mostrando {start}-{end} de {total} elementos',
    };
  }

  // Métodos de búsqueda
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1); // Resetear a la primera página al buscar
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  // Métodos de ordenamiento
  onSort(event: SortEvent): void {
    this.sortColumn.set(event.column);
    this.sortOrder.set(event.order);
    this.currentPage.set(1); // Resetear a la primera página al ordenar
  }

  // Métodos de paginación
  onPageChange(event: PageChangeEvent): void {
    this.currentPage.set(event.page);
  }

  // Método para resetear el estado
  reset(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.sortColumn.set(null);
    this.sortOrder.set(null);
  }
}

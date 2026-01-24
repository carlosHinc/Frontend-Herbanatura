import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorConfig, PageChangeEvent } from './paginator.interface';

@Component({
  standalone: true,
  selector: 'ds-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  // Inputs
  config = input.required<PaginatorConfig>();

  // Outputs
  pageChange = output<PageChangeEvent>();

  // Computed values
  protected readonly pageNumbers = computed(() => {
    const total = this.config().totalPages;
    const current = this.config().currentPage;
    const maxVisible = this.config().maxVisiblePages || 5;
    const pages: number[] = [];

    // Calcular rango de páginas a mostrar
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    let endPage = Math.min(total, startPage + maxVisible - 1);

    // Ajustar si estamos cerca del final
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  protected readonly paginationInfo = computed(() => {
    const cfg = this.config();
    if (cfg.totalItems === 0) return 'No hay elementos';

    const start = (cfg.currentPage - 1) * cfg.itemsPerPage + 1;
    const end = Math.min(cfg.currentPage * cfg.itemsPerPage, cfg.totalItems);

    if (cfg.infoTemplate) {
      return cfg.infoTemplate
        .replace('{start}', start.toString())
        .replace('{end}', end.toString())
        .replace('{total}', cfg.totalItems.toString());
    }

    return `Mostrando ${start}-${end} de ${cfg.totalItems}`;
  });

  protected readonly canGoPrevious = computed(() => {
    return this.config().currentPage > 1;
  });

  protected readonly canGoNext = computed(() => {
    return this.config().currentPage < this.config().totalPages;
  });

  // Métodos de navegación
  goToPage(page: number): void {
    const cfg = this.config();
    if (page >= 1 && page <= cfg.totalPages && page !== cfg.currentPage) {
      this.pageChange.emit({
        page,
        itemsPerPage: cfg.itemsPerPage,
      });
    }
  }

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.goToPage(this.config().currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.goToPage(this.config().currentPage + 1);
    }
  }

  firstPage(): void {
    this.goToPage(1);
  }

  lastPage(): void {
    this.goToPage(this.config().totalPages);
  }
}

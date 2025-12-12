import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GetProductsGateway } from '@domain/products/get-products.gateway';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { HttpGetProductsService } from '@infrastructure/services/products/http-get-products.service';
import { GetProductsViewModel } from '@presentation/view-models/products/get-productos.view-model';
import { ButtonConfigurationInterface } from '@presentation/shared/components/atoms/button/button.interface';
import { H1ConfigurationInterface } from '@presentation/shared/components/atoms/h1/h1.interface';
import { HeaderComponent } from '@presentation/shared/components/molecules/header/header.component';

@Component({
  standalone: true,
  selector: 'app-store-inventory',
  imports: [CommonModule, HeaderComponent, FormsModule],
  providers: [
    GetProductsViewModel,
    GetProductsUseCase,
    {
      provide: GetProductsGateway,
      useClass: HttpGetProductsService,
    },
  ],
  templateUrl: './store-inventory.component.html',
  styleUrl: './store-inventory.component.scss',
})
export class StoreInventoryComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly getProductsVM = inject(GetProductsViewModel);

  // Configuraciones
  addButtonConfig: ButtonConfigurationInterface = {
    text: '+ Agregar Producto',
    color: 'green',
  };

  h1Config: H1ConfigurationInterface = {
    text: 'Inventario de Productos',
    color: 'black',
  };

  // Paginación y búsqueda
  protected readonly searchTerm = signal<string>('');
  protected readonly currentPage = signal<number>(1);
  protected readonly itemsPerPage = 5;

  // Ordenamiento
  protected readonly sortOrder = signal<'asc' | 'desc' | null>(null);

  // Productos filtrados por búsqueda
  protected readonly filteredProducts = computed(() => {
    const products = this.getProductsVM.state().products;
    const term = this.searchTerm().toLowerCase().trim();
    const sort = this.sortOrder();

    let filtered = products;

    // Filtrar por búsqueda
    if (term) {
      filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.laboratory.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    // Ordenar por stock
    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        if (sort === 'asc') {
          return a.stock - b.stock;
        } else {
          return b.stock - a.stock;
        }
      });
    }

    return filtered;
  });

  // Productos paginados
  protected readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  });

  // Total de páginas
  protected readonly totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  });

  // Array de números de página para mostrar
  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Mostrar máximo 5 páginas
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total, current + 2);

    // Ajustar si estamos cerca del inicio o fin
    if (current <= 3) {
      endPage = Math.min(5, total);
    }
    if (current >= total - 2) {
      startPage = Math.max(1, total - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  ngOnInit(): void {
    this.getProductsVM.getProducts();
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
  toggleSortByStock(): void {
    const current = this.sortOrder();
    if (current === null) {
      this.sortOrder.set('asc');
    } else if (current === 'asc') {
      this.sortOrder.set('desc');
    } else {
      this.sortOrder.set(null);
    }
    this.currentPage.set(1); // Resetear a la primera página al ordenar
  }

  getSortIcon(): string {
    const sort = this.sortOrder();
    if (sort === 'asc') return '↑';
    if (sort === 'desc') return '↓';
    return '⇅';
  }

  // Métodos de paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  canGoPrevious(): boolean {
    return this.currentPage() > 1;
  }

  canGoNext(): boolean {
    return this.currentPage() < this.totalPages();
  }

  // Métodos de navegación
  goToAddProduct(): void {
    this.router.navigate(['/inventario/crear-producto']);
  }

  goToEditProduct(id: number): void {
    console.log('goToEditProduct', id);
    this.router.navigate([`/inventario/editar-producto/${id}`]);
  }

  retry(): void {
    this.getProductsVM.getProducts();
  }

  // Helper para mostrar información de paginación
  getPaginationInfo(): string {
    const total = this.filteredProducts().length;
    if (total === 0) return 'No hay productos';

    const start = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage() * this.itemsPerPage, total);

    return `Mostrando ${start}-${end} de ${total} productos`;
  }
}

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GetProductsGateway } from '@domain/products/get-products.gateway';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { HttpGetProductsService } from '@infrastructure/services/products/http-get-products.service';
import { GetProductsViewModel } from '@presentation/view-models/products/get-productos.view-model';
import { ButtonConfigurationInterface } from '@presentation/shared/components/atoms/button/button.interface';
import { H1ConfigurationInterface } from '@presentation/shared/components/atoms/h1/h1.interface';
import { SearchBoxComponent } from '@presentation/shared/components/molecules/search-box/search-box.component';
import { HeaderComponent } from '@presentation/shared/components/molecules/header/header.component';
import { LoadingComponent } from '@presentation/shared/components/molecules/loading/loading.component';
import { ErrorServicesListComponent } from '@presentation/shared/components/molecules/error-services-list/error-services-list.component';
import { EmptyStateComponent } from '@presentation/shared/components/molecules/empty-state/empty-state.component';
import { DataTableComponent } from '@presentation/shared/components/organisms/data-table/data-table.component';
import {
  DataTableConfig,
  SortEvent,
} from '@presentation/shared/components/organisms/data-table/data-table.interface';
import { PaginatorComponent } from '@presentation/shared/components/molecules/paginator/paginator.component';
import {
  PaginatorConfig,
  PageChangeEvent,
} from '@presentation/shared/components/molecules/paginator/paginator.interface';
import { Product } from '@domain/products/products.entity';

@Component({
  standalone: true,
  selector: 'app-store-inventory',
  imports: [
    CommonModule,
    HeaderComponent,
    SearchBoxComponent,
    LoadingComponent,
    ErrorServicesListComponent,
    EmptyStateComponent,
    DataTableComponent,
    PaginatorComponent,
  ],
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
          product.description?.toLowerCase().includes(term),
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

  protected readonly emptySearchMessage = computed(() => {
    return `No se encontraron productos que coincidan con "${this.searchTerm()}"`;
  });

  // Validación de productos cargados exitosamente
  protected readonly hasProductsLoaded = computed(() => {
    return (
      !this.getProductsVM.state().loading &&
      !this.getProductsVM.state().error &&
      this.getProductsVM.state().products.length > 0
    );
  });

  // Validación de inventario vacío
  protected readonly isEmptyInventory = computed(() => {
    return (
      !this.getProductsVM.state().loading &&
      !this.getProductsVM.state().error &&
      this.getProductsVM.state().products.length === 0
    );
  });

  // Configuración de la tabla
  protected readonly tableConfig = computed<DataTableConfig<Product>>(() => ({
    columns: [
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
        render: (product: Product) => {
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(product.salesPrice);
        },
      },
      {
        key: 'stock',
        header: 'Stock',
        sortable: true,
        renderHtml: (product: Product) => {
          const lowStockClass = product.stock < 10 ? 'low-stock' : '';
          return `<span class="stock-badge ${lowStockClass}">${product.stock}</span>`;
        },
      },
    ],
    actions: [
      {
        label: 'Editar',
        icon: '✏️',
        handler: (product: Product) => this.goToEditProduct(product.id),
        class: 'btn-edit',
        title: 'Editar',
      },
      {
        label: 'Eliminar',
        icon: '🗑️',
        handler: (product: Product) => console.log('Eliminar', product.id),
        class: 'btn-delete',
        title: 'Eliminar',
      },
    ],
    data: this.paginatedProducts(),
    trackBy: (index: number, item: Product) => item.id,
  }));

  // Configuración del paginador
  protected readonly paginatorConfig = computed<PaginatorConfig>(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    totalItems: this.filteredProducts().length,
    itemsPerPage: this.itemsPerPage,
    maxVisiblePages: 5,
    showInfo: true,
    infoTemplate: 'Mostrando {start}-{end} de {total} productos',
  }));

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
  onTableSort(event: SortEvent): void {
    if (event.column === 'stock') {
      this.sortOrder.set(event.order);
      this.currentPage.set(1); // Resetear a la primera página al ordenar
    }
  }

  // Métodos de paginación
  onPageChange(event: PageChangeEvent): void {
    this.currentPage.set(event.page);
  }

  // Métodos de navegación
  goToAddProduct(): void {
    this.router.navigate(['/inventario/crear-producto']);
  }

  goToEditProduct(id: number): void {
    this.router.navigate([`/inventario/editar-producto/${id}`]);
  }

  retry(): void {
    this.getProductsVM.getProducts();
  }
}

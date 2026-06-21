import { Component, inject, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GetProductsGateway } from '@domain/products/get-products.gateway';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { HttpGetProductsService } from '@infrastructure/services/products/http-get-products.service';
import { GetProductsViewModel } from '@presentation/view-models/products/get-productos.view-model';
import { PaginationSortViewModel } from '@presentation/view-models/shared/pagination-sort.view-model';
import { ProductsTableConfigViewModel } from '@presentation/view-models/products/products-table-config.view-model';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';
import { SystemActionsCode } from '@domain/auth/auth.response';
import { STORE_INVENTORY_CONFIG } from './store-inventory-ui.config';
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
import { ListTemplateComponent } from '@presentation/shared/components/templates/list.template/list.template.component';
import { StoreInventoryUi } from './store-inventory-ui.interface';

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
    ListTemplateComponent,
  ],
  providers: [
    GetProductsViewModel,
    GetProductsUseCase,
    PaginationSortViewModel,
    ProductsTableConfigViewModel,
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
  private readonly authTokenService = inject(AuthTokenService);

  protected readonly getProductsVM = inject(GetProductsViewModel);

  protected readonly paginationSortVM = inject(
    PaginationSortViewModel<Product>,
  );
  private readonly tableConfigVM = inject(ProductsTableConfigViewModel);

  // Configuración dinámica basada en permisos
  readonly configUI: Signal<StoreInventoryUi> = computed(() => {
    const permissions = this.authTokenService.getPermissions();
    const hasCreatePermission = permissions?.some(
      (p) => p.code === SystemActionsCode.CREATE_PRODUCT,
    );

    return {
      ...STORE_INVENTORY_CONFIG,
      header: {
        ...STORE_INVENTORY_CONFIG.header,
        showButton: hasCreatePermission ?? false,
      },
    };
  });

  // Verificar si el usuario puede editar productos
  protected readonly hasEditPermission = computed(() => {
    const permissions = this.authTokenService.getPermissions();
    return (
      permissions?.some((p) => p.code === SystemActionsCode.EDIT_PRODUCT) ??
      false
    );
  });

  constructor() {
    // Usar el computed para obtener itemsPerPage
    const perPage = STORE_INVENTORY_CONFIG.itemsPerPage;
    this.paginationSortVM.setItemsPerPage(perPage);
  }

  // Productos filtrados por búsqueda y ordenados
  protected readonly filteredAndSortedProducts = computed(() => {
    const products = this.getProductsVM.state().products;

    // Filtrar por búsqueda
    const filtered = this.paginationSortVM.filterItems(
      products,
      (product: Product) => [
        product.name,
        product.laboratory,
        product.description || '',
      ],
    );

    // Ordenar por stock
    return this.paginationSortVM.sortItems(
      filtered,
      (product: Product) => product.stock,
    );
  });

  // Productos paginados
  protected readonly paginatedProducts = computed(() => {
    return this.paginationSortVM.paginateItems(
      this.filteredAndSortedProducts(),
    );
  });

  // Total de páginas
  protected readonly totalPages = computed(() => {
    return this.paginationSortVM.calculateTotalPages(
      this.filteredAndSortedProducts().length,
    );
  });

  protected readonly emptySearchMessage = computed(() => {
    return this.paginationSortVM.getEmptySearchMessage();
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
  protected readonly tableConfig = computed<DataTableConfig<Product>>(() =>
    this.tableConfigVM.getTableConfig(
      this.paginatedProducts(),
      (id: number) => this.goToEditProduct(id),
      (id: number) => this.handleHistory(id),
      this.hasEditPermission(),
    ),
  );

  // Configuración del paginador
  protected readonly paginatorConfig = computed<PaginatorConfig>(() =>
    this.paginationSortVM.getPaginatorConfig(
      this.filteredAndSortedProducts().length,
    ),
  );

  ngOnInit(): void {
    this.getProductsVM.getProducts();
  }

  // Métodos de búsqueda
  onSearchChange(value: string): void {
    this.paginationSortVM.onSearchChange(value);
  }

  clearSearch(): void {
    this.paginationSortVM.clearSearch();
  }

  // Métodos de ordenamiento
  onTableSort(event: SortEvent): void {
    if (event.column === 'stock') {
      this.paginationSortVM.onSort(event);
    }
  }

  // Métodos de paginación
  onPageChange(event: PageChangeEvent): void {
    this.paginationSortVM.onPageChange(event);
  }

  // Métodos de navegación
  goToAddProduct(): void {
    this.router.navigate(['/inventario/crear-producto']);
  }

  goToEditProduct(id: number): void {
    this.router.navigate([`/inventario/editar-producto/${id}`]);
  }

  handleHistory(id: number): void {
    this.router.navigate([`/inventario/productos/historial/${id}`]);
  }

  retry(): void {
    this.getProductsVM.getProducts();
  }
}

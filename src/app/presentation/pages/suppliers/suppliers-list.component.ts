import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GetSuppliersGateway } from '@domain/suppliers/get-suppliers.gateway';
import { GetSuppliersUseCase } from '@application/use-cases/suppliers/get-suppliers.usecase';
import { HttpGetSuppliersService } from '@infrastructure/services/suppliers/http-get-suppliers.service';
import { GetSuppliersViewModel } from '@presentation/view-models/suppliers/get-suppliers.view-model';
import { SuppliersTableConfigViewModel } from '@presentation/view-models/suppliers/suppliers-table-config.view-model';
import { ListTemplateComponent } from '@presentation/shared/components/templates/list.template/list.template.component';
import { HeaderComponent } from '@presentation/shared/components/molecules/header/header.component';
import { SearchBoxComponent } from '@presentation/shared/components/molecules/search-box/search-box.component';
import { LoadingComponent } from '@presentation/shared/components/molecules/loading/loading.component';
import { ErrorServicesListComponent } from '@presentation/shared/components/molecules/error-services-list/error-services-list.component';
import { DataTableComponent } from '@presentation/shared/components/organisms/data-table/data-table.component';
import { PaginatorComponent } from '@presentation/shared/components/molecules/paginator/paginator.component';
import { EmptyStateComponent } from '@presentation/shared/components/molecules/empty-state/empty-state.component';
import { PaginationSortViewModel } from '@presentation/view-models/shared/pagination-sort.view-model';
import { Supplier } from '@domain/suppliers/suppliers.entity';
import { DataTableConfig } from '@presentation/shared/components/organisms/data-table/data-table.interface';

@Component({
  standalone: true,
  selector: 'app-suppliers-list',
  imports: [
    CommonModule,
    ListTemplateComponent,
    HeaderComponent,
    SearchBoxComponent,
    LoadingComponent,
    ErrorServicesListComponent,
    DataTableComponent,
    PaginatorComponent,
    EmptyStateComponent,
  ],
  providers: [
    GetSuppliersViewModel,
    GetSuppliersUseCase,
    PaginationSortViewModel,
    SuppliersTableConfigViewModel,
    {
      provide: GetSuppliersGateway,
      useClass: HttpGetSuppliersService,
    },
  ],
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss'],
})
export class SuppliersListComponent implements OnInit {
  protected readonly router = inject(Router);

  protected readonly getSuppliersVM = inject(GetSuppliersViewModel);
  protected readonly paginationSortVM = inject(
    PaginationSortViewModel<Supplier>,
  );
  private readonly tableConfigVM = inject(SuppliersTableConfigViewModel);

  protected readonly filteredAndSorted = computed(() => {
    const suppliers = this.getSuppliersVM.state().suppliers;
    return this.paginationSortVM.filterItems(suppliers, (s: Supplier) => [
      s.name,
      s.cellphone || '',
      s.address || '',
      s.comments || '',
    ]);
  });

  protected readonly paginated = computed(() =>
    this.paginationSortVM.paginateItems(this.filteredAndSorted()),
  );

  protected readonly totalPages = computed(() =>
    this.paginationSortVM.calculateTotalPages(this.filteredAndSorted().length),
  );

  protected readonly hasLoaded = computed(
    () =>
      !this.getSuppliersVM.state().loading &&
      !this.getSuppliersVM.state().error &&
      this.getSuppliersVM.state().suppliers.length > 0,
  );

  protected readonly isEmpty = computed(
    () =>
      !this.getSuppliersVM.state().loading &&
      !this.getSuppliersVM.state().error &&
      this.getSuppliersVM.state().suppliers.length === 0,
  );

  protected readonly tableConfig = computed<DataTableConfig<Supplier>>(() =>
    this.tableConfigVM.getTableConfig(
      this.paginated(),
      (id) => this.onEdit(id),
      (id) => this.onDelete(id),
    ),
  );

  ngOnInit(): void {
    const perPage = 10;
    this.paginationSortVM.setItemsPerPage(perPage);
    this.getSuppliersVM.getSuppliers();
  }

  onSearchChange(value: string): void {
    this.paginationSortVM.onSearchChange(value);
  }

  clearSearch(): void {
    this.paginationSortVM.clearSearch();
  }

  onPageChange(event: any): void {
    this.paginationSortVM.onPageChange(event);
  }

  onEdit(id: number): void {
    this.router.navigate([`/inventario/editar-proveedor/${id}`]);
  }

  onDelete(id: number): void {
    console.log('Eliminar proveedor', id);
  }

  retry(): void {
    this.getSuppliersVM.getSuppliers();
  }
}

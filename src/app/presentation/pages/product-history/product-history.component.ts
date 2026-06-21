import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { DsHeaderConfig } from '@presentation/shared/components/molecules/header/ds-header.interface';
import { GetProductHistoryGateway } from '@domain/products/get-product-history.gateway';
import { GetProductHistoryUseCase } from '@application/use-cases/products/get-product-history.usecase';
import { HttpGetProductHistoryService } from '@infrastructure/services/products/http-get-product-history.service';
import { GetProductHistoryViewModel } from '@presentation/view-models/products/get-product-history.view-model';
import { HeaderComponent } from '@presentation/shared/components/molecules/header/header.component';
import { LoadingComponent } from '@presentation/shared/components/molecules/loading/loading.component';
import { ErrorServicesListComponent } from '@presentation/shared/components/molecules/error-services-list/error-services-list.component';
import { ButtonComponent } from '@presentation/shared/components/atoms/button/button.component';
import { ButtonConfigurationInterface } from '@presentation/shared/components/atoms/button/button.interface';

@Component({
  standalone: true,
  selector: 'app-product-history',
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    HeaderComponent,
    LoadingComponent,
    ErrorServicesListComponent,
    ButtonComponent,
  ],
  providers: [
    GetProductHistoryViewModel,
    GetProductHistoryUseCase,
    {
      provide: GetProductHistoryGateway,
      useClass: HttpGetProductHistoryService,
    },
  ],
  templateUrl: './product-history.component.html',
  styleUrl: './product-history.component.scss',
})
export class ProductHistoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly vm = inject(GetProductHistoryViewModel);

  protected readonly product = computed(() => this.vm.state().product);
  protected readonly salesHistory = computed(
    () => this.vm.state().salesHistory,
  );
  protected readonly ordersHistory = computed(
    () => this.vm.state().ordersHistory,
  );
  protected readonly expirationDatesHistory = computed(
    () => this.vm.state().expirationDatesHistory,
  );
  protected readonly loading = computed(() => this.vm.state().loading);
  protected readonly error = computed(() => this.vm.state().error);

  protected readonly headerConfig: DsHeaderConfig = {
    h1: { text: 'Historial del Producto', color: 'black' },
    button: { text: '', modifiers: '' },
    showButton: false,
  };

  protected readonly backButtonConfig: ButtonConfigurationInterface = {
    text: '← Volver al listado',
    modifiers: 'btn--green',
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vm.getProductHistory(id);
  }

  protected onRetry(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vm.getProductHistory(id);
  }

  protected goBack(): void {
    this.router.navigate(['/inventario/productos']);
  }
}
